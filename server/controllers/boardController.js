const Board = require("../models/Board");
const Workspace = require("../models/Workspace");

const createBoard = async (req, res) => {
  try {
    const { name, workspaceId } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const board = await Board.create({
      name,
      workspace: workspaceId,
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBoardsByWorkspace = async (req, res) => {
  try {
    const boards = await Board.find({
      workspace: req.params.workspaceId,
    });

    res.json(boards);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    await board.deleteOne();

    res.json({
      message: "Board deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBoard,
  getBoardsByWorkspace,
  getBoardById,
  deleteBoard,
};