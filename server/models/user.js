// =====================================
// ALPHA LAN — User Model
// =====================================

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    avatar: {
      type: String, // stores local path or base64 avatar
      default: "/avatars/default.png",
    },

    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],

    bio: {
      type: String,
      default: "Hey there! I'm part of the ALPHA LAN network ⚡",
    },

    status: {
      type: String,
      enum: ["online", "offline", "busy", "away"],
      default: "offline",
    },
  },
  {
    timestamps: true,
  }
);

// =====================================
// 🔐 Password Hash Middleware
// =====================================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// =====================================
// 🧠 Instance Methods
// =====================================

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.addXP = function (amount) {
  this.xp += amount;
  // Auto-level system: every 1000 XP = +1 level
  if (this.xp >= this.level * 1000) {
    this.level++;
  }
  return this.save();
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password; // remove password hash from responses
  return obj;
};

// =====================================
// ✅ Export Model
// =====================================
const User = mongoose.model("User", userSchema);
export default User;
