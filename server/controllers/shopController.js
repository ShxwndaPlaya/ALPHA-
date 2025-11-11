// =====================================
// ALPHA LAN — Shop Controller
// =====================================

import CodeProject from "../models/CodeProject.js";
import User from "../models/User.js";

// -------------------------------------
// @desc    Get all projects
// @route   GET /api/shop
// @access  Public
// -------------------------------------
export const getAllProjects = async (req, res) => {
  try {
    const projects = await CodeProject.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("GetAllProjects Error:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// -------------------------------------
// @desc    Get top-rated projects
// @route   GET /api/shop/top
// @access  Public
// -------------------------------------
export const getTopRatedProjects = async (req, res) => {
  try {
    const projects = await CodeProject.find()
      .sort({ averageRating: -1 })
      .limit(10)
      .populate("author", "username");

    res.status(200).json(projects);
  } catch (error) {
    console.error("GetTopRatedProjects Error:", error);
    res.status(500).json({ message: "Error fetching top projects" });
  }
};

// -------------------------------------
// @desc    Get single project
// @route   GET /api/shop/:id
// @access  Public
// -------------------------------------
export const getProjectById = async (req, res) => {
  try {
    const project = await CodeProject.findById(req.params.id).populate(
      "author",
      "username email"
    );
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    console.error("GetProjectById Error:", error);
    res.status(500).json({ message: "Error fetching project" });
  }
};

// -------------------------------------
// @desc    Upload new project
// @route   POST /api/shop
// @access  Private
// -------------------------------------
export const uploadProject = async (req, res) => {
  try {
    const { title, description, language, tags, files } = req.body;

    if (!title || !language || !files?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const project = new CodeProject({
      title,
      description,
      language,
      tags,
      files,
      author: req.user.id,
    });

    await project.save();

    res.status(201).json({ message: "Project uploaded", project });
  } catch (error) {
    console.error("UploadProject Error:", error);
    res.status(500).json({ message: "Error uploading project" });
  }
};

// -------------------------------------
// @desc    Update project
// @route   PUT /api/shop/:id
// @access  Private
// -------------------------------------
export const updateProject = async (req, res) => {
  try {
    const project = await CodeProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    if (project.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, description, tags } = req.body;
    if (title) project.title = title;
    if (description) project.description = description;
    if (tags) project.tags = tags;

    await project.save();
    res.status(200).json({ message: "Project updated", project });
  } catch (error) {
    console.error("UpdateProject Error:", error);
    res.status(500).json({ message: "Error updating project" });
  }
};

// -------------------------------------
// @desc    Delete project
// @route   DELETE /api/shop/:id
// @access  Private
// -------------------------------------
export const deleteProject = async (req, res) => {
  try {
    const project = await CodeProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    if (project.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await project.deleteOne();

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    console.error("DeleteProject Error:", error);
    res.status(500).json({ message: "Error deleting project" });
  }
};

// -------------------------------------
// @desc    Rate a project
// @route   POST /api/shop/:id/rate
// @access  Private
// -------------------------------------
export const rateProject = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating" });
    }

    const project = await CodeProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const existing = project.ratings.find(
      (r) => r.user.toString() === req.user.id
    );

    if (existing) existing.value = rating;
    else project.ratings.push({ user: req.user.id, value: rating });

    project.averageRating =
      project.ratings.reduce((acc, r) => acc + r.value, 0) /
      project.ratings.length;

    await project.save();
    res.status(200).json({ message: "Rating updated", project });
  } catch (error) {
    console.error("RateProject Error:", error);
    res.status(500).json({ message: "Error rating project" });
  }
};

// -------------------------------------
// @desc    Comment on a project
// @route   POST /api/shop/:id/comment
// @access  Private
// -------------------------------------
export const commentOnProject = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment)
      return res.status(400).json({ message: "Comment cannot be empty" });

    const project = await CodeProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const newComment = {
      user: req.user.id,
      username: req.user.username,
      text: comment,
      createdAt: new Date(),
    };

    project.comments.push(newComment);
    await project.save();

    res.status(201).json({ message: "Comment added", project });
  } catch (error) {
    console.error("CommentOnProject Error:", error);
    res.status(500).json({ message: "Error commenting on project" });
  }
};
