import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { logger } from "../server/utils/logger.js";

const dbPath = path.resolve("./database/devconnect.db");

const runSQL = async (filePath) => {
  const sql = fs.readFileSync(filePath, "utf8");
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  await db.exec(sql);
  await db.close();
  logger.success(`✅ Executed: ${path.basename(filePath)}`);
};

(async () => {
  try {
    const migrations = fs.readdirSync("./database/migrations");
    for (const file of migrations) {
      await runSQL(`./database/migrations/${file}`);
    }

    const seeders = fs.readdirSync("./database/seeders");
    for (const file of seeders) {
      await runSQL(`./database/seeders/${file}`);
    }

    logger.success("🎉 Database setup complete!");
  } catch (err) {
    logger.error("Database setup failed: " + err.message);
  }
})();
