const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const authMiddleware = require("../utils/jwtAuth");
const { getOTP, registerData, login, toggleDuty, auth, newOrder} = require("../controllers/rider");




router.post("/getotp", wrapAsync(getOTP));
router.post("/register", wrapAsync(registerData));
router.post("/login", wrapAsync(login));

router.get('/:id/auth',authMiddleware,wrapAsync(auth));
router.get('/:id/toggleDuty',authMiddleware,wrapAsync(toggleDuty));
router.post('/newOrder',authMiddleware,wrapAsync(newOrder));



module.exports = router;