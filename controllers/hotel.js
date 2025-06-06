const Owner = require("../models/owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailSender");
const { default: mongoose } = require("mongoose");
const LiveOrder = require("../models/liveOrder");
const Rider = require("../models/rider");
const admin = require("../config/firebaseAdmin");

module.exports.getOTP = async (req, res) => {
  const { name, email, number } = req.body;

  const existingUser = await Owner.findOne({
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
    const existingUser = await Owner.findOne({
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
    const newUser = new Owner({
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

module.exports.loginRoute = async (req, res) => {
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
    const user = await Owner.findOne({ number: number });

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
    const jwt_token = jwt.sign(
      { id: user._id, number: user.number },
      process.env.JWT_SECRET, // Ensure this is stored in an .env file
      { expiresIn: "21d" } // Token valid for 21 days
    );

    // Send token in response
    return res.status(200).json({
      status: "Success",
      message: "User validated successfully",
      token: jwt_token, // Token for frontend authentication
      user_id: user._id, // Send the user_id along with the token
      user_email: user.email,
      user_name: user.name,
      user_no: user.number,
      hotel: user.hotel || "", // Optional field with fallback
      description: user.description || "", // Optional field with fallback
      logo: user.logo?.url || "", // Optional nested field
      isServing: user.isServing || false, // Boolean fallback
      chef: user.chef || { name: "", number: "" }, // Object fallback
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports.completeProfile = async (req, res) => {
  try {
    const { payload, user_id } = req.body;
    if (!payload || !user_id) {
      return res.status(400).json({ message: "Missing payload or user_id." });
    }

    const { hotel, description, logo, images, categories, chef } = payload;

    // Build the $set object for fields that need updating
    const updateFields = {};

    if (hotel !== undefined) updateFields.hotel = hotel;
    if (description !== undefined) updateFields.description = description;
    if (logo && typeof logo === "object") {
      if (logo.url !== undefined) updateFields["logo.url"] = logo.url;
      if (logo.filename !== undefined)
        updateFields["logo.filename"] = logo.filename;
    }
    if (Array.isArray(images)) updateFields.images = images;
    if (Array.isArray(categories)) updateFields.categories = categories;
    if (chef && typeof chef === "object") {
      if (chef.name !== undefined) updateFields["chef.name"] = chef.name;
      if (chef.number !== undefined)
        updateFields["chef.number"] = Number(chef.number);
    }

    // Perform a single, atomic find-by-ID-and-update
    const updatedOwner = await Owner.findByIdAndUpdate(
      user_id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedOwner) {
      return res.status(404).json({ message: "Owner not found." });
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully.", owner: updatedOwner });
  } catch (err) {
    console.error("Error in completeProfile:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports.authToken = async (req, res) => {
  res.status(200).json({ message: "User is validated Successfully." });
};

module.exports.newOrder = async (req, res) => {
  const { hotel_id } = req.body;

  if (!hotel_id) {
    return res.status(400).json({ error: "hotel_id is required" });
  }

  try {
    const orderExists = await LiveOrder.exists({
      hotel: hotel_id,
      status: "PENDING",
    });

    if (orderExists) {
      return res.status(200).json({ newOrder: true });
    } else {
      return res.status(200).json({ newOrder: false });
    }
  } catch (error) {
    console.error("Error checking new orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getNewOrders = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const orders = await LiveOrder.find({
      hotel: user_id,
      status: "PENDING",
    })
      .populate({
        path: "customer",
        select: "name",
      })
      .populate({
        path: "rider",
        select: "name number legal",
      })
      .populate({
        path: "items.item",
        select: "name discountedPrice", // must be space-separated
      })
      .select("ticketNumber items createdAt rider remarks servedAt customer")
      // .sort({ updatedAt: -1 })
      .lean();

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      ticketNumber: order.ticketNumber,
      customerName: order.customer?.name || "Unknown",
      items: order.items.map((i) => ({
        name: i.item?.name || "Deleted Item",
        quantity: i.quantity,
        price: i.item?.discountedPrice ?? 0, // now `price`
      })),
      createdAt: order.createdAt,
      rider: order.rider
        ? {
            name: order.rider.name,
            number: order.rider.number,
            image: order.rider.legal.passportPhoto.url,
          }
        : {}, // empty object if none
      remarks: order.remarks || "",
      servedAt: order.servedAt,
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error in getReadyOrders:", error.message);
    res.status(500).json({ error: "Failed to fetch ready orders" });
  }
};

//For now there is a fixed id given to the user_id
module.exports.getReadyOrders = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const orders = await LiveOrder.find({
      hotel: user_id,
      restaurantStatus: "READY",
      status: { $in: ["PREPARING", "ACCEPTED"] },
    })
      .populate({
        path: "customer",
        select: "name",
      })
      .populate({
        path: "rider",
        select: "name number legal",
      })
      .populate({
        path: "items.item",
        select: "name discountedPrice", // must be space-separated
      })
      .select("ticketNumber items createdAt rider remarks servedAt customer")
      .sort({ updatedAt: -1 })
      .lean();

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      ticketNumber: order.ticketNumber,
      customerName: order.customer?.name || "Unknown",
      items: order.items.map((i) => ({
        name: i.item?.name || "Deleted Item",
        quantity: i.quantity,
        price: i.item?.discountedPrice ?? 0, // now `price`
      })),
      updatedAt: order.createdAt,
      rider: order.rider
        ? {
            name: order.rider.name,
            number: order.rider.number,
            image: order.rider.legal.passportPhoto.url,
          }
        : {}, // empty object if none
      remarks: order.remarks || "",
      servedAt: order.servedAt,
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error in getReadyOrders:", error.message);
    res.status(500).json({ error: "Failed to fetch ready orders" });
  }
};

module.exports.getPickedUpOrders = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const orders = await LiveOrder.find({
      hotel: user_id,
      status: "PICKEDUP",
    })
      .populate({
        path: "customer",
        select: "name",
      })
      .populate({
        path: "rider",
        select: "name number legal",
      })
      .populate({
        path: "items.item",
        select: "name discountedPrice", // must be space-separated
      })
      .select("ticketNumber items createdAt rider remarks servedAt customer")
      .sort({ updatedAt: -1 })
      .lean();

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      ticketNumber: order.ticketNumber,
      customerName: order.customer?.name || "Unknown",
      items: order.items.map((i) => ({
        name: i.item?.name || "Deleted Item",
        quantity: i.quantity,
        price: i.item?.discountedPrice ?? 0, // now `price`
      })),
      updatedAt: order.updatedAt,
      rider: {
        name: order.rider.name,
        number: order.rider.number,
        image: order.rider.legal.passportPhoto.url,
      },
      remarks: order.remarks || "",
      servedAt: order.servedAt,
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error in getPickedUpOrders:", error.message);
    res.status(500).json({ error: "Failed to fetch picked-up orders" });
  }
};

module.exports.acceptOrder = async (req, res) => {
  try {
    const { order_id, preparationTime } = req.body;

    if (!order_id || !preparationTime) {
      return res
        .status(400)
        .json({ message: "Missing order_id or preparationTime" });
    }

    const order = await LiveOrder.findByIdAndUpdate(
      order_id,
      { preparationTime, status: "PREPARING" },
      { new: true }
    )
      .populate({
        path: "customer",
        select: "name number",
      })
      .populate({
        path: "rider",
        select: "name number legal",
      })
      .populate({
        path: "items.item",
        select: "name discountedPrice",
      })
      .select(
        "ticketNumber items createdAt rider remarks servedAt customer preparationTime"
      )
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const formattedOrder = {
      _id: order._id,
      ticketNumber: order.ticketNumber,
      customerName: order.customer?.name || "Unknown",
      items: order.items.map((i) => ({
        name: i.item?.name || "Deleted Item",
        quantity: i.quantity,
        price: i.item?.discountedPrice ?? 0,
      })),
      createdAt: order.createdAt,
      rider: order.rider
        ? {
            name: order.rider.name,
            number: order.rider.number,
            image: order.rider.legal?.passportPhoto?.url || "",
          }
        : undefined,
      remarks: order.remarks || "",
      servedAt: order.servedAt,
      preparationTime: order.preparationTime,
    };

    res.status(200).json(formattedOrder);
  } catch (error) {
    console.error("Accept Order Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.readyOrder = async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({ error: "order_id is required" });
  }

  try {
    const updatedOrder = await LiveOrder.findByIdAndUpdate(
      order_id,
      { restaurantStatus: "READY" },
      { new: true }
    ).populate("hotel", "hotel");

    const restaurantName = updatedOrder?.hotel?.hotel || "A restaurant";

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Get all available riders with valid FCM tokens
    const riders = await Rider.find({ onDuty: true, isAvailable: true });
    const tokenEntries = [];
    riders.forEach((r) => {
      (r.fcmToken || []).forEach((t) => {
        tokenEntries.push({ riderId: r._id, token: t });
      });
    });
    const allTokens = tokenEntries.map((e) => e.token);

    let sendRes = { successCount: 0, failureCount: 0, responses: [] };
    if (allTokens.length) {
      const payload = {
        android: {
          notification: {
            sound: "magicmenu_zing_enhanced",
            channelId: "custom-sound-channel",
            title: `✅ ${restaurantName} - Order Ready`,
            body: "Order is prepared and ready for pickup. Head to the restaurant now! 🚗",
          },
        },
      };

      if (typeof admin.messaging().sendMulticast === "function") {
        sendRes = await admin
          .messaging()
          .sendMulticast({ ...payload, tokens: allTokens });
      } else {
        // Fallback one-by-one
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

      // Remove invalid tokens
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
          Rider.findByIdAndUpdate(rId, { $pull: { fcmToken: { $in: tokens } } })
        )
      );
    }

    return res.status(200).json({ status: "READY" });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.almostReadyOrder = async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({ error: "order_id is required" });
  }

  try {
    const updatedOrder = await LiveOrder.findByIdAndUpdate(
      order_id,
      { restaurantStatus: "ALMOST_READY" },
      { new: true }
    ).populate("hotel", "hotel");

    const restaurantName = updatedOrder?.hotel?.hotel || "A restaurant";

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Get all available riders with valid FCM tokens
    const riders = await Rider.find({ onDuty: true, isAvailable: true });
    const tokenEntries = [];
    riders.forEach((r) => {
      (r.fcmToken || []).forEach((t) => {
        tokenEntries.push({ riderId: r._id, token: t });
      });
    });
    const allTokens = tokenEntries.map((e) => e.token);

    let sendRes = { successCount: 0, failureCount: 0, responses: [] };
    if (allTokens.length) {
      const payload = {
        android: {
          notification: {
            sound: "magicmenu_zing_enhanced",
            channelId: "custom-sound-channel",
            title: `⏳ ${restaurantName} - Order Almost Ready`,
            body: "The order will be ready in 5 minutes. Get prepared to pick it up! 🚀",
          },
        },
      };

      if (typeof admin.messaging().sendMulticast === "function") {
        sendRes = await admin
          .messaging()
          .sendMulticast({ ...payload, tokens: allTokens });
      } else {
        // Fallback one-by-one
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

      // Remove invalid tokens
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
          Rider.findByIdAndUpdate(rId, { $pull: { fcmToken: { $in: tokens } } })
        )
      );
    }

    return res.status(200).json({ status: "ALMOST_READY" });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
