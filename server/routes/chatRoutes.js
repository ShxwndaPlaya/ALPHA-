// =====================================
// ALPHA LAN — Chat Routes
// =====================================

import express from "express";
import {
  getUserChats,
  getMessages,
  sendMessage,
  createGroupChat,
  addUserToGroup,
  removeUserFromGroup,
} from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/chat
// @desc    Get all chat rooms for the logged-in user
// @access  Private
router.get("/", authMiddleware, getUserChats);

// @route   GET /api/chat/:roomId
// @desc    Get all messages from a chat room
// @access  Private
router.get("/:roomId", authMiddleware, getMessages);

// @route   POST /api/chat/:roomId/message
// @desc    Send a message in a chat room
// @access  Private
router.post("/:roomId/message", authMiddleware, sendMessage);

// @route   POST /api/chat/group
// @desc    Create a new group chat
// @access  Private
router.post("/group", authMiddleware, createGroupChat);

// @route   POST /api/chat/group/:roomId/add
// @desc    Add user to a group chat
// @access  Private
router.post("/group/:roomId/add", authMiddleware, addUserToGroup);

// @route   POST /api/chat/group/:roomId/remove
// @desc    Remove user from a group chat
// @access  Private
router.post("/group/:roomId/remove", authMiddleware, removeUserFromGroup);

export default router;
