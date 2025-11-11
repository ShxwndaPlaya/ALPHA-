// =====================================
// ALPHA LAN — Logger Utility
// =====================================
//
// Provides color-coded, timestamped logs for
// server and socket activity. Optional file logging.
//
// =====================================

import fs from "fs";
import path from "path";
import chalk from "chalk";

// Directory for logs
const logDir = path.resolve("./server/logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, "server.log");

// -------------------------------------
// Helper: get current timestamp
// -------------------------------------
const getTime = () => {
  const now = new Date();
  return now.toLocaleString("en-GB", { hour12: false });
};

// -------------------------------------
// Base log function (to console + file)
// -------------------------------------
const logToFile = (level, message) => {
  const entry = `[${getTime()}] [${level.toUpperCase()}] ${message}\n`;
  fs.appendFileSync(logFile, entry, { encoding: "utf8" });
};

// -------------------------------------
// Exported logger object
// -------------------------------------
export const logger = {
  info: (message) => {
    console.log(chalk.blueBright(`[INFO] ${getTime()}:`), message);
    logToFile("info", message);
  },

  warn: (message) => {
    console.warn(chalk.yellow(`[WARN] ${getTime()}:`), message);
    logToFile("warn", message);
  },

  error: (message) => {
    console.error(chalk.red(`[ERROR] ${getTime()}:`), message);
    logToFile("error", message);
  },

  success: (message) => {
    console.log(chalk.greenBright(`[SUCCESS] ${getTime()}:`), message);
    logToFile("success", message);
  },
};

// -------------------------------------
// Optional: startup banner
// -------------------------------------
export const printStartupBanner = () => {
  console.log(chalk.cyanBright(`
  ======================================
         🚀 ALPHA LAN SERVER STARTED
         Environment: ${process.env.NODE_ENV || "development"}
         Timestamp: ${getTime()}
  ======================================
  `));
};
