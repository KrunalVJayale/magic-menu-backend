const Rider = require("../models/rider");
const LiveOrder = require("../models/liveOrder");
const Customer = require("../models/customer");
const Owner = require("../models/owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailSender");
const { default: mongoose } = require("mongoose");
const { calculateDistance, calculateTravelTime } = require("../utils/mapUtils");
const PastOrder = require("../models/pastOrder");
const sendPushNotification = require("../utils/notificationHelper");

module.exports.getOTP = async (req, res) => {
  const { name, email, number } = req.body;

  const existingUser = await Rider.findOne({
    $or: [{ email: email }, { number: number }], // Check for matching email or phone number
  });

  if (existingUser) {
    return res.status(400).json({
      status: "Error",
      message: "Rider already registered with this email or phone number",
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
    const existingUser = await Rider.findOne({
      $or: [{ email: email }, { number: number }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: "Error",
        message: "Rider already registered with this email or phone number",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(pass, 10); // Hash with salt rounds = 10

    // Create a new user with hashed password
    const newUser = new Rider({
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
      message: "Rider registered successfully",
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
    const user = await Rider.findOne({ number: number });

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
      { expiresIn: "21d" } // Token valid for 21 days
    );

    // Send token in response
    return res.status(200).json({
      status: "Success",
      message: "User validated successfully",
      token: token, // Token for frontend authentication
      user: user, // Send the user_id along with the token
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports.auth = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format and existence
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or Missing ID" });
    }

    // Fetch rider data excluding password using select
    const data = await Rider.findById(id).select("-password").lean();

    // Check if rider exists
    if (!data) {
      return res.status(404).json({ message: "Rider not found" });
    }

    // Send success response
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in Rider Auth route:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.toggleDuty = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or Missing ID" });
    }

    // Toggle onDuty status directly using $bit for efficiency
    const result = await Rider.updateOne({ _id: id }, [
      { $set: { onDuty: { $not: "$onDuty" } } },
    ]);

    // Check if any document was modified
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Rider not found or status unchanged" });
    }

    // Success response
    return res
      .status(200)
      .json({ message: "Duty status updated successfully" });
  } catch (e) {
    console.error("Error at toggleDuty API:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.newOrder = async (req, res) => {
  try {
    const { rider_latitude, rider_longitude } = req.body;

    const liveOrders = await LiveOrder.find({ status: "PREPAIRING" })
      .select("hotel customer locationIndex ticketNumber") // ✅ added ticketNumber
      .lean();

    if (liveOrders.length === 0) {
      return res
        .status(404)
        .json({ status: "Failure", message: "No orders to deliver." });
    }

    const orderResponses = await Promise.all(
      liveOrders.map(async (order) => {
        let hotelName = "N/A";
        let hotelAddress = "N/A";
        let hotelDistance = 0;
        let hotelTravelTime = 0;
        let customerDistance = 0;

        try {
          const hotel = await Owner.findById(order.hotel)
            .select("hotel location")
            .lean();

          if (hotel?.location) {
            hotelName = hotel.hotel;
            hotelAddress = hotel.location.address || "N/A";

            hotelDistance = Math.round(
              calculateDistance(
                rider_latitude,
                rider_longitude,
                hotel.location.latitude,
                hotel.location.longitude
              )
            );

            hotelTravelTime = calculateTravelTime(hotelDistance);
          }
        } catch (err) {
          console.warn(
            `Hotel fetch failed for order ${order._id}:`,
            err.message
          );
        }

        try {
          const customer = await Customer.findById(order.customer)
            .select("location")
            .lean();

          if (Array.isArray(customer?.location)) {
            const coords = customer.location[order.locationIndex];

            if (coords) {
              customerDistance = Math.round(
                calculateDistance(
                  rider_latitude,
                  rider_longitude,
                  coords.latitude,
                  coords.longitude
                )
              );
            }
          }
        } catch (err) {
          console.warn(
            `Customer fetch failed for order ${order._id}:`,
            err.message
          );
        }

        return {
          _id: order._id,
          ticketNumber: order.ticketNumber, // ✅ included here
          hotelName,
          hotelAddress,
          hotelDistance,
          hotelTravelTime,
          customerDistance,
          timer: 0,
        };
      })
    );

    return res.status(200).json({
      status: "SUCCESS",
      orders: orderResponses,
    });
  } catch (error) {
    console.error("Error in newOrder:", error);
    return res.status(500).json({ status: "Failure", message: error.message });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { id, _id, status } = req.params;

    if (!id || !_id || !status) {
      return res
        .status(400)
        .json({ message: "Missing id, _id, or status parameter" });
    }

    const updated = await LiveOrder.findOneAndUpdate(
      {
        _id,
        $or: [
          { rider: { $exists: false } }, // order not yet claimed
          { rider: id }                  // claimed by same rider
        ],
      },
      { status, rider: id },
      { new: false }
    );

    if (!updated) {
      return res
        .status(403)
        .json({ message: "Order already assigned to another rider" });
    }

    // Set rider availability if it's a new assignment
    await Rider.findByIdAndUpdate(id, {
      isAvailable: false,
      servingOrder: _id,
    });

    return res
      .status(200)
      .json({ message: "Status and rider updated successfully" });
  } catch (error) {
    console.error("Error updating order or rider:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getHotelData = async (req, res) => {
  try {
    const { id } = req.params;

    const liveOrder = await LiveOrder.findById(id);
    if (!liveOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const hotel = await Owner.findById(liveOrder.hotel);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({
      hotelName: hotel.hotel,
      hotelAddress: hotel.location.address,
      hotelPhone: hotel.number,
      hotelCoords: {
        latitude: hotel.location.latitude,
        longitude: hotel.location.longitude,
      },
    });
  } catch (err) {
    console.error("Error in getOrderData:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getOrderData = async (req, res) => {
  const { id } = req.params;

  try {
    const liveOrder = await LiveOrder.findById(id)
      .populate("items.item") // Populate item details from Listing model
      .exec();

    if (!liveOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const hotel = await Owner.findById(liveOrder.hotel);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Transform items to include only name and quantity
    const orderItems = liveOrder.items.map((orderItem) => ({
      name: orderItem.item.name, // Assumes Listing schema has a 'name' field
      quantity: orderItem.quantity,
    }));

    res.status(200).json({
      orderNumber: liveOrder.ticketNumber,
      hotelName: hotel.hotel,
      orderItems: orderItems,
    });
  } catch (error) {
    console.error("Error fetching order data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getCustomerData = async (req, res) => {
  try {
    const { id } = req.params;

    const liveOrder = await LiveOrder.findById(id);
    if (!liveOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const customer = await Customer.findById(liveOrder.customer).select(
      "name number location"
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const index = liveOrder.locationIndex;
    const location = customer.location?.[index];

    if (!location) {
      return res.status(404).json({ message: "Customer location not found" });
    }

    // Construct full address string
    let address = `House No. ${location.houseNo}, ${location.buildingNo}`;
    if (location.landmark) {
      address += `, Landmark: ${location.landmark}`;
    }

    res.status(200).json({
      customerName: customer.name,
      customerPhone: customer.number,
      customerAddress: address,
      customerCords: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  } catch (err) {
    console.error("Error in getCustomerData:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getCompleteOrderData = async (req, res) => {
  try {
    const { id } = req.params;

    const liveOrder = await LiveOrder.findById(id)
      .populate("items.item", "name") // Only fetch 'name' field of item
      .exec();

    if (!liveOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItems = liveOrder.items.map((orderItem) => ({
      name: orderItem.item?.name || "Unknown Item",
      quantity: orderItem.quantity,
    }));

    const orderData = {
      orderNumber: liveOrder.ticketNumber,
      orderItems,
    };

    const customer = await Customer.findById(liveOrder.customer).select(
      "name number location"
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const index = liveOrder.locationIndex ?? 0;
    const location = customer.location?.[index];

    if (!location || !location.houseNo || !location.buildingNo) {
      return res.status(404).json({ message: "Customer location not found" });
    }

    const customerData = {
      customerName: customer.name,
      customerPhone: customer.number,
      customerAddress: `House No. ${location.houseNo}, ${location.buildingNo}, ${location.landmark}`,
    };

    return res.status(200).json({ orderData, customerData });
  } catch (error) {
    console.error("Error in getCompleteOrderData:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delivered Controller
module.exports.completeOrder = async (req, res) => {
  const { order_id } = req.params;
  const { rider_id, otp } = req.body;

  try {
    // 1. Find the live order
    const liveOrder = await LiveOrder.findById(order_id);
    if (!liveOrder) {
      return res.status(404).json({ message: "Live order not found" });
    }

    // 2. OTP validation
    if (parseInt(liveOrder.orderOtp) !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 3. Update status and deliveredAt
    liveOrder.status = "DELIVERED";
    liveOrder.deliveredAt = new Date();

    // 4. Construct the past order object
    const pastOrderData = {
      ticketNumber: liveOrder.ticketNumber,
      orderOtp: liveOrder.orderOtp,
      status: liveOrder.status,
      customer: liveOrder.customer,
      hotel: liveOrder.hotel,
      rider: liveOrder.rider,
      locationIndex: liveOrder.locationIndex,
      items: liveOrder.items,
      remarks: liveOrder.remarks,
      orderedAt: liveOrder.orderedAt,
      servedAt: liveOrder.servedAt,
      arrivedAt: liveOrder.arrivedAt,
      deliveredAt: liveOrder.deliveredAt,
      totalPrice:liveOrder.totalPrice,
    };

    // 5. Save to PastOrder collection
    await new PastOrder(pastOrderData).save();

    // 6. Delete the live order
    await liveOrder.deleteOne();

    // 7. Set rider as available
    await Rider.findByIdAndUpdate(rider_id, {
      isAvailable: true,
      servingOrder: null,
    });

    return res.status(200).json({
      message: "Order marked as delivered and moved to past orders.",
    });
  } catch (error) {
    console.error("Error completing order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.profileInfo = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Rider ID format" });
    }

    const rider = await Rider.findById(id).select(
      "name number email dob gender"
    );

    if (!rider) {
      return res.status(404).json({ error: "Rider not found" });
    }

    return res.status(200).json(rider);
  } catch (error) {
    console.error("Error fetching rider profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.profileEdit = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Rider ID format" });
    }

    const rider = await Rider.findById(id);
    if (!rider) {
      return res.status(404).json({ error: "Rider not found" });
    }

    const { name, number, email, dob, gender } = req.body;

    // Update only allowed fields if provided
    if (name !== undefined) rider.name = name;
    if (number !== undefined) rider.number = number;
    if (email !== undefined) rider.email = email;
    if (dob !== undefined) rider.dob = new Date(dob);
    if (gender !== undefined) rider.gender = gender;

    await rider.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", rider });
  } catch (error) {
    console.error("Error updating rider profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

