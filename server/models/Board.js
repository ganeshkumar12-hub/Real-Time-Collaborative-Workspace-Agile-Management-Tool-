const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);