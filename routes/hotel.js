const express = require('express');
const router = express.Router();
const {homeRoute, loginRoute} = require('../controllers/hotel');
const wrapAsync = require('../utils/wrapAsync');


router.get('/home', wrapAsync(homeRoute));
router.get('/login', wrapAsync(loginRoute));



module.exports = router;