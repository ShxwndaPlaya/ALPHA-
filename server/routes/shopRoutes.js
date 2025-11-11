// =====================================
// ALPHA LAN — Shop Routes
// =====================================

import express from "express";
import {
  getAllProjects,
  getProjectById,
  uploadProject,
  updateProject,
  deleteProject,
  rateProject,
  commentOnProject,
  getTopRatedProjects,
} from "../controllers/shopController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/shop
// @desc    Get all projects from the marketplace
// @access  Public (or Private if you prefer)
router.get("/", getAllProjects);

// @route   GET /api/shop/top
// @desc    Get top-rated or trending projects
// @access  Public
router.get("/top", getTopRatedProjects);

// @route   GET /api/shop/:id
// @desc    Get a single project by ID
// @access  Public
router.get("/:id", getProjectById);

// @route   POST /api/shop
// @desc    Upload a new code project
// @access  Private
router.post("/", authMiddleware, uploadProject);

// @route   PUT /api/shop/:id
// @desc    Update project details (title, desc, etc.)
// @access  Private (owner only)
router.put("/:id", authMiddleware, updateProject);

// @route   DELETE /api/shop/:id
// @desc    Delete a project (only owner or admin)
// @access  Private
router.delete("/:id", authMiddleware, deleteProject);

// @route   POST /api/shop/:id/rate
// @desc    Rate a project (1–5 stars)
// @access  Private
router.post("/:id/rate", authMiddleware, rateProject);

// @route   POST /api/shop/:id/comment
// @desc    Leave a comment on a project
// @access  Private
router.post("/:id/comment", authMiddleware, commentOnProject);

export default router;
