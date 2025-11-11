// =====================================
// ALPHA LAN — WebSim Controller
// =====================================

import WebSimProject from "../models/WebSimProject.js";
import fs from "fs";
import path from "path";

// Directory where local project files will be stored
const webSimDir = path.resolve("storage/websim");

// Ensure directory exists
if (!fs.existsSync(webSimDir)) {
  fs.mkdirSync(webSimDir, { recursive: true });
}

// -------------------------------------
// @desc    Get all WebSim projects
// @route   GET /api/websim
// @access  Public
// -------------------------------------
export const getAllWebSims = async (req, res) => {
  try {
    const projects = await WebSimProject.find()
      .populate("author", "username email")
      .sort({ updatedAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("GetAllWebSims Error:", error);
    res.status(500).json({ message: "Error fetching WebSim projects" });
  }
};

// -------------------------------------
// @desc    Get a single WebSim project by ID
// @route   GET /api/websim/:id
// @access  Public
// -------------------------------------
export const getWebSimById = async (req, res) => {
  try {
    const project = await WebSimProject.findById(req.params.id).populate(
      "author",
      "username"
    );

    if (!project) return res.status(404).json({ message: "WebSim not found" });

    res.status(200).json(project);
  } catch (error) {
    console.error("GetWebSimById Error:", error);
    res.status(500).json({ message: "Error fetching WebSim project" });
  }
};

// -------------------------------------
// @desc    Create a new WebSim project
// @route   POST /api/websim
// @access  Private
// -------------------------------------
export const createWebSim = async (req, res) => {
  try {
    const { title, html, css, js } = req.body;
    if (!title || !html)
      return res.status(400).json({ message: "Title and HTML required" });

    // Save project to DB
    const newProject = new WebSimProject({
      title,
      html,
      css,
      js,
      author: req.user.id,
    });

    await newProject.save();

    // Save local copy (for offline viewing)
    const filePath = path.join(webSimDir, `${newProject._id}.html`);
    const combinedContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>${css || ""}</style>
</head>
<body>
${html}
<script>${js || ""}</script>
</body>
</html>`;

    fs.writeFileSync(filePath, combinedContent, "utf-8");

    res.status(201).json({
      message: "WebSim project created",
      project: newProject,
      filePath,
    });
  } catch (error) {
    console.error("CreateWebSim Error:", error);
    res.status(500).json({ message: "Error creating WebSim project" });
  }
};

// -------------------------------------
// @desc    Update an existing WebSim project
// @route   PUT /api/websim/:id
// @access  Private
// -------------------------------------
export const updateWebSim = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, html, css, js } = req.body;

    const project = await WebSimProject.findById(id);
    if (!project) return res.status(404).json({ message: "Not found" });

    if (project.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    if (title) project.title = title;
    if (html !== undefined) project.html = html;
    if (css !== undefined) project.css = css;
    if (js !== undefined) project.js = js;
    project.updatedAt = new Date();

    await project.save();

    // Update local file
    const filePath = path.join(webSimDir, `${id}.html`);
    const updatedContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${project.title}</title>
<style>${project.css || ""}</style>
</head>
<body>
${project.html}
<script>${project.js || ""}</script>
</body>
</html>`;

    fs.writeFileSync(filePath, updatedContent, "utf-8");

    res.status(200).json({ message: "WebSim updated", project });
  } catch (error) {
    console.error("UpdateWebSim Error:", error);
    res.status(500).json({ message: "Error updating WebSim project" });
  }
};

// -------------------------------------
// @desc    Delete a WebSim project
// @route   DELETE /api/websim/:id
// @access  Private
// -------------------------------------
export const deleteWebSim = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await WebSimProject.findById(id);
    if (!project) return res.status(404).json({ message: "Not found" });

    if (project.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await project.deleteOne();

    // Delete local file
    const filePath = path.join(webSimDir, `${id}.html`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(200).json({ message: "WebSim project deleted" });
  } catch (error) {
    console.error("DeleteWebSim Error:", error);
    res.status(500).json({ message: "Error deleting WebSim project" });
  }
};

// -------------------------------------
// @desc    Preview a WebSim project (serve HTML)
// @route   GET /api/websim/:id/preview
// @access  Public
// -------------------------------------
export const previewWebSim = async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(webSimDir, `${id}.html`);

    if (!fs.existsSync(filePath))
      return res.status(404).send("WebSim file not found.");

    res.setHeader("Content-Type", "text/html");
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("PreviewWebSim Error:", error);
    res.status(500).send("Error loading WebSim preview");
  }
};
