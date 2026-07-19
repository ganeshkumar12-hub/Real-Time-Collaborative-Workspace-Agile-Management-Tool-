const Workspace = require("../models/Workspace");

const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    const workspace = await Workspace.create({
      name,
      owner: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find()
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    res.json(workspace);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const inviteMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only workspace owner can invite members",
      });
    }

    const memberExists = workspace.members.some(
      (member) => member.toString() === userId
    );

    if (!memberExists) {
      workspace.members.push(userId);
      await workspace.save();
    }

    res.json({
      message: "Member added successfully",
      workspace,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the workspace owner can delete this workspace",
      });
    }

    await Workspace.findByIdAndDelete(req.params.id);

    res.json({
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  inviteMember,
  deleteWorkspace,
};