const Rider = require("../models/rider");
const LiveOrder = require("../models/liveOrder");
const Customer = require("../models/customer");
const Owner = require("../models/owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailSender");
const { default: mongoose } = require("mongoose");
const { calculateDistance, calculateTravelTime } = require("../utils/mapUtils");

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
    const result = await Rider.updateOne(
      { _id: id },
      [{ $set: { onDuty: { $not: "$onDuty" } } }]
    );

    // Check if any document was modified
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Rider not found or status unchanged" });
    }

    // Success response
    return res.status(200).json({ message: "Duty status updated successfully" });
  } catch (e) {
    console.error("Error at toggleDuty API:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.newOrder = async (req, res) => {
  try {
    const {
      hotel_id,
      ticket_no,
      rider_latitude,
      rider_longitude
    } = req.body;

    // 1) Fetch all orders with the same hotel and ticket number (only for validation)
    const liveOrders = await LiveOrder
      .find({ hotel: hotel_id, ticketNumber: ticket_no })
      .select("customer locationIndex")
      .lean();
      
    if (liveOrders.length === 0) {
      return res.status(404).json({ status: "Failure", message: "No orders found." });
    }

    // 2) Hotel info + numeric distance
    const hotel = await Owner
      .findById(hotel_id)
      .select("hotel location")
      .lean();
    if (!hotel) {
      return res.status(404).json({ status: "Failure", message: "Hotel not found." });
    }
    
    const hotelDistance = Math.round(
      calculateDistance(
        rider_latitude,
        rider_longitude,
        hotel.location.latitude,
        hotel.location.longitude
      )
    );
    const hotelTravelTime = calculateTravelTime(hotelDistance);

    // 3) Customer info + numeric distance
    const customer = await Customer
      .findById(liveOrders[0].customer)
      .select("name location")
      .lean();
    if (!customer) {
      return res.status(404).json({ status: "Failure", message: "Customer not found." });
    }

    // Handling location index for customer's coordinates
    const customerCoords = customer.location[liveOrders[0].locationIndex];
    if (!customerCoords) {
      return res.status(400).json({ status: "Failure", message: "Invalid location index for customer." });
    }

    const customerDistance = Math.round(
      calculateDistance(
        rider_latitude,
        rider_longitude,
        customerCoords.latitude,
        customerCoords.longitude
      )
    );

    // 4) Build response in the required format
    const orderResponse = {
      id: ticket_no, // Using ticket number as order ID
      hotelName: hotel.hotel,
      hotelAddress: hotel.location.address,
      hotelDistance: hotelDistance,
      hotelTravelTime: hotelTravelTime,
      customerDistance: customerDistance,
      timer: 0 // Can be updated with actual timer logic if needed
    };

    // 5) Respond
    return res.status(200).json({
      status: "SUCCESS",
      order: orderResponse
    });
  } catch (error) {
    console.error("Error in newOrder:", error);
    return res.status(500).json({ status: "Failure", message: error.message });
  }
};
