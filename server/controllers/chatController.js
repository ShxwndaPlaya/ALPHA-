// =====================================
// ALPHA LAN — Chat Controller
// =====================================

import Chat from "../models/Message.js";
import User from "../models/User.js";
import { io } from "../config/socket.js"; // socket.io instance

// -------------------------------------
// @desc    Get all chats for logged-in user
// @route   GET /api/chat
// @access  Private
// -------------------------------------
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "username email")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("GetUserChats Error:", error);
    res.status(500).json({ message: "Error fetching user chats" });
  }
};

// -------------------------------------
// @desc    Get messages from a specific chat room
// @route   GET /api/chat/:roomId
// @access  Private
// -------------------------------------
export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const chat = await Chat.findById(roomId)
      .populate("messages.sender", "username")
      .populate("participants", "username");

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat.messages);
  } catch (error) {
    console.error("GetMessages Error:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// -------------------------------------
// @desc    Send a message in a chat room
// @route   POST /api/chat/:roomId/message
// @access  Private
// -------------------------------------
export const sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, type } = req.body;

    const chat = await Chat.findById(roomId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const message = {
      sender: req.user.id,
      content,
      type: type || "text",
      timestamp: new Date(),
    };

    chat.messages.push(message);
    chat.updatedAt = new Date();
    await chat.save();

    // Emit via socket for real-time update
    io.to(roomId).emit("newMessage", {
      roomId,
      message: {
        ...message,
        sender: req.user.username,
      },
    });

    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    console.error("SendMessage Error:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};

// -------------------------------------
// @desc    Create a new group chat
// @route   POST /api/chat/group
// @access  Private
// -------------------------------------
export const createGroupChat = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !members?.length) {
      return res.status(400).json({ message: "Name and members required" });
    }

    const chat = new Chat({
      name,
      isGroup: true,
      participants: [...members, req.user.id],
      messages: [],
    });

    await chat.save();

    io.emit("groupCreated", { group: chat });

    res.status(201).json({ message: "Group created", chat });
  } catch (error) {
    console.error("CreateGroupChat Error:", error);
    res.status(500).json({ message: "Error creating group" });
  }
};

// -------------------------------------
// @desc    Add user to group chat
// @route   POST /api/chat/group/:roomId/add
// @access  Private
// -------------------------------------
export const addUserToGroup = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findById(roomId);
    if (!chat) return res.status(404).json({ message: "Group not found" });

    if (!chat.isGroup)
      return res.status(400).json({ message: "Not a group chat" });

    if (!chat.participants.includes(userId)) {
      chat.participants.push(userId);
      await chat.save();
      io.to(roomId).emit("userAdded", { userId, roomId });
    }

    res.status(200).json({ message: "User added to group", chat });
  } catch (error) {
    console.error("AddUserToGroup Error:", error);
    res.status(500).json({ message: "Error adding user to group" });
  }
};

// -------------------------------------
// @desc    Remove user from group chat
// @route   POST /api/chat/group/:roomId/remove
// @access  Private
// -------------------------------------
export const removeUserFromGroup = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findById(roomId);
    if (!chat) return res.status(404).json({ message: "Group not found" });

    chat.participants = chat.participants.filter(
      (id) => id.toString() !== userId
    );
    await chat.save();

    io.to(roomId).emit("userRemoved", { userId, roomId });

    res.status(200).json({ message: "User removed", chat });
  } catch (error) {
    console.error("RemoveUserFromGroup Error:", error);
    res.status(500).json({ message: "Error removing user from group" });
  }
};
