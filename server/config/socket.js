// =====================================
// ALPHA LAN — Socket.IO Configuration
// =====================================

import { logInfo, logError } from "../utils/logger.js";
import { getDB } from "./db.js";

// Active users map
const onlineUsers = new Map();

/**
 * Registers all socket.io event handlers.
 * @param {Server} io - socket.io server instance
 */
export default function registerSocketEvents(io) {
  io.on("connection", async (socket) => {
    logInfo(`🔌 New connection: ${socket.id}`);

    // User joins after login
    socket.on("user:join", async (userData) => {
      const { userId, username } = userData;
      onlineUsers.set(socket.id, { userId, username });
      logInfo(`👤 ${username} joined (Socket: ${socket.id})`);

      io.emit("user:onlineList", Array.from(onlineUsers.values()));
    });

    // =========================
    // 💬 Chat System Events
    // =========================
    socket.on("chat:send", async (msg) => {
      try {
        const db = getDB();
        const { senderId, receiverId, groupId, content } = msg;

        // Save message locally
        await db.run(
          `INSERT INTO messages (senderId, receiverId, groupId, content) VALUES (?, ?, ?, ?)`,
          [senderId, receiverId || null, groupId || null, content]
        );

        // Broadcast message
        io.emit("chat:receive", {
          ...msg,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        logError("Error saving chat message:", err);
      }
    });

    // =========================
    // 💻 IDE Collaboration
    // =========================
    socket.on("code:edit", (payload) => {
      // Broadcast changes to all users in the same project room
      const { projectId, delta, user } = payload;
      socket.to(`project-${projectId}`).emit("code:update", { delta, user });
    });

    socket.on("code:joinRoom", (projectId) => {
      socket.join(`project-${projectId}`);
      logInfo(`👥 Socket ${socket.id} joined project room ${projectId}`);
    });

    socket.on("code:leaveRoom", (projectId) => {
      socket.leave(`project-${projectId}`);
      logInfo(`👋 Socket ${socket.id} left project room ${projectId}`);
    });

    // =========================
    // 🌐 Web Simulator Broadcast
    // =========================
    socket.on("websim:update", (data) => {
      const { roomId, html, css, js } = data;
      socket.to(roomId).emit("websim:refresh", { html, css, js });
    });

    // =========================
    // 🧠 Quiz & Challenge Events
    // =========================
    socket.on("challenge:start", (challengeId) => {
      io.emit("challenge:active", { challengeId, startTime: Date.now() });
    });

    // =========================
    // 🔌 Disconnect
    // =========================
    socket.on("disconnect", () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        logInfo(`❌ ${user.username} disconnected`);
        onlineUsers.delete(socket.id);
        io.emit("user:onlineList", Array.from(onlineUsers.values()));
      }
    });
  });
}
