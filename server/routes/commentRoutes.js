const express = require("express");
const {
  createComment,
  getCommentsByCard,
} = require("../controllers/commentController");

const { protect } =
  require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  createComment
);

router.get(
  "/:cardId",
  protect,
  getCommentsByCard
);

module.exports = router;