const express = require("express");
const {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  updateStatus,
  deleteTodo,
} = require("../controllers/todoController");

const router = express.Router();

router.get("/", getTodos);
router.get("/:id", getTodo);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.patch("/:id/status", updateStatus);
router.delete("/:id", deleteTodo);

module.exports = router;
