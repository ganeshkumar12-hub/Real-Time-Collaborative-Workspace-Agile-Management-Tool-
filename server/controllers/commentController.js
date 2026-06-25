const Comment = require("../models/Comment");

const createComment = async (req, res) => {
  try {
    console.log("Authorization:", req.headers.authorization);
    console.log("req.user:", req.user);

    const comment = await Comment.create({
  text: req.body.text,
  card: req.body.cardId,
  user: req.user.id,
});

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name email");

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCommentsByCard = async (req, res) => {
  try {
    const comments =
      await Comment.find({
        card: req.params.cardId,
      })
        .populate("user", "name email")
        .sort({
          createdAt: 1,
        });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createComment,
  getCommentsByCard,
};