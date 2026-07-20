const asyncHandler = require("express-async-handler");
const List = require("../models/List");
const Board = require("../models/Board");
const Card = require("../models/Card");


const getLists = asyncHandler(async (req, res) => {
  const lists = await List.find({ board: req.params.boardId }).sort({
    position: 1,
  });

  const listsWithCards = await Promise.all(
    lists.map(async (list) => {
      const cards = await Card.find({ list: list._id }).sort({ position: 1 });
      return { ...list.toObject(), cards };
    })
  );

  res.json({ success: true, lists: listsWithCards });
});


const createList = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const board = await Board.findById(req.params.boardId);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  const lastList = await List.findOne({ board: board._id }).sort({
    position: -1,
  });
  const position = lastList ? lastList.position + 1 : 0;

  const list = await List.create({ title, board: board._id, position });
  res.status(201).json({ success: true, list });
});


const updateList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);
  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  const { title, position } = req.body;
  if (title !== undefined) list.title = title;
  if (position !== undefined) list.position = position;

  await list.save();
  res.json({ success: true, list });
});


const deleteList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);
  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  await Card.deleteMany({ list: list._id });
  await list.deleteOne();

  res.json({ success: true, message: "List deleted successfully" });
});


const reorderLists = asyncHandler(async (req, res) => {
  const { orderedListIds } = req.body; // array of list ids in new order

  await Promise.all(
    orderedListIds.map((id, index) =>
      List.findByIdAndUpdate(id, { position: index })
    )
  );

  res.json({ success: true, message: "Lists reordered successfully" });
});

module.exports = { getLists, createList, updateList, deleteList, reorderLists };
