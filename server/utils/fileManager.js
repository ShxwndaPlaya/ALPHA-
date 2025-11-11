// =====================================
// ALPHA LAN — File Manager Utility
// =====================================
//
// Handles safe file operations for IDE, Shop, and WebSim
// within local LAN storage. Prevents directory traversal
// and ensures sandboxed access.
//
// =====================================

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const BASE_DIR = path.resolve("storage/projects");

// Ensure base directory exists
if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, { recursive: true });
}

// -------------------------------------
// Utility: safely resolve paths inside BASE_DIR
// Prevents directory traversal attacks
// -------------------------------------
const safePath = (subpath = "") => {
  const resolved = path.resolve(BASE_DIR, subpath);
  if (!resolved.startsWith(BASE_DIR)) {
    throw new Error("Access outside of project directory is not allowed");
  }
  return resolved;
};

// -------------------------------------
// @desc    Create new project folder
// @param   {string} ownerId
// -------------------------------------
export const createProjectFolder = (ownerId) => {
  const projectId = uuidv4();
  const dir = safePath(`${ownerId}/${projectId}`);

  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

// -------------------------------------
// @desc    Save file to project directory
// @param   {string} ownerId
// @param   {string} projectId
// @param   {string} filename
// @param   {string} content
// -------------------------------------
export const saveFile = (ownerId, projectId, filename, content) => {
  try {
    const projectDir = safePath(`${ownerId}/${projectId}`);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    const filePath = path.join(projectDir, filename);
    fs.writeFileSync(filePath, content, "utf-8");
    return filePath;
  } catch (error) {
    console.error("saveFile Error:", error);
    throw new Error("Failed to save file");
  }
};

// -------------------------------------
// @desc    Read a file’s content
// -------------------------------------
export const readFile = (ownerId, projectId, filename) => {
  try {
    const filePath = safePath(`${ownerId}/${projectId}/${filename}`);
    if (!fs.existsSync(filePath)) throw new Error("File not found");

    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error("readFile Error:", error);
    throw new Error("Failed to read file");
  }
};

// -------------------------------------
// @desc    List all files in a project folder
// -------------------------------------
export const listProjectFiles = (ownerId, projectId) => {
  try {
    const projectDir = safePath(`${ownerId}/${projectId}`);
    if (!fs.existsSync(projectDir)) return [];

    return fs.readdirSync(projectDir);
  } catch (error) {
    console.error("listProjectFiles Error:", error);
    throw new Error("Failed to list project files");
  }
};

// -------------------------------------
// @desc    Delete file or project directory
// -------------------------------------
export const deleteFileOrFolder = (ownerId, projectId, filename = null) => {
  try {
    const targetPath = filename
      ? safePath(`${ownerId}/${projectId}/${filename}`)
      : safePath(`${ownerId}/${projectId}`);

    if (!fs.existsSync(targetPath)) throw new Error("Target not found");

    const stats = fs.lstatSync(targetPath);
    if (stats.isDirectory()) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(targetPath);
    }

    return true;
  } catch (error) {
    console.error("deleteFileOrFolder Error:", error);
    throw new Error("Failed to delete file or folder");
  }
};

// -------------------------------------
// @desc    Export project as .zip
// -------------------------------------
export const exportProjectZip = async (ownerId, projectId) => {
  const archiver = await import("archiver");
  const projectDir = safePath(`${ownerId}/${projectId}`);

  if (!fs.existsSync(projectDir)) throw new Error("Project not found");

  const outputZip = safePath(`${ownerId}/${projectId}.zip`);
  const output = fs.createWriteStream(outputZip);
  const archive = archiver.default("zip", { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on("close", () => resolve(outputZip));
    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.directory(projectDir, false);
    archive.finalize();
  });
};

// -------------------------------------
// @desc    Check project size (for limits)
// -------------------------------------
export const getProjectSize = (ownerId, projectId) => {
  const projectDir = safePath(`${ownerId}/${projectId}`);
  if (!fs.existsSync(projectDir)) return 0;

  const getDirSize = (dir) => {
    const files = fs.readdirSync(dir);
    return files.reduce((total, file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      return total + (stats.isDirectory() ? getDirSize(filePath) : stats.size);
    }, 0);
  };

  return getDirSize(projectDir);
};
