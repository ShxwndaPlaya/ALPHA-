// =====================================
// ALPHA LAN — Challenge Model
// =====================================

import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    type: {
      type: String,
      enum: ["quiz", "coding", "hackathon"],
      default: "coding",
    },

    // XP reward for completing challenge
    xpReward: {
      type: Number,
      default: 100,
    },

    // Optional badge reward
    badgeReward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
    },

    // For quizzes (MCQs)
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: Number, // index of correct option
      },
    ],

    // For coding challenges
    testCases: [
      {
        input: String,
        expectedOutput: String,
      },
    ],

    // Track participants
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "completed", "failed"],
          default: "pending",
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],

    tags: [String],

    startDate: Date,
    endDate: Date,
  },
  {
    timestamps: true,
  }
);

// =====================================
// 🧠 Methods
// =====================================

// Add participant
challengeSchema.methods.addParticipant = async function (userId) {
  const exists = this.participants.find(
    (p) => p.user.toString() === userId.toString()
  );
  if (!exists) {
    this.participants.push({ user: userId });
    await this.save();
  }
  return this;
};

// Mark challenge completion
challengeSchema.methods.completeChallenge = async function (userId, score = 100) {
  const participant = this.participants.find(
    (p) => p.user.toString() === userId.toString()
  );
  if (participant) {
    participant.status = "completed";
    participant.score = score;
    await this.save();
  }
  return this;
};

// =====================================
// ✅ Export Model
// =====================================
const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
