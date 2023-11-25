const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectnames: {
      type: [String],  // 'projectnames' is an array of strings
      default: [],     // Default value is an empty array
    },// Ensure 'projectnames' is an array of strings
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
