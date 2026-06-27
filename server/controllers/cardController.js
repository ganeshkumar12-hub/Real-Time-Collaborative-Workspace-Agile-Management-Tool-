const Activity = require("../models/Activity");
const Card = require("../models/Card");
const Notification = require("../models/Notification");
const List = require("../models/List");
const { getIO } = require("../socket/socket");

// Create Card
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

    await Activity.create({
      action: `Created card "${card.title}"`,
      user: req.user?._id,
      card: card._id,
    });

    getIO()
      .to(list.board.toString())
      .emit("cardCreated", card);

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Cards by List
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

// Get Card by ID
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
// Search Cards
const searchCards = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const cards = await Card.find({
      $or: [
        {
          title: {
            $regex: q,
            $options: "i",
          },
        },
        {
          description: {
            $regex: q,
            $options: "i",
          },
        },
      ],
    }).populate("assignedTo", "name email");

    res.json(cards);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Update Card
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

      await Activity.create({
        action: `Updated due date for "${card.title}"`,
        user: req.user?._id,
        card: card._id,
      });
    }

    if (req.body.assignedTo !== undefined) {
      card.assignedTo = req.body.assignedTo;

      await Activity.create({
        action: `Assigned card "${card.title}"`,
        user: req.user?._id,
        card: card._id,
      });

      await Notification.create({
        message: `You were assigned to "${card.title}"`,
        user: req.body.assignedTo,
      });
    }

    if (req.body.list !== undefined) {
      card.list = req.body.list;

      await Activity.create({
        action: `Moved card "${card.title}"`,
        user: req.user?._id,
        card: card._id,
      });
    }

    const updatedCard = await card.save();

    const populatedCard = await Card.findById(
      updatedCard._id
    ).populate("assignedTo", "name email");

    const list = await List.findById(populatedCard.list);

    getIO()
      .to(list.board.toString())
      .emit("cardUpdated", populatedCard);

    res.json(populatedCard);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Card
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const list = await List.findById(card.list);

    getIO()
      .to(list.board.toString())
      .emit("cardDeleted", card._id);

    await Activity.create({
      action: `Deleted card "${card.title}"`,
      user: req.user?._id,
      card: card._id,
    });

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
  searchCards,
  updateCard,
  deleteCard,
};