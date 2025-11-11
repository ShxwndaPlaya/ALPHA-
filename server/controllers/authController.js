// =====================================
// ALPHA LAN — Auth Controller
// =====================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretlan";

// -------------------------------------
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// -------------------------------------
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Auth Register Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// -------------------------------------
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// -------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Auth Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// -------------------------------------
// @desc    Verify token & return user info
// @route   GET /api/auth/verify
// @access  Private
// -------------------------------------
export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ valid: true, user });
  } catch (error) {
    console.error("Auth Verify Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// -------------------------------------
// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
// -------------------------------------
export const logoutUser = async (req, res) => {
  try {
    // In a LAN/local setup, JWT invalidation is handled on the client side
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Error during logout" });
  }
};
