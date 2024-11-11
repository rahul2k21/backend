const bcrypt = require('bcryptjs')

const { generateToken } = require("../utils/jwtUtils.js");
const User = require("../models/User.js");

// Password validation function
const validatePassword = (password) => {
  const errors = [];
  const minLengthPattern = /^.{8,}$/; // At least 8 characters
  const uppercasePattern = /[A-Z]/;
  const lowercasePattern = /[a-z]/;
  const digitPattern = /\d/;
  const specialCharPattern = /[@$!%*?&#]/;

  if (!minLengthPattern.test(password)) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!uppercasePattern.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!lowercasePattern.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!digitPattern.test(password)) {
    errors.push("Password must contain at least one digit.");
  }
  if (!specialCharPattern.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  return errors;
};

const register = async (req, res) => {

  console.log('Received data:', req.body);

  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: "FirstName, LastName, Email, and Password are required",
      });
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ errors: passwordErrors });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: "Email already used",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "customer",
    });
    const savedUser = await user.save();
    const token = generateToken(savedUser);
    return res.status(201).json({ token: token, user: savedUser });
  } catch (error) {
    return res
      .status(error?.statusCode || 500)
      .json({ message: error?.message || "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        error: "Email and Password are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }
    const token = generateToken(user);
    res.status(200).json({ token: token, user: user });
  } catch (error) {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

module.exports = { login, register };
