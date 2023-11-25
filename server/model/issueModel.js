const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
    file: {
      filename: String,
      data: Buffer,
      contentType: String,
    },
    currentProject: String,
    title: String,
    description: String,
    status: String,
    priority: String,
  }, {
    timestamps: true,
  });

const Issue = mongoose.model("Issue",issueSchema);

module.exports = Issue;