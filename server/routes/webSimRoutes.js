// =====================================
// ALPHA LAN — Web Simulator Routes
// =====================================

import express from "express";
import {
  getAllWebProjects,
  getWebProjectById,
  createWebProject,
  updateWebProject,
  deleteWebProject,
  runWebPreview,
} from "../controllers/webSimController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/websim
// @desc    Get all web simulation projects
// @access  Public
router.get("/", getAllWebProjects);

// @route   GET /api/websim/:id
// @desc    Get a specific web simulation project by ID
// @access  Public
router.get("/:id", getWebProjectById);

// @route   POST /api/websim
// @desc    Create a new web simulation project
// @access  Private
router.post("/", authMiddleware, createWebProject);

// @route   PUT /api/websim/:id
// @desc    Update an existing web project (HTML/CSS/JS edits)
// @access  Private
router.put("/:id", authMiddleware, updateWebProject);

// @route   DELETE /api/websim/:id
// @desc    Delete a web simulation project
// @access  Private
router.delete("/:id", authMiddleware, deleteWebProject);

// @route   POST /api/websim/preview
// @desc    Run and generate a live preview of HTML/CSS/JS
// @access  Private
router.post("/preview", authMiddleware, runWebPreview);

export default router;
