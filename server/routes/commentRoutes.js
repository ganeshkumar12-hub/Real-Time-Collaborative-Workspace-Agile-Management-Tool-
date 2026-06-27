const express = require("express");
const {
  createComment,
  getCommentsByCard,
  deleteComment,
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
router.delete(
  "/:id",
  protect,
  deleteComment
);
module.exports = router;