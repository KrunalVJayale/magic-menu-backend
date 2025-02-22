const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/owner");
const Listing = require("../models/itemListing");
const LiveOrder = require("../models/liveOrder");
const Customer = require("../models/customer");
const Category = require("../models/category");
const PastOrder = require("../models/pastOrder");
const PaymentLog = require("../models/paymentLog");
const { sendEmail } = require("../utils/emailSender");
const {
  generateTransactionID,
  generateTicket,
} = require("../utils/paymentUtils");
// const { initiatePayment } = require("../utils/paymentHandler");

module.exports.data = async (req, res) => {
  let data = await Owner.find({ isServing: true });
  res.send(data);
};

module.exports.hotelData = async (req, res) => {
  let { id } = req.params;
  let data = await Owner.findById(id);
  // setTimeout(() => {
  //   res.send(data);
  // }, 1000);
  res.send(data);
};

module.exports.listingData = async (req, res) => {
  let { id, category } = req.params;
  let data = await Listing.find({ owner: id, category: category });
  return res.send(data);
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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Customer ID (_id) is required" });
    }

    const data = await LiveOrder.find({ customer: id }).populate("customer");
    if (!data) {
      return res
        .status(404)
        .json({ message: "No past orders found for this customer." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching past orders:", error);
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

    const data = await LiveOrder.findOne({ customer: id });
    if (!data) {
      return res.status(404).json(false);
    } else {
      return res.status(200).json(true);
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

    const data = await PastOrder.find({ customer: id });
    if (!data) {
      return res.status(404).json({ message: "No live order found for you." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching past orders:", error);
    res.status(500).json({ error: "Internal server error" });
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

module.exports.paymentConfirm = async (req, res) => {
  try {
    const { user_id, orderItems, paymentId } = req.body;
    let ticket = generateTicket();

    let payment_Data = await PaymentLog.findById(paymentId);
    if (payment_Data) {
      payment_Data.status = "SUCCESS";
      await payment_Data.save();
    } else {
      console.error("Payment record not found for ID:", paymentId);
      return res.status(500).json({
        status: "Failure",
        message: "Payment record not found for ID:",
      });
    }

    for (let item of orderItems) {
      let order = new LiveOrder({
        item: item._id,
        quantity: item.quantity,
        ticket: ticket,
        status: "Pending",
        customer: user_id,
        hotel: item.restaurantId,
      });

      await order.save();
    }

    return res.status(200).json({
      status: "SUCCESS",
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Error at payment confirm route:", error);
    return res.status(500).json({ status: "Failure", message: error });
  }
};

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

module.exports.liveOrderCancel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "FAILURE",
        message: "User ID is required",
      });
    }

    const deletedOrders = await LiveOrder.deleteMany({ customer:id });

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
