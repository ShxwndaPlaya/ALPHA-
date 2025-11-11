// =====================================
// ALPHA LAN — CodeProject Model
// =====================================

import mongoose from "mongoose";

const codeProjectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "A cool project shared on ALPHA LAN ⚡",
    },

    language: {
      type: String,
      enum: ["python", "cpp", "c", "java", "js", "html", "css", "other"],
      default: "python",
    },

    files: [
      {
        name: String,
        content: String,
        type: {
          type: String, // 'file' or 'folder'
          default: "file",
        },
      },
    ],

    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    forks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CodeProject",
      },
    ],

    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        stars: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
      },
    ],

    tags: [String],

    visibility: {
      type: String,
      enum: ["private", "public", "shared"],
      default: "public",
    },

    xpReward: {
      type: Number,
      default: 50,
    },

    version: {
      type: String,
      default: "1.0.0",
    },
  },
  { timestamps: true }
);

// =====================================
// 🧠 Virtuals & Methods
// =====================================

// Compute average rating
codeProjectSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((sum, r) => sum + r.stars, 0);
  return (total / this.ratings.length).toFixed(1);
});

// Fork a project
codeProjectSchema.methods.forkProject = async function (userId) {
  const fork = new this.constructor({
    owner: userId,
    title: `${this.title} (fork)`,
    description: this.description,
    language: this.language,
    files: this.files,
    tags: this.tags,
    visibility: "private",
  });

  await fork.save();
  this.forks.push(fork._id);
  await this.save();
  return fork;
};

// Add rating or review
codeProjectSchema.methods.addRating = async function (userId, stars, comment = "") {
  const existing = this.ratings.find((r) => r.user.toString() === userId.toString());
  if (existing) {
    existing.stars = stars;
    existing.comment = comment;
  } else {
    this.ratings.push({ user: userId, stars, comment });
  }
  return this.save();
};

// =====================================
// ✅ Export Model
// =====================================
const CodeProject = mongoose.model("CodeProject", codeProjectSchema);
export default CodeProject;
