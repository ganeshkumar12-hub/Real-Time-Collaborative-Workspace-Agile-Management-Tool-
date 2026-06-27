const Comment = require("../models/Comment");
const Card = require("../models/Card");
const List = require("../models/List");

// Create Comment
const createComment = async (req, res) => {
  try {
    const { text, cardId } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const comment = await Comment.create({
      text,
      card: cardId,
      author: req.user.id,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name email");

    // Find board
    const card = await Card.findById(cardId);
    const list = await List.findById(card.list);

    req.io
      .to(list.board.toString())
      .emit("commentCreated", populatedComment);

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get Comments by Card
const getCommentsByCard = async (req, res) => {
  try {
    const comments = await Comment.find({
      card: req.params.cardId,
    })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Delete Comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const card = await Card.findById(comment.card);
    const list = await List.findById(card.list);

    await comment.deleteOne();

    req.io
      .to(list.board.toString())
      .emit("commentDeleted", comment._id);

    res.json({
      message: "Comment deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createComment,
  getCommentsByCard,
  deleteComment,
};