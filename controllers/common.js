const Category = require("../models/category");

module.exports.category = async (req, res) => {
  let category = await Category.find();
  res.send(category);
};
