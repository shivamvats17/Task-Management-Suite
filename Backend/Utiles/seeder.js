
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Board = require("../models/Board");
const List = require("../models/List");
const Card = require("../models/Card");

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Board.deleteMany(),
    List.deleteMany(),
    Card.deleteMany(),
  ]);

  const user = await User.create({
    name: "Demo User",
    email: "demo@taskflow.com",
    password: "password123",
  });

  const board = await Board.create({
    title: "TaskFlow Launch Plan",
    description: "Demo board seeded automatically",
    owner: user._id,
    members: [user._id],
  });

  const listTitles = ["To Do", "In Progress", "Done"];
  const lists = await Promise.all(
    listTitles.map((title, index) =>
      List.create({ title, board: board._id, position: index })
    )
  );

  const demoCards = [
    { title: "Design database schema", list: lists[0]._id, priority: "high" },
    { title: "Set up Express server", list: lists[0]._id, priority: "medium" },
    { title: "Build authentication API", list: lists[1]._id, priority: "high" },
    { title: "Create React board UI", list: lists[1]._id, priority: "medium" },
    { title: "Project kickoff", list: lists[2]._id, priority: "low", isCompleted: true },
  ];

  await Promise.all(
    demoCards.map((c, index) =>
      Card.create({ ...c, board: board._id, position: index })
    )
  );

  console.log("Database seeded successfully!");
  console.log("Demo login -> email: admin@taskmanagementsuite.com | password: password123");
  mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
