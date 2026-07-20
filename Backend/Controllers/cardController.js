const asyncHandler = require("express-async-handler");
const Card = require("../models/Card");
const List = require("../models/List");


const createCard = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, labels } = req.body;
  const list = await List.findById(req.params.listId);

  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  const lastCard = await Card.findOne({ list: list._id }).sort({
    position: -1,
  });
  const position = lastCard ? lastCard.position + 1 : 0;

  const card = await Card.create({
    title,
    description,
    priority,
    dueDate,
    labels,
    list: list._id,
    board: list.board,
    position,
  });

  res.status(201).json({ success: true, card });
});


const getCardById = asyncHandler(async (req, res) => {
  const card = await Card.findById(req.params.id)
    .populate("assignees", "name email avatarColor")
    .populate("comments.author", "name email avatarColor");

  if (!card) {
    res.status(404);
    throw new Error("Card not found");
  }

  res.json({ success: true, card });
});


const updateCard = asyncHandler(async (req, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) {
    res.status(404);
    throw new Error("Card not found");
  }

  const fields = [
    "title",
    "description",
    "priority",
    "dueDate",
    "labels",
    "assignees",
    "checklist",
    "isCompleted",
    "position",
    "list",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) card[field] = req.body[field];
  });

  await card.save();
  res.json({ success: true, card });
});


const moveCard = asyncHandler(async (req, res) => {
  const { destinationListId, destinationPosition } = req.body;
  const card = await Card.findById(req.params.id);

  if (!card) {
    res.status(404);
    throw new Error("Card not found");
  }

  card.list = destinationListId;
  card.position = destinationPosition;
  await card.save();

  res.json({ success: true, card });
});


const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const card = await Card.findById(req.params.id);

  if (!card) {
    res.status(404);
    throw new Error("Card not found");
  }

  card.comments.push({ text, author: req.user._id });
  await card.save();

  const populated = await card.populate("comments.author", "name avatarColor");
  res.status(201).json({ success: true, card: populated });
});


const deleteCard = asyncHandler(async (req, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) {
    res.status(404);
    throw new Error("Card not found");
  }

  await card.deleteOne();
  res.json({ success: true, message: "Card deleted successfully" });
});

module.exports = {
  createCard,
  getCardById,
  updateCard,
  moveCard,
  addComment,
  deleteCard,
};
