// =====================================
// ALPHA LAN — Admin Routes
// =====================================

import express from "express";
import {
  getAllUsers,
  getSystemStats,
  banUser,
  unbanUser,
  broadcastMessage,
  getLogs,
} from "../controllers/adminController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all registered users
// @access  Admin only
router.get("/users", authMiddleware, roleCheck(["admin"]), getAllUsers);

// @route   GET /api/admin/stats
// @desc    Get system-wide analytics
// @access  Admin only
router.get("/stats", authMiddleware, roleCheck(["admin"]), getSystemStats);

// @route   POST /api/admin/ban/:id
// @desc    Ban a user by ID
// @access  Admin only
router.post("/ban/:id", authMiddleware, roleCheck(["admin"]), banUser);

// @route   POST /api/admin/unban/:id
// @desc    Unban a user by ID
// @access  Admin only
router.post("/unban/:id", authMiddleware, roleCheck(["admin"]), unbanUser);

// @route   POST /api/admin/broadcast
// @desc    Send a LAN-wide broadcast message
// @access  Admin only
router.post("/broadcast", authMiddleware, roleCheck(["admin"]), broadcastMessage);

// @route   GET /api/admin/logs
// @desc    View system or moderation logs
// @access  Admin only
router.get("/logs", authMiddleware, roleCheck(["admin"]), getLogs);

export default router;
