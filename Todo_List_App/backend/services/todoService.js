const Todo = require("../models/todoModel");

const getAllTodos = async () => {
  return await Todo.find().sort({ createdAt: -1 });
};

const getTodoById = async (id) => {
  return await Todo.findById(id);
};

const createTodo = async (todoData) => {
  return await Todo.create(todoData);
};

const updateTodo = async (id, todoData) => {
  return await Todo.findByIdAndUpdate(id, todoData, {
    new: true,
    runValidators: true,
  });
};

const deleteTodo = async (id) => {
  return await Todo.findByIdAndDelete(id);
};

const searchTodos = async (query) => {
  return await Todo.find({
    title: { $regex: query, $options: "i" },
  }).sort({ createdAt: -1 });
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  searchTodos,
};
