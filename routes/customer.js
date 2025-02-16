const express = require("express");
const router = express.Router();
const {
  listingData,
  hotelData,
  data,
  getOTP,
  registerData,
  login,
  profile,
  categorySuggestion,
  categoryRestaurant,
  allAddress,
  addAddress,
  updateAddress,
  pastOrder,
  paymentInitiate,
  paymentConfirm,
  paymentWebhook,
  liveOrder,
  liveOrderStatus
} = require("../controllers/customer");
const wrapAsync = require("../utils/wrapAsync");
const authMiddleware = require("../utils/jwtAuth");



// Public Routes (no authentication required)
router.get("/data", wrapAsync(data));
router.get("/:id/hotelData", wrapAsync(hotelData));
router.get("/:id/listingData/:category", wrapAsync(listingData));
router.post("/getotp", wrapAsync(getOTP));
router.post("/register", wrapAsync(registerData));
router.post("/login", wrapAsync(login));

// Protected Routes (authentication required)
router.get("/:id/profile", authMiddleware, wrapAsync(profile)); // Only authenticated users can access profile
router.get("/:id/address", authMiddleware, wrapAsync(allAddress)); // Only authenticated users can access address data
router.post("/address", authMiddleware, wrapAsync(addAddress)); // Only authenticated users can add an address
router.post("/address/update", authMiddleware, wrapAsync(updateAddress)); // Only authenticated users can update an address
// router.post("/order", authMiddleware, wrapAsync(order)); // Only authenticated users can update an address
router.get("/:id/past-order", authMiddleware, wrapAsync(pastOrder)); // Only authenticated users can see past orders
router.get("/:id/live-order", authMiddleware, wrapAsync(liveOrder)); // Only authenticated users can see live orders
router.get("/:id/status/live-order", authMiddleware, wrapAsync(liveOrderStatus)); // Only authenticated users can see live orders

// Payment Router
router.post("/payment/initiate",authMiddleware,wrapAsync(paymentInitiate));
router.post("/payment/confirm",authMiddleware,wrapAsync(paymentConfirm));
router.post("/payment/webhook",authMiddleware,wrapAsync(paymentWebhook));


// Category routes (could be public or protected based on your use case)
router.get("/:category/suggestion", wrapAsync(categorySuggestion));
router.get("/:category/restaurant", wrapAsync(categoryRestaurant));

module.exports = router;
