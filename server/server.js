// =====================================
// ALPHA LAN — Server Entry Point
// =====================================

import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Internal modules
import connectDB from "./config/db.js";
import registerSocketEvents from "./config/socket.js";
import errorHandler from "./middleware/errorHandler.js";
import { logInfo, logError } from "./utils/logger.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import ideRoutes from "./routes/ideRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import webSimRoutes from "./routes/webSimRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// =====================================
// Setup & Config
// =====================================
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Global utilities
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================
// Middleware
// =====================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// =====================================
// Database Connection
// =====================================
connectDB()
  .then(() => logInfo("✅ Database connected successfully"))
  .catch((err) => logError("❌ Database connection failed", err));

// =====================================
// API Routes
// =====================================
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ide", ideRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/websim", webSimRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);

// =====================================
// Socket.IO Setup
// =====================================
registerSocketEvents(io);

// =====================================
// Static Frontend (for production)
// =====================================
const clientPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// =====================================
// Error Handling
// =====================================
app.use(errorHandler);

// =====================================
// Server Start
// =====================================
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // LAN support

server.listen(PORT, HOST, () => {
  logInfo(`🚀 ALPHA LAN Server running on http://${HOST}:${PORT}`);
});
