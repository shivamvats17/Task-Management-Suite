const asyncHandler = require("express-async-handler");
const Board = require("../models/Board");
const List = require("../models/List");
const Card = require("../models/Card");

const getBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
    isArchived: false,
  })
    .populate("owner", "name email avatarColor")
    .sort({ updatedAt: -1 });

  res.json({ success: true, count: boards.length, boards });
});


const getBoardById = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id)
    .populate("owner", "name email avatarColor")
    .populate("members", "name email avatarColor");

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  const isAuthorized =
    board.owner._id.toString() === req.user._id.toString() ||
    board.members.some((m) => m._id.toString() === req.user._id.toString());

  if (!isAuthorized) {
    res.status(403);
    throw new Error("Not authorized to access this board");
  }

  res.json({ success: true, board });
});


const createBoard = asyncHandler(async (req, res) => {
  const { title, description, background } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Board title is required");
  }

  const board = await Board.create({
    title,
    description,
    background,
    owner: req.user._id,
    members: [req.user._id],
  });


  const defaultLists = ["To Do", "In Progress", "Done"];
  await Promise.all(
    defaultLists.map((title, index) =>
      List.create({ title, board: board._id, position: index })
    )
  );

  res.status(201).json({ success: true, board });
});


const updateBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the board owner can update this board");
  }

  const { title, description, background, isArchived } = req.body;
  if (title !== undefined) board.title = title;
  if (description !== undefined) board.description = description;
  if (background !== undefined) board.background = background;
  if (isArchived !== undefined) board.isArchived = isArchived;

  await board.save();
  res.json({ success: true, board });
});


const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the board owner can delete this board");
  }

  const lists = await List.find({ board: board._id });
  const listIds = lists.map((l) => l._id);

  await Card.deleteMany({ list: { $in: listIds } });
  await List.deleteMany({ board: board._id });
  await board.deleteOne();

  res.json({ success: true, message: "Board deleted successfully" });
});


const addMember = asyncHandler(async (req, res) => {
  const User = require("../models/User");
  const { email } = req.body;

  const board = await Board.findById(req.params.id);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the board owner can add members");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("No user found with this email");
  }

  if (board.members.includes(user._id)) {
    res.status(400);
    throw new Error("User is already a member of this board");
  }

  board.members.push(user._id);
  await board.save();

  res.json({ success: true, board });
});

module.exports = {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  addMember,
};
