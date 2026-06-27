const express = require("express");
const router = express.Router();

const {
  inviteUser,
  getInvitations,
  acceptInvitation,
  rejectInvitation,
} = require("../controllers/invitationController");

const { protect } = require("../middleware/authMiddleware");

// Send workspace invitation
router.post("/", protect, inviteUser);

// Get pending invitations for logged-in user
router.get("/", protect, getInvitations);

// Accept invitation
router.put("/:id/accept", protect, acceptInvitation);

// Reject invitation
router.put("/:id/reject", protect, rejectInvitation);

module.exports = router;