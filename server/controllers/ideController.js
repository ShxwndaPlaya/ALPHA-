// =====================================
// ALPHA LAN — IDE Controller
// =====================================

import { compileAndRun } from "../config/compiler.js";
import { logInfo, logError } from "../utils/logger.js";

/**
 * @desc Run code snippet in the selected language
 * @route POST /api/ide/run
 * @access Private
 */
export async function runCode(req, res) {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: "Language and code are required." });
    }

    logInfo(`🧠 Running ${language} code snippet`);

    const result = await compileAndRun(language, code);

    return res.status(200).json({
      success: true,
      output: result.stdout || "",
      error: result.stderr || "",
    });
  } catch (err) {
    logError("❌ Code execution failed:", err);
    return res.status(500).json({
      success: false,
      error: "Server error while running code.",
    });
  }
}

/**
 * @desc Save a code project locally
 * @route POST /api/ide/save
 * @access Private
 */
export async function saveProject(req, res) {
  try {
    const db = req.db;
    const { ownerId, title, language, code, description } = req.body;

    if (!ownerId || !title || !language || !code) {
      return res.status(400).json({ error: "Missing required project fields." });
    }

    await db.run(
      `INSERT INTO code_projects (ownerId, title, language, code, description) VALUES (?, ?, ?, ?, ?)`,
      [ownerId, title, language, code, description || ""]
    );

    return res.status(201).json({ success: true, message: "Project saved successfully." });
  } catch (err) {
    logError("❌ Failed to save project:", err);
    return res.status(500).json({ success: false, error: "Could not save project." });
  }
}

/**
 * @desc Fetch all projects
 * @route GET /api/ide/projects
 * @access Public (or teacher-only later)
 */
export async function getProjects(req, res) {
  try {
    const db = req.db;
    const projects = await db.all(
      `SELECT p.*, u.username AS ownerName FROM code_projects p
       LEFT JOIN users u ON u.id = p.ownerId
       ORDER BY p.createdAt DESC`
    );

    return res.status(200).json({ success: true, projects });
  } catch (err) {
    logError("❌ Failed to fetch projects:", err);
    return res.status(500).json({ success: false, error: "Could not load projects." });
  }
}
