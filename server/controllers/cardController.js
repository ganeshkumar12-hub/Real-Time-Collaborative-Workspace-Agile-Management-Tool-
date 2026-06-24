

const Card = require("../models/Card");
const List = require("../models/List");
const {
  getIO,
} = require("../socket/socket");

const createCard = async (req, res) => {
  try {
    const { title, description, listId } = req.body;

    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    const card = await Card.create({
      title,
      description,
      list: listId,
    });

    getIO().emit(
      "cardCreated",
      card
    );

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCardsByList = async (req, res) => {
  try {
    const cards = await Card.find({
      list: req.params.listId,
    }).populate("assignedTo", "name email");

    res.json(cards);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    res.json(card);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    if (req.body.title !== undefined) {
      card.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      card.description = req.body.description;
    }

    if (req.body.dueDate !== undefined) {
      card.dueDate = req.body.dueDate;
    }

    if (req.body.assignedTo !== undefined) {
      card.assignedTo = req.body.assignedTo;
    }

    if (req.body.list !== undefined) {
      card.list = req.body.list;
    }

    const updatedCard = await card.save();

    const populatedCard = await Card.findById(
      updatedCard._id
    ).populate("assignedTo", "name email");
    getIO().emit(
  "cardUpdated",
  populatedCard
);

    res.json(populatedCard);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }
    getIO().emit(
  "cardDeleted",
  card._id
);
    await card.deleteOne();

    res.json({
      message: "Card deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createCard,
  getCardsByList,
  getCardById,
  updateCard,
  deleteCard,
};