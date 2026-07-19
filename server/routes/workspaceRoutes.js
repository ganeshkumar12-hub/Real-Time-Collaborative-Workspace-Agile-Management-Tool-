const express = require("express");
const router = express.Router();

const {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  inviteMember,
  deleteWorkspace,
} = require("../controllers/workspaceController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createWorkspace);
router.get("/", protect, getMyWorkspaces);
router.get("/:id", protect, getWorkspaceById);
router.put("/:id/invite", protect, inviteMember);
router.delete("/:id", protect, deleteWorkspace);

module.exports = router;