const express = require("express");
const router = express.Router();

const {
  createCard,
  getCardsByList,
  getCardById,
  updateCard,
  deleteCard,
} = require("../controllers/cardController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createCard);
router.get("/list/:listId", protect, getCardsByList);
router.get("/:id", protect, getCardById);
router.put("/:id", protect, updateCard);
router.delete("/:id", protect, deleteCard);

module.exports = router;