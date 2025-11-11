// =====================================
// ALPHA LAN — Badge Model
// =====================================

import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: "/badges/default.svg", // local path or LAN asset
    },

    // e.g. "xp", "challenges_completed", "projects_shared"
    category: {
      type: String,
      default: "general",
    },

    // XP or milestone requirement
    criteria: {
      type: String,
      default: "Custom",
    },

    xpReward: {
      type: Number,
      default: 0,
    },

    // Whether it’s manually or automatically awarded
    isAutoAwarded: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================
// 🧠 Methods
// =====================================

// Award badge to a user (utility function)
badgeSchema.statics.awardToUser = async function (user, badgeId) {
  if (!user.badges.includes(badgeId)) {
    user.badges.push(badgeId);
    user.xp += this.xpReward || 0;
    await user.save();
  }
  return user;
};

// =====================================
// ✅ Export Model
// =====================================
const Badge = mongoose.model("Badge", badgeSchema);
export default Badge;

