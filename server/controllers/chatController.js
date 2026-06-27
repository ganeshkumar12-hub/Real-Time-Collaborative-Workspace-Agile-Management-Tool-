const ChatMessage = require("../models/ChatMessage");
const { getIO } = require("../socket/socket");

// Get all messages for a board
const getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      board: req.params.boardId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { boardId, message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const chatMessage = await ChatMessage.create({
      board: boardId,
      sender: req.user.id,
      message,
    });

    const populatedMessage =
      await ChatMessage.findById(chatMessage._id)
        .populate("sender", "name email");

    getIO()
      .to(boardId)
      .emit("chatMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};