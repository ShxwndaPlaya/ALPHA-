// =====================================
// ALPHA LAN — Local Database Connection
// =====================================

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";
import { logInfo, logError } from "../utils/logger.js";

// Get absolute directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const DB_PATH = path.join(__dirname, "../../database/devconnect.db");

let db;

// =====================================
// Initialize SQLite Connection
// =====================================
export default async function connectDB() {
  try {
    if (!db) {
      db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database,
      });

      await db.exec("PRAGMA foreign_keys = ON;");

      logInfo("📦 SQLite database initialized");
    }

    // Example bootstrapping tables if not exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        avatar TEXT,
        xp INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        senderId INTEGER,
        receiverId INTEGER,
        groupId INTEGER,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS code_projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ownerId INTEGER,
        title TEXT,
        language TEXT,
        code TEXT,
        description TEXT,
        stars INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ownerId) REFERENCES users(id)
      );
    `);

    return db;
  } catch (err) {
    logError("Database connection error:", err);
    throw err;
  }
}

// =====================================
// Helper to get active DB instance
// =====================================
export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
}
