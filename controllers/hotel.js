const Owner = require('../models/owner');


module.exports.homeRoute = async (req, res) => {
    res.send('Welcome to magic menu')
};

module.exports.loginRoute = async (req, res) => {
    const data = await Owner.find();
    res.send(data)
};