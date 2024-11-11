const User = require("../models/User.js");

async function getUsers(req, res) {
    try {
        const user = await User.find({ role: "customer" });
        return res.status(200).json(user);
    } catch (error) {
        return res
            .status(500)
            .json({ message: error?.message || "Something went wrong" });
    }
}

module.exports = getUsers; 
