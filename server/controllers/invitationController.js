const Invitation = require("../models/Invitation");
const Workspace = require("../models/Workspace");

// Invite User
const inviteUser = async (req, res) => {
  try {
    const { workspaceId, receiverId } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    console.log("========== INVITATION DEBUG ==========");
    console.log("Workspace:", workspace);
    console.log("Workspace Owner:", workspace?.owner);
    console.log("JWT User:", req.user);
    console.log("JWT User ID:", req.user?.id);
    console.log("======================================");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    if (!workspace.owner) {
      return res.status(500).json({
        message: "Workspace owner is missing.",
      });
    }

    // Only workspace owner can invite users
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only workspace owner can invite users",
      });
    }

    // Already a member?
    if (workspace.members.includes(receiverId)) {
      return res.status(400).json({
        message: "User is already a member",
      });
    }

    // Existing pending invitation?
    const existingInvitation = await Invitation.findOne({
      workspace: workspaceId,
      receiver: receiverId,
      status: "pending",
    });

    if (existingInvitation) {
      return res.status(400).json({
        message: "Invitation already sent",
      });
    }

    const invitation = await Invitation.create({
      workspace: workspaceId,
      sender: req.user.id,
      receiver: receiverId,
    });

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation,
    });
  } catch (error) {
    console.error("Invitation Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Pending Invitations
const getInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      receiver: req.user.id,
      status: "pending",
    })
      .populate("workspace", "name")
      .populate("sender", "name email");

    res.json(invitations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Accept Invitation
const acceptInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    invitation.status = "accepted";
    await invitation.save();

    await Workspace.findByIdAndUpdate(
      invitation.workspace,
      {
        $addToSet: {
          members: invitation.receiver,
        },
      }
    );

    res.json({
      message: "Invitation accepted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Reject Invitation
const rejectInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    invitation.status = "rejected";
    await invitation.save();

    res.json({
      message: "Invitation rejected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  inviteUser,
  getInvitations,
  acceptInvitation,
  rejectInvitation,
};