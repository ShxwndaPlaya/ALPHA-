// =====================================
// ALPHA LAN — Global Error Handler
// =====================================

import { logError } from "../utils/logger.js";

/**
 * Express global error-handling middleware
 * Catches thrown or next(err) errors across all routes
 */
export function errorHandler(err, req, res, next) {
  // Log detailed error for debugging (server-side only)
  logError("Server Error:", err);

  const statusCode = err.statusCode || 500;

  // Friendly LAN-safe error response
  res.status(statusCode).json({
    success: false,
    error: err.message || "Something went wrong on the LAN server.",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack, // include stack only in dev mode
    }),
  });
}

/**
 * Utility function to create standardized error objects
 */
export function createError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
