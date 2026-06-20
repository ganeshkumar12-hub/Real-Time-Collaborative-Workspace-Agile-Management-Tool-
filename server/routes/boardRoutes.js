const express = require("express");
const router = express.Router();

const {
  createBoard,
  getBoardsByWorkspace,
  getBoardById,
  deleteBoard,
} = require("../controllers/boardController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBoard);
router.get("/workspace/:workspaceId", protect, getBoardsByWorkspace);
router.get("/:id", protect, getBoardById);
router.delete("/:id", protect, deleteBoard);

module.exports = router;