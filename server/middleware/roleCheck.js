
// =====================================
// ALPHA LAN — Role-Based Access Control
// =====================================

import { logError } from "../utils/logger.js";

/**
 * Restrict route access by user role(s)
 * Example: router.get("/admin", roleCheck(["admin"]), adminDashboard)
 */
export function roleCheck(allowedRoles = []) {
  return (req, res, next) => {
    try {
      // If authMiddleware hasn’t attached user, deny
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      // If no roles are enforced, allow all logged-in users
      if (allowedRoles.length === 0) return next();

      const { role } = req.user;

      if (!role || !allowedRoles.includes(role)) {
        return res.status(403).json({ success: false, error: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (err) {
      logError("Role check failed:", err);
      res.status(500).json({ success: false, error: "Role validation error" });
    }
  };
}
