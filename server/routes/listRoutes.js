const express = require("express");
const router = express.Router();

const {
  createList,
  getListsByBoard,
  getListById,
  deleteList,
} = require("../controllers/listController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createList);
router.get("/board/:boardId", protect, getListsByBoard);
router.get("/:id", protect, getListById);
router.delete("/:id", protect, deleteList);

module.exports = router;