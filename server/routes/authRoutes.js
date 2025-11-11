// =====================================
// ALPHA LAN — Authentication Routes
// =====================================

import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Log in an existing user
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/auth/profile
// @desc    Get current logged-in user info
// @access  Private
router.get("/profile", authMiddleware, getProfile);

export default router;
