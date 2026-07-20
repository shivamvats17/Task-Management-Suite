const express = require("express");
const router = express.Router();
const {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  addMember,
} = require("../controllers/boardController");
const {
  getLists,
  createList,
  reorderLists,
} = require("../controllers/listController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getBoards).post(createBoard);
router.route("/:id").get(getBoardById).put(updateBoard).delete(deleteBoard);
router.post("/:id/members", addMember);


router.route("/:boardId/lists").get(getLists).post(createList);
router.put("/:boardId/lists/reorder", reorderLists);

module.exports = router;
