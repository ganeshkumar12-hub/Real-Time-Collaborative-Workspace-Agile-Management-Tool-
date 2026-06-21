const List = require("../models/List");
const Board = require("../models/Board");

const createList = async (req, res) => {
  try {
    const { title, boardId, order } = req.body;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    const list = await List.create({
      title,
      board: boardId,
      order: order || 0,
    });

    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getListsByBoard = async (req, res) => {
  try {
    const lists = await List.find({
      board: req.params.boardId,
    }).sort({ order: 1 });

    res.json(lists);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    await list.deleteOne();

    res.json({
      message: "List deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createList,
  getListsByBoard,
  getListById,
  deleteList,
};