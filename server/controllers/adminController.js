// =====================================
// ALPHA LAN — Admin Controller
// =====================================

import User from "../models/User.js";
import Message from "../models/Message.js";
import CodeProject from "../models/CodeProject.js";
import Challenge from "../models/Challenge.js";
import { io } from "../config/socket.js";

// -------------------------------------
// @desc    Get system-wide statistics for dashboard
// @route   GET /api/admin/stats
// @access  Admin
// -------------------------------------
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalProjects = await CodeProject.countDocuments();
    const totalChallenges = await Challenge.countDocuments();

    const topUsers = await User.find()
      .sort({ xp: -1 })
      .limit(5)
      .select("username xp level");

    res.status(200).json({
      users: totalUsers,
      messages: totalMessages,
      projects: totalProjects,
      challenges: totalChallenges,
      topUsers,
    });
  } catch (error) {
    console.error("GetDashboardStats Error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};

// -------------------------------------
// @desc    Get all users for admin view
// @route   GET /api/admin/users
// @access  Admin
// -------------------------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("username email role xp level status createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("GetAllUsers Error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// -------------------------------------
// @desc    Change user role (student <-> admin)
// @route   PUT /api/admin/user/:id/role
// @access  Admin
// -------------------------------------
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["student", "teacher", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("username email role");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User role updated", user });
  } catch (error) {
    console.error("ChangeUserRole Error:", error);
    res.status(500).json({ message: "Error updating user role" });
  }
};

// -------------------------------------
// @desc    Suspend or activate user
// @route   PUT /api/admin/user/:id/status
// @access  Admin
// -------------------------------------
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' or 'suspended'

    if (!["active", "suspended"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("username status");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User status updated", user });
  } catch (error) {
    console.error("ToggleUserStatus Error:", error);
    res.status(500).json({ message: "Error updating user status" });
  }
};

// -------------------------------------
// @desc    Broadcast LAN announcement
// @route   POST /api/admin/announcement
// @access  Admin
// -------------------------------------
export const sendAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message)
      return res.status(400).json({ message: "Title and message required" });

    // Broadcast to all connected LAN users via Socket.IO
    io.emit("announcement", {
      title,
      message,
      timestamp: new Date(),
      from: req.user.username,
    });

    res.status(200).json({ message: "Announcement broadcasted" });
  } catch (error) {
    console.error("SendAnnouncement Error:", error);
    res.status(500).json({ message: "Error sending announcement" });
  }
};

// -------------------------------------
// @desc    System activity overview (optional analytics)
// @route   GET /api/admin/analytics
// @access  Admin
// -------------------------------------
export const getAnalytics = async (req, res) => {
  try {
    // Aggregate lightweight metrics
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $substr: ["$createdAt", 0, 10] },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const projectTrends = await CodeProject.aggregate([
      {
        $group: {
          _id: "$language",
          total: { $sum: 1 },
        },
      },
    ]);

    const activeUsers = await User.countDocuments({ status: "active" });

    res.status(200).json({
      userGrowth,
      projectTrends,
      activeUsers,
    });
  } catch (error) {
    console.error("GetAnalytics Error:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
