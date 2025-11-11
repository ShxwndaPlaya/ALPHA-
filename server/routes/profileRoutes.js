// =====================================
// ALPHA LAN — Profile Routes
// =====================================

import express from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  getUserBadges,
  getUserProjects,
} from "../controllers/profileController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/profile/me
// @desc    Get current logged-in user's profile
// @access  Private
router.get("/me", authMiddleware, getProfile);

// @route   PUT /api/profile/me
// @desc    Update user profile info (bio, name, theme, etc.)
// @access  Private
router.put("/me", authMiddleware, updateProfile);

// @route   POST /api/profile/avatar
// @desc    Upload or update user avatar
// @access  Private
router.post("/avatar", authMiddleware, uploadAvatar);

// @route   GET /api/profile/badges
// @desc    Get all badges earned by the user
// @access  Private
router.get("/badges", authMiddleware, getUserBadges);

// @route   GET /api/profile/projects
// @desc    Get all code projects shared by the user
// @access  Private
router.get("/projects", authMiddleware, getUserProjects);

export default router;
