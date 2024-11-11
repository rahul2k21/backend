const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
});

const User = mongoose.model("emp", userSchema);

module.exports = User;