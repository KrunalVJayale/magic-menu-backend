const express = require('express');
const router = express.Router();
const {homeRoute, loginRoute, getOTP, registerData, completeProfile, authToken, getReadyOrders, getPickedUpOrders} = require('../controllers/hotel');
const wrapAsync = require('../utils/wrapAsync');
const authMiddleware = require('../utils/jwtAuth');


router.get('/home', wrapAsync(homeRoute));
router.post('/login', wrapAsync(loginRoute));
router.post("/getotp", wrapAsync(getOTP));
router.post("/register", wrapAsync(registerData));
router.post("/complete-profile", authMiddleware,wrapAsync(completeProfile));
router.get('/verify-token',authMiddleware, wrapAsync(authToken));
router.get('/:user_id/get-ready-orders',authMiddleware, wrapAsync(getReadyOrders));
router.get('/:user_id/get-pickedup-orders',authMiddleware, wrapAsync(getPickedUpOrders));


module.exports = router;