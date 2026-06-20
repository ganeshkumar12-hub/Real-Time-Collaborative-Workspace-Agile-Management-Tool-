const express = require("express");
const router = express.Router();

const {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  inviteMember,
} = require("../controllers/workspaceController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createWorkspace);
router.get("/", protect, getMyWorkspaces);
router.get("/:id", protect, getWorkspaceById);
router.put("/:id/invite", protect, inviteMember);

module.exports = router;