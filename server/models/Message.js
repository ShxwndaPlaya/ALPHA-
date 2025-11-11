// =====================================
// ALPHA LAN — Message Model
// =====================================

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Either a group chat or a private recipient
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },

    // Text or code snippet message
    content: {
      type: String,
      trim: true,
    },

    // Optional attachments or shared code
    attachments: [
      {
        fileName: String,
        fileType: String,
        filePath: String, // stored locally (e.g., /uploads/123-file.py)
      },
    ],

    // Type of message for rendering
    type: {
      type: String,
      enum: ["text", "file", "code", "system"],
      default: "text",
    },

    // Optional metadata for code snippets
    language: {
      type: String, // e.g., 'python', 'cpp'
    },

    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: String,
      },
    ],

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// =====================================
// 🧠 Helper Methods
// =====================================

// Mark message as read by a user
messageSchema.methods.markAsRead = function (userId) {
  if (!this.readBy.includes(userId)) {
    this.readBy.push(userId);
    return this.save();
  }
};

// Add reaction to a message
messageSchema.methods.addReaction = function (userId, emoji) {
  this.reactions.push({ user: userId, emoji });
  return this.save();
};

// =====================================
// ✅ Export Model
// =====================================
const Message = mongoose.model("Message", messageSchema);
export default Message;
