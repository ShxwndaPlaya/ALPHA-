/**
 * Global constants used across ALPHA LAN.
 * Centralized configuration for roles, XP levels, events, etc.
 */

// 🌍 User Roles
export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
};

// 🧠 XP / Level System
export const XP_LEVELS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 250 },
  { level: 4, xp: 500 },
  { level: 5, xp: 1000 },
  { level: 6, xp: 2000 },
  { level: 7, xp: 4000 },
  { level: 8, xp: 7000 },
  { level: 9, xp: 10000 },
  { level: 10, xp: 15000 },
];

// 🏅 Badge Types
export const BADGE_TYPES = {
  NIGHT_CODER: "Night Coder",
  BUG_SLAYER: "Bug Slayer",
  COLLAB_MASTER: "Collaboration Master",
  PROJECT_GURU: "Project Guru",
  LAN_LEGEND: "LAN Legend",
};

// 💬 Socket Events
export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  NEW_MESSAGE: "message",
  USER_JOINED: "userJoined",
  USER_LEFT: "userLeft",
  CODE_UPDATE: "codeUpdate",
  SHOP_UPLOAD: "newProject",
  WEB_SIM_UPDATE: "webSimUpdate",
};

// ⚙️ Misc Settings
export const APP_NAME = "ALPHA LAN";
export const APP_VERSION = "1.0.0";
export const DEFAULT_AVATAR = "/assets/images/default-avatar.png";
export const LAN_API_URL = "http://localhost:5000/api";
export const SOCKET_BASE_URL = "http://localhost:5000";
