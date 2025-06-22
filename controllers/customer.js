const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/owner");
const { default: mongoose } = require("mongoose");
const Listing = require("../models/itemListing");
const LiveOrder = require("../models/liveOrder");
const Customer = require("../models/customer");
const Category = require("../models/category");
const PastOrder = require("../models/pastOrder");
const PaymentLog = require("../models/paymentLog");
const Rider = require("../models/rider");
const { sendEmail } = require("../utils/emailSender");
const {
  generateTransactionID,
  generateTicket,
} = require("../utils/paymentUtils");
const { calculateDistance } = require("../utils/mapUtils");
const admin = require("../config/firebaseAdmin");
// const { initiatePayment } = require("../utils/paymentHandler");

module.exports.data = async (req, res) => {
  const { user_id } = req.params;

  // 1. Fetch the customer
  const customer = await Customer.findById(user_id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  // 2. Look for a default location
  const defaultLoc = Array.isArray(customer.location)
    ? customer.location.find((loc) => loc.isDefault)
    : null;

  // 3. Fetch all serving owners
  const owners = await Owner.find();

  // 4. If no default location, send the raw owners data
  if (!defaultLoc) {
    return res.status(200).json(owners);
  }

  // 5. Now that we know defaultLoc exists, destructure safely
  const { latitude: custLat, longitude: custLon } = defaultLoc;

  // 6. Compute delivery times per owner
  const enrichedOwners = owners.map((ownerDoc) => {
    const owner = ownerDoc.toObject();
    const { latitude: ownLat, longitude: ownLon } = owner.location || {};

    // If an owner somehow lacks coords, skip the calculation and return raw
    if (ownLat == null || ownLon == null) {
      return owner;
    }

    const distanceKm = calculateDistance(custLat, custLon, ownLat, ownLon);
    const travelTimeMin = (distanceKm / 25) * 60;
    const deliveryTimeMin = Math.round(travelTimeMin + 10);

    return {
      ...owner,
      distanceKm: Math.round(distanceKm),
      deliveryTimeMin,
    };
  });

  // 7. Send enriched data
  res.status(200).json(enrichedOwners);
};

module.exports.hotelData = async (req, res) => {
  try {
    const { id, _id } = req.params;

    // Fetching customer default location and hotel data in parallel for speed
    const [customerData, hotelData] = await Promise.all([
      Customer.findById(_id, "location").lean(),
      Owner.findById(id).lean(),
    ]);

    if (!customerData || !hotelData) {
      return res
        .status(404)
        .send({ error: "Customer or Hotel data not found." });
    }

    // Extracting default location
    const defaultLocation = customerData.location?.find(
      (loc) => loc.isDefault === true
    );
    if (!defaultLocation) {
      return res.status(200).send(hotelData);
    }

    // Calculating distance and estimated time
    const { latitude: lat1, longitude: lon1 } = defaultLocation;
    const { latitude: lat2, longitude: lon2 } = hotelData.location;

    const averageSpeed = 25; // km/h
    const distance = calculateDistance(lat1, lon1, lat2, lon2).toFixed(2);
    const estimatedDeliveryTime = ((distance / averageSpeed) * 60).toFixed(2);

    // Adding distance and estimated time directly to hotelData
    hotelData.distance = Math.round(distance);
    hotelData.estimatedTime = Math.round(estimatedDeliveryTime);

    res.send(hotelData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while fetching data" });
  }
};

module.exports.listingData = async (req, res) => {
  let { id, category } = req.params;
  let data = await Listing.find({ owner: id, category: category });
  return res.send(data);
};

module.exports.getAddOns = async (req, res) => {
  const { itemIds } = req.body;

  if (!Array.isArray(itemIds) || itemIds.length === 0) {
    return res
      .status(400)
      .json({ message: "itemIds must be a non-empty array" });
  }

  try {
    // Step 1: Get addOn IDs from given listings
    const items = await Listing.find({ _id: { $in: itemIds } }, "addOns");

    const allAddOnIds = items.flatMap(
      (item) => item.addOns?.map((addOn) => addOn._id.toString()) || []
    );

    const uniqueAddOnIds = [...new Set(allAddOnIds)];

    // Step 2: Fetch only in-stock add-ons with selected fields
    const addOns = await Listing.find({
      _id: { $in: uniqueAddOnIds },
      inStock: true,
    }).select(
      "_id name description category discountedPrice originalPrice images owner isVeg"
    );

    res.status(200).json({ addOns });
  } catch (error) {
    console.error("Error fetching add-ons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getOTP = async (req, res) => {
  const { name, email, number } = req.body;

  const existingUser = await Customer.findOne({
    $or: [{ email: email }, { number: number }], // Check for matching email or phone number
  });

  if (existingUser) {
    return res.status(400).json({
      status: "Error",
      message: "User already registered with this email or phone number",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const emailResponse = await sendEmail(name, email, otp);
  if (emailResponse.status === 200) {
    return res.status(200).json({
      status: "Success",
      message: "OTP created successfully and email sent",
      otp: otp, // Include OTP in the response
    });
  } else {
    return res.status(500).json({
      status: "Error",
      message: "OTP created, but failed to send email",
    });
  }
};

module.exports.registerData = async (req, res) => {
  const { name, number, email, pass } = req.body;

  // Check for missing fields
  if (!name || !number || !email || !pass) {
    return res
      .status(400)
      .json({ status: "Error", message: "Missing required fields" });
  }

  try {
    // Check if the email or phone number is already in use
    const existingUser = await Customer.findOne({
      $or: [{ email: email }, { number: number }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: "Error",
        message: "User already registered with this email or phone number",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(pass, 10); // Hash with salt rounds = 10

    // Create a new user with hashed password
    const newUser = new Customer({
      name: name,
      email: email,
      number: number,
      password: hashedPassword, // Store hashed password
    });

    // Save the user and await the operation
    await newUser.save();

    // Send a success response
    return res.status(201).json({
      status: "Success",
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error in registerData:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

module.exports.login = async (req, res) => {
  const { number, pass } = req.body;

  // Check for missing fields
  if (!number || !pass) {
    return res.status(400).json({
      status: "Error",
      message: "Number and password are required",
    });
  }

  try {
    // Find user by number
    const user = await Customer.findOne({ number: number });

    // If user does not exist
    if (!user) {
      return res.status(404).json({
        status: "Error",
        message: "User does not exist. Please check the number and try again.",
      });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "Error",
        message: "Incorrect password. Please try again.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, number: user.number },
      process.env.JWT_SECRET, // Ensure this is stored in an .env file
      { expiresIn: "21d" } // Token valid for 7 days
    );

    // Send token in response
    return res.status(200).json({
      status: "Success",
      message: "User validated successfully",
      token: token, // Token for frontend authentication
      user_id: user._id, // Send the user_id along with the token
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports.profile = async (req, res) => {
  let { id } = req.params;
  let data = await Customer.findById(id);
  res.send(data);
};

module.exports.registerFCM = async (req, res) => {
  const { id } = req.params;
  const { token } = req.body;

  try {
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Ensure fcmToken is initialized
    if (!Array.isArray(customer.fcmToken)) {
      customer.fcmToken = [];
    }

    // Add token only if it doesn't already exist
    if (!customer.fcmToken.includes(token)) {
      customer.fcmToken.push(token);
      await customer.save();
    }

    return res.status(200).json({ message: "FCM Token saved successfully" });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.categorySuggestion = async (req, res) => {
  const { category } = req.params;
  let data = await Category.find({
    name: { $regex: category, $options: "i" },
  }).limit(5);
  res.send(data);
};

module.exports.categoryRestaurant = async (req, res) => {
  const { category } = req.params;

  try {
    const data = await Listing.aggregate([
      {
        $match: { category: category }, // Match listings by category
      },
      {
        $group: {
          _id: "$owner", // Group by owner
        },
      },
      {
        $lookup: {
          from: "owners", // Get the owner data
          localField: "_id", // Match by owner ID
          foreignField: "_id", // Foreign field is the _id of the owner
          as: "owner", // Populate the owner field
        },
      },
      {
        $unwind: "$owner", // Unwind the owner to get a single object
      },
    ]);

    res.send(data); // Send only the owner data
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching data" });
  }
};

module.exports.updateAddress = async (req, res) => {
  const {
    _id,
    addressId,
    title,
    location,
    houseNo,
    buildingNo,
    landmark,
    isDefault,
  } = req.body;

  try {
    const existingUser = await Customer.findById(_id);
    if (!existingUser) {
      return res.status(404).json({
        status: "Error",
        message: "User not found",
      });
    }
    const order = await LiveOrder.findOne({ customer: _id });
    if (order) {
      return res.status(400).json({
        status: "Error",
        message:
          "Address update is disabled while an order is in progress. Please wait until the current order is delivered.",
      });
    }

    const addressIndex = existingUser.location.findIndex(
      (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return res.status(404).json({
        status: "Error",
        message: "Address not found",
      });
    }

    // Update only the required fields
    existingUser.location[addressIndex] = {
      ...existingUser.location[addressIndex],
      title,
      latitude: location.latitude,
      longitude: location.longitude,
      houseNo,
      buildingNo,
      landmark,
    };

    await existingUser.save();

    return res.status(200).json({
      status: "Success",
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

module.exports.allAddress = async (req, res) => {
  let { id } = req.params;
  let data = await Customer.findById(id, { location: 1 });
  res.send(data.location);
};

module.exports.updateDefault = async (req, res) => {
  let { id, addressId } = req.params; // Ensure addressId is extracted
  try {
    const existingUser = await Customer.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        status: "Error",
        message: "User not found",
      });
    }

    const addressIndex = existingUser.location.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        status: "Error",
        message: "Address not found",
      });
    }

    // Reset all addresses to isDefault: false
    existingUser.location.forEach((addr) => (addr.isDefault = false));

    // Set the selected address as default
    existingUser.location[addressIndex].isDefault = true;

    await existingUser.save();

    return res.status(200).json({
      status: "Success",
      message: "Default address updated successfully",
    });
  } catch (error) {
    console.error("Error updating default address:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

module.exports.deleteAddress = async (req, res) => {
  let { id, addressId } = req.params; // Ensure addressId is extracted
  try {
    const existingUser = await Customer.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        status: "Error",
        message: "User not found",
      });
    }

    // Block deletion if a live order exists
    const liveOrder = await LiveOrder.findOne({ customer: id });
    if (liveOrder) {
      return res.status(400).json({
        status: "Error",
        message: "Address cannot be deleted while an order is in progress.",
      });
    }

    const addressIndex = existingUser.location.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        status: "Error",
        message: "Address not found",
      });
    }

    // Remove the address from the array
    existingUser.location.splice(addressIndex, 1);

    // If the deleted address was the default, set another one as default
    if (
      existingUser.location.length > 0 &&
      !existingUser.location.some((addr) => addr.isDefault)
    ) {
      existingUser.location[0].isDefault = true;
    }

    await existingUser.save();

    return res.status(200).json({
      status: "Success",
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

module.exports.addAddress = async (req, res) => {
  const { _id, title, location, houseNo, buildingNo, landmark, isDefault } =
    req.body;
  let latitude = location.latitude;
  let longitude = location.longitude;
  try {
    const existingUser = await Customer.findById(_id);
    if (!existingUser) {
      return res.status(404).json({
        status: "Error",
        message: "User not found",
      });
    }
    existingUser.location.push({
      title,
      latitude,
      longitude,
      houseNo,
      buildingNo,
      landmark,
      isDefault,
    });
    await existingUser.save();
    return res.status(200).json({
      status: "Success",
      message: "Address added successfully",
    });
  } catch (error) {
    console.error("Error in saving address:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

// Live-Order Route
module.exports.liveOrder = async (req, res) => {
  try {
    const { id, orderId } = req.params;

    if (!id || !orderId) {
      return res
        .status(400)
        .json({ error: "Customer ID and Order ID are required" });
    }

    const order = await LiveOrder.findOne({
      customer: id,
      _id: orderId,
    }).populate({
      path: "customer",
      select: "-password", // Exclude password
    });

    if (!order) {
      return res.status(404).json({ message: "Live order not found." });
    }

    const hotelLocation = await Owner.findById(order.hotel);
    const { latitude: lat1, longitude: lon1 } = hotelLocation.location;
    const { latitude: lat2, longitude: lon2 } =
      order.customer.location[order.locationIndex];

    const distance = calculateDistance(lat1, lon1, lat2, lon2).toFixed(2);
    const estimatedDeliveryTime = (
      (distance / 25) * 60 +
      order.preparationTime
    ).toFixed(2); // in minutes

    let riderData = null;
    if (order.rider) {
      const rider = await Rider.findById(order.rider).select("name number");
      if (rider) {
        riderData = {
          name: rider.name,
          number: rider.number,
        };
      }
    }

    const orderWithExtras = {
      ...order.toObject(),
      distance,
      estimatedDeliveryTime: Math.round(estimatedDeliveryTime),
      rider: riderData,
    };

    // ✅ Return an array with one object to keep frontend unchanged
    res.status(200).json([orderWithExtras]);
  } catch (error) {
    console.error("Error fetching live order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Live Order Status
module.exports.liveOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Customer ID (_id) is required" });
    }

    const data = await LiveOrder.find({ customer: id });
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No order found" });
    } else {
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error("Error fetching past orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Past-Order Route //
module.exports.pastOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Customer ID (_id) is required" });
    }

    const data = await PastOrder.find({ customer: id })
      .populate({
        path: "hotel",
        select: "hotel isServing location logo",
      })
      .populate({
        path: "payment",
        select: "transactionId status amount createdAt",
      })
      .sort({ orderedAt: -1 });

    if (!data || data.length === 0) {
      return res.status(200).json({ message: "No past orders found for you." });
    }

    const formattedData = data.map((order) => ({
      _id: order._id,
      ticketNumber: order.ticketNumber,
      orderOtp: order.orderOtp,
      status: order.status,
      customer: order.customer,
      hotel: order.hotel,
      payment: order.payment, // now included
      items: order.items,
      deliveryAddress: order.deliveryAddress,
      orderedAt: order.orderedAt,
      deliveredAt: order.deliveredAt,
      totalPrice: order.totalPrice,
    }));

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching past orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Payment Route //
module.exports.paymentInitiate = async (req, res) => {
  try {
    const { user_id, sub_Total } = req.body;
    const transaction_Id = generateTransactionID();

    const mobile_Number = await Customer.findById(user_id, { number: 1 });
    const payment_Data = await PaymentLog.create({
      transactionId: transaction_Id,
      status: "PENDING",
      customer: user_id,
      amount: sub_Total,
    });
    const payment_Id = payment_Data._id;

    return res.json({
      status: 200,
      payment_Id,
      merchant_Id: process.env.PHONEPE_MERCHANT_ID,
      transaction_Id,
      merchant_User_Id: process.env.PHONEPE_USER_ID,
      mobile_Number,
      environment: process.env.PHONEPE_ENVIRONMENT,
      salt_Index: process.env.PHONEPE_SALT_INDEX,
      salt_Key: process.env.PHONEPE_SALT_KEY,
      callback_Url: process.env.PHONEPE_CALLBACK_URL,
    });
  } catch (error) {
    console.log("Error at payment initiate route:", error);
    res.status(500).json({ error: error.message });
  }
};

// module.exports.paymentConfirm = async (req, res) => {

//   try {
//     const { user_id, orderItems, paymentId, locationIndex } = req.body;
//     let ticket = generateTicket();
//     let otp = generateTicket();

//     let payment_Data = await PaymentLog.findById(paymentId);
//     if (payment_Data) {
//       payment_Data.status = "SUCCESS";
//       await payment_Data.save();
//     } else {
//       console.error("Payment record not found for ID:", paymentId);
//       return res.status(500).json({
//         status: "Failure",
//         message: "Payment record not found for ID:",
//       });
//     }

//     for (let item of orderItems) {
//       let order = new LiveOrder({
//         item: item._id,
//         quantity: item.quantity,
//         ticket: ticket,
//         otp:otp,
//         status: "Pending",
//         customer: user_id,
//         hotel: item.restaurantId,
//         locationIndex:locationIndex,
//       });

//       await order.save();
//     }

//     return res.status(200).json({
//       status: "SUCCESS",
//       message: "Order placed successfully",
//     });
//   } catch (error) {
//     console.error("Error at payment confirm route:", error);
//     return res.status(500).json({ status: "Failure", message: error });
//   }
// };

// // Secure webhook endpoint for receiving PhonePe updates
// module.exports.paymentWebhook = async (req, res) => {
//   // For production, add checksum verification here
//   const { transactionId, status } = req.body;

//   const existingLog = await PaymentLog.findOne({ transactionId });
//   if (!existingLog) return res.status(400).json({ error: "Invalid transaction" });

//   // Update the payment status in your logs
//   existingLog.status = status;
//   await existingLog.save();

//   // Here, you could also update the related order in your database

//   res.json({ message: "Webhook received" });
// };

module.exports.paymentConfirm = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { user_id, orderItems, paymentId, locationIndex, amount } = req.body;
    if (
      !user_id ||
      !orderItems?.length ||
      !paymentId ||
      locationIndex == null ||
      !amount
    ) {
      return res
        .status(400)
        .json({ status: "Failure", message: "Missing required fields" });
    }

    session.startTransaction();

    // 1. Update payment status
    const paymentRecord = await PaymentLog.findByIdAndUpdate(
      paymentId,
      { status: "SUCCESS" },
      { new: true, session }
    );
    if (!paymentRecord) {
      throw new Error(`Payment record not found: ${paymentId}`);
    }

    // 2. Create live order
    const ticketNumber = generateTicket();
    const orderOtp = generateTicket();
    const orderData = {
      ticketNumber,
      orderOtp,
      customer: user_id,
      locationIndex,
      hotel: orderItems[0].restaurantId,
      items: orderItems.map((i) => ({ item: i._id, quantity: i.quantity })),
      totalPrice: amount,
      payment:paymentId,
    };
    const [createdOrder] = await LiveOrder.create([orderData], { session });

    // 3. Gather tokens
    const riders = await Rider.find({ onDuty: true, isAvailable: true }, null, {
      session,
    });
    const tokenEntries = [];
    riders.forEach((r) =>
      (r.fcmToken || []).forEach((t) =>
        tokenEntries.push({ riderId: r._id, token: t })
      )
    );
    const allTokens = tokenEntries.map((e) => e.token);

    let sendRes = { successCount: 0, failureCount: 0, responses: [] };
    if (allTokens.length) {
      const payload = {
        // notification: {
        //   // imageUrl: 'https://res.cloudinary.com/dcgskimn8/image/upload/v1748271323/icon2_ksz1me.png',
        // },
        android: {
          notification: {
            sound: "magicmenu_zing_enhanced",
            channelId: "custom-sound-channel",
            title: "🚨 Incoming Order Request!",
            body: "Someone’s hungry and counting on you. Tap to accept.⚡️",
          },
        },
      };

      if (typeof admin.messaging().sendMulticast === "function") {
        sendRes = await admin
          .messaging()
          .sendMulticast({ ...payload, tokens: allTokens });
      } else {
        // Fallback: send one-by-one with try/catch
        const results = await Promise.all(
          allTokens.map(async (token) => {
            try {
              await admin.messaging().send({ ...payload, token });
              return { success: true };
            } catch (error) {
              return { success: false, error };
            }
          })
        );
        sendRes = {
          successCount: results.filter((r) => r.success).length,
          failureCount: results.filter((r) => !r.success).length,
          responses: results,
        };
      }

      // 4. Clean invalid tokens
      const invalidMap = {};
      sendRes.responses.forEach((resp, idx) => {
        if (
          !resp.success &&
          resp.error?.code &&
          [
            "messaging/invalid-registration-token",
            "messaging/registration-token-not-registered",
          ].includes(resp.error.code)
        ) {
          const { riderId, token } = tokenEntries[idx];
          invalidMap[riderId] = invalidMap[riderId] || [];
          invalidMap[riderId].push(token);
        }
      });
      await Promise.all(
        Object.entries(invalidMap).map(([rId, tokens]) =>
          Rider.findByIdAndUpdate(
            rId,
            { $pull: { fcmToken: { $in: tokens } } },
            { session }
          )
        )
      );
    }

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      status: "SUCCESS",
      id: createdOrder._id,
      message: "Order placed and riders notified",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction aborted, error:", err);
    return res.status(500).json({ status: "Failure", message: err.message });
  }
};

module.exports.liveOrderCancel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "FAILURE",
        message: "User ID is required",
      });
    }

    const deletedOrders = await LiveOrder.deleteMany({ customer: id });

    if (deletedOrders.deletedCount === 0) {
      return res.status(404).json({
        status: "FAILURE",
        message: "No live orders found for cancellation",
      });
    }

    return res.status(200).json({
      status: "SUCCESS",
      message: "Live order(s) cancelled successfully",
    });
  } catch (error) {
    console.error("Error at cancel order route:", error);
    return res.status(500).json({
      status: "FAILURE",
      message: "An error occurred while cancelling the order",
    });
  }
};
