// =====================================
// ALPHA LAN — IDE Routes
// =====================================

import express from "express";
import { runCode, saveProject, getProjects } from "../controllers/ideController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Run code (requires login)
router.post("/run", authMiddleware, runCode);

// Save project (requires login)
router.post("/save", authMiddleware, saveProject);

// Get all projects (public for now)
router.get("/projects", getProjects);

export default router;
