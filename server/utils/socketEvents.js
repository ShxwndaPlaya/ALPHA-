// =====================================
// ALPHA LAN — Socket Event Handlers
// =====================================
//
// Centralizes all WebSocket (Socket.IO) events
// used for: Chat 💬, IDE 💻, WebSim 🌐, and Admin tools 🧰
//
// Works over LAN — no internet dependency.
//
// =====================================

import { saveMessage } from "../controllers/chatController.js";
import { logger } from "./logger.js";

const connectedUsers = new Map(); // userId -> socketId

// -------------------------------------
// @desc   Initialize socket.io events
// -------------------------------------
export const registerSocketEvents = (io) => {
  io.on("connection", (socket) => {
    logger.info(`🟢 Socket connected: ${socket.id}`);

    // ------------------------------
    // AUTH / USER PRESENCE
    // ------------------------------
    socket.on("registerUser", (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      io.emit("userOnline", { userId });
      logger.info(`✅ User registered on socket: ${userId}`);
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        io.emit("userOffline", { userId: socket.userId });
        logger.info(`🔴 User disconnected: ${socket.userId}`);
      } else {
        logger.info(`Socket disconnected: ${socket.id}`);
      }
    });

    // ------------------------------
    // CHAT EVENTS
    // ------------------------------
    socket.on("sendMessage", async (data) => {
      try {
        const { senderId, receiverId, content, groupId } = data;
        const saved = await saveMessage(senderId, receiverId, content, groupId);

        if (groupId) {
          io.to(groupId).emit("newGroupMessage", saved);
        } else if (receiverId && connectedUsers.has(receiverId)) {
          io.to(connectedUsers.get(receiverId)).emit("newPrivateMessage", saved);
        }

        // Emit back to sender for confirmation
        socket.emit("messageDelivered", saved);
      } catch (err) {
        logger.error("sendMessage error:", err.message);
        socket.emit("messageError", { error: "Message failed to send" });
      }
    });

    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
      logger.info(`👥 User ${socket.userId} joined group ${groupId}`);
    });

    socket.on("leaveGroup", (groupId) => {
      socket.leave(groupId);
      logger.info(`👋 User ${socket.userId} left group ${groupId}`);
    });

    // ------------------------------
    // IDE COLLABORATION
    // ------------------------------
    socket.on("joinIDE", ({ projectId, user }) => {
      socket.join(`ide:${projectId}`);
      io.to(`ide:${projectId}`).emit("userJoinedIDE", { user });
      logger.info(`💻 ${user.username} joined IDE: ${projectId}`);
    });

    socket.on("leaveIDE", ({ projectId, user }) => {
      socket.leave(`ide:${projectId}`);
      io.to(`ide:${projectId}`).emit("userLeftIDE", { user });
      logger.info(`🚪 ${user.username} left IDE: ${projectId}`);
    });

    socket.on("codeChange", ({ projectId, code, cursor, user }) => {
      socket.to(`ide:${projectId}`).emit("codeChange", { code, cursor, user });
    });

    socket.on("runCode", ({ projectId, output }) => {
      io.to(`ide:${projectId}`).emit("codeOutput", { projectId, output });
    });

    // ------------------------------
    // WEBSIM EVENTS
    // ------------------------------
    socket.on("webSimUpdate", ({ projectId, html, css, js }) => {
      socket.to(`websim:${projectId}`).emit("webSimPreview", { html, css, js });
    });

    socket.on("joinWebSim", (projectId) => {
      socket.join(`websim:${projectId}`);
      logger.info(`🌐 Joined WebSim session: ${projectId}`);
    });

    // ------------------------------
    // SHOP / MARKETPLACE EVENTS
    // ------------------------------
    socket.on("shopUpdate", (project) => {
      io.emit("newShopProject", project);
      logger.info(`🛍️ New project shared: ${project.title}`);
    });

    // ------------------------------
    // ADMIN / SYSTEM EVENTS
    // ------------------------------
    socket.on("broadcast", ({ message, from }) => {
      io.emit("adminBroadcast", { message, from });
      logger.info(`📢 Broadcast from ${from}: ${message}`);
    });

    socket.on("requestActiveUsers", () => {
      const onlineList = Array.from(connectedUsers.keys());
      socket.emit("activeUsers", onlineList);
    });
  });
};

// -------------------------------------
// @desc   Send message to user (server-side)
// -------------------------------------
export const emitToUser = (io, userId, event, payload) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, payload);
    logger.info(`📤 Emitted ${event} to ${userId}`);
  }
};

// -------------------------------------
// @desc   Get online users list
// -------------------------------------
export const getOnlineUsers = () => Array.from(connectedUsers.keys());
