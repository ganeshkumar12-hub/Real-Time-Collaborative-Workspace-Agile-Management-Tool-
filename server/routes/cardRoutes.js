const express = require("express");
const router = express.Router();

const {
  createCard,
  getCardsByList,
  getCardById,
  updateCard,
  deleteCard,
  searchCards,
} = require("../controllers/cardController");

const { protect } = require("../middleware/authMiddleware");
console.log("Card protect:", typeof protect);
// Create Card
router.post("/", protect, createCard);

// Search Cards
router.get("/search", protect, searchCards);

// Get Cards by List
router.get("/list/:listId", protect, getCardsByList);

// Get Card by ID
router.get("/:id", protect, getCardById);

// Update Card
router.put("/:id", protect, updateCard);

// Delete Card
router.delete("/:id", protect, deleteCard);

module.exports = router;