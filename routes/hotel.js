const express = require('express');
const router = express.Router();
const {homeRoute, loginRoute, getOTP, registerData, completeProfile, authToken, getReadyOrders, getPickedUpOrders, getNewOrders, acceptOrder, readyOrder, almostReadyOrder, newOrder} = require('../controllers/hotel');
const wrapAsync = require('../utils/wrapAsync');
const authMiddleware = require('../utils/jwtAuth');


router.get('/home', wrapAsync(homeRoute));
router.post('/login', wrapAsync(loginRoute));
router.post("/getotp", wrapAsync(getOTP));
router.post("/register", wrapAsync(registerData));
router.post("/complete-profile", authMiddleware,wrapAsync(completeProfile));
router.get('/verify-token',authMiddleware, wrapAsync(authToken));
router.get('/:user_id/get-new-orders',authMiddleware, wrapAsync(getNewOrders));
router.get('/:user_id/get-ready-orders',authMiddleware, wrapAsync(getReadyOrders));
router.get('/:user_id/get-pickedup-orders',authMiddleware, wrapAsync(getPickedUpOrders));
router.post('/new-order',authMiddleware, wrapAsync(newOrder));
router.post('/accept-order',authMiddleware, wrapAsync(acceptOrder));
router.post('/ready-order',authMiddleware, wrapAsync(readyOrder));
router.post('/almost-ready-order',authMiddleware, wrapAsync(almostReadyOrder));

module.exports = router;