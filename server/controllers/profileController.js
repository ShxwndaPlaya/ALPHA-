// =====================================
// ALPHA LAN — Profile Controller
// =====================================

import fs from "fs";
import path from "path";
import User from "../models/User.js";
import Badge from "../models/Badge.js";

// Directory for user avatars (stored locally)
const avatarDir = path.resolve("storage/avatars");
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

// -------------------------------------
// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
// -------------------------------------
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("GetMyProfile Error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// -------------------------------------
// @desc    Get another user's public profile
// @route   GET /api/profile/:id
// @access  Public
// -------------------------------------
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("username email xp level badges bio avatar")
      .populate("badges");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("GetUserProfile Error:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

// -------------------------------------
// @desc    Update user's profile info
// @route   PUT /api/profile
// @access  Private
// -------------------------------------
export const updateProfile = async (req, res) => {
  try {
    const { username, bio, theme } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (bio) updates.bio = bio;
    if (theme) updates.theme = theme;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("UpdateProfile Error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// -------------------------------------
// @desc    Upload/Change user avatar
// @route   POST /api/profile/avatar
// @access  Private
// -------------------------------------
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const avatarPath = path.join(avatarDir, `${req.user.id}.png`);
    fs.writeFileSync(avatarPath, req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: `/avatars/${req.user.id}.png` },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Avatar updated",
      avatarUrl: user.avatar,
    });
  } catch (error) {
    console.error("UploadAvatar Error:", error);
    res.status(500).json({ message: "Error uploading avatar" });
  }
};

// -------------------------------------
// @desc    Get user's badges and XP
// @route   GET /api/profile/me/badges
// @access  Private
// -------------------------------------
export const getUserBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("badges")
      .select("badges xp level");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      xp: user.xp,
      level: user.level,
      badges: user.badges,
    });
  } catch (error) {
    console.error("GetUserBadges Error:", error);
    res.status(500).json({ message: "Error fetching badges" });
  }
};

// -------------------------------------
// @desc    Grant a badge to a user (admin or automated system)
// @route   POST /api/profile/:id/badge
// @access  Admin
// -------------------------------------
export const grantBadge = async (req, res) => {
  try {
    const { badgeId } = req.body;
    const { id } = req.params;

    const badge = await Badge.findById(badgeId);
    if (!badge) return res.status(404).json({ message: "Badge not found" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
      user.xp += badge.xpValue || 10; // XP boost from badge
      await user.save();
    }

    res.status(200).json({ message: "Badge granted", user });
  } catch (error) {
    console.error("GrantBadge Error:", error);
    res.status(500).json({ message: "Error granting badge" });
  }
};

// -------------------------------------
// @desc    Local leaderboard (LAN XP ranking)
// @route   GET /api/profile/leaderboard
// @access  Public
// -------------------------------------
export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ xp: -1 })
      .limit(20)
      .select("username xp level avatar");

    res.status(200).json(users);
  } catch (error) {
    console.error("GetLeaderboard Error:", error);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};
