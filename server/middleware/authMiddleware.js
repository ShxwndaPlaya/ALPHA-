// =====================================
// ALPHA LAN — Authentication Middleware
// =====================================

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { logError } from "../utils/logger.js";

dotenv.config();

/**
 * Verifies JWT and attaches user to request
 */
export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");

    req.user = decoded;
    next();
  } catch (err) {
    logError("Auth error:", err);
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

/**
 * Optional middleware for routes that can have guests
 */
export function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
      req.user = decoded;
    }
  } catch (err) {
    logError("Optional auth parse failed:", err);
  }
  next();
}
