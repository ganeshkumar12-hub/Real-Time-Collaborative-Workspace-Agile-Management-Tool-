const express = require("express");
const router = express.Router();

const {
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authMiddleware");

// Get all chat messages for a board
router.get("/:boardId", protect, getMessages);

// Send a new message
router.post("/", protect, sendMessage);

module.exports = router;