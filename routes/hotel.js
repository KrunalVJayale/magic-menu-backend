const express = require('express');
const router = express.Router();
const {homeRoute, loginRoute, getOTP, registerData, completeProfile, authToken, getReadyOrders, getPickedUpOrders, getNewOrders, acceptOrder, readyOrder, almostReadyOrder, newOrder, toggleDuty, getRestaurantData, getRestaurantCategories, getCategoriesItems, changeListingStockStatus, addListing, changeListingRecommendStatus, addCategory } = require('../controllers/hotel');
const wrapAsync = require('../utils/wrapAsync');
const authMiddleware = require('../utils/jwtAuth');


router.get('/home', wrapAsync(homeRoute));
router.post('/login', wrapAsync(loginRoute));
router.post("/getotp", wrapAsync(getOTP));
router.post("/register", wrapAsync(registerData));
router.post("/complete-profile", authMiddleware,wrapAsync(completeProfile));
router.get('/verify-token',authMiddleware, wrapAsync(authToken));
router.get('/:id/toggleDuty',authMiddleware,wrapAsync(toggleDuty));
router.get('/:user_id/get-new-orders',authMiddleware, wrapAsync(getNewOrders));
router.get('/:user_id/get-ready-orders',authMiddleware, wrapAsync(getReadyOrders));
router.get('/:user_id/get-pickedup-orders',authMiddleware, wrapAsync(getPickedUpOrders));
router.post('/new-order',authMiddleware, wrapAsync(newOrder));
router.post('/accept-order',authMiddleware, wrapAsync(acceptOrder));
router.post('/ready-order',authMiddleware, wrapAsync(readyOrder));
router.post('/almost-ready-order',authMiddleware, wrapAsync(almostReadyOrder));

//Menu routes
router.get('/:user_id/get-restaurant-data',authMiddleware, wrapAsync(getRestaurantData));
router.get('/:user_id/get-categories',authMiddleware, wrapAsync(getRestaurantCategories));
router.get('/:user_id/get-category-listings/:category',authMiddleware, wrapAsync(getCategoriesItems));
router.patch('/change-listing-stock-status/:item_id',authMiddleware, wrapAsync(changeListingStockStatus));
router.patch('/change-listing-recommend-status/:item_id',authMiddleware, wrapAsync(changeListingRecommendStatus));
router.post('/:user_id/add-listing',authMiddleware, wrapAsync(addListing));
router.post('/:user_id/add-category',authMiddleware, wrapAsync(addCategory));



module.exports = router;