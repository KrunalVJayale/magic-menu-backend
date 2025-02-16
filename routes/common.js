const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { category } = require("../controllers/common");


router.get("/category", wrapAsync(category));

module.exports = router;