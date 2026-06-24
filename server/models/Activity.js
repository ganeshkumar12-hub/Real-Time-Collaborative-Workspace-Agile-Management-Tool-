const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      default: null,
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Activity",
  activitySchema
);