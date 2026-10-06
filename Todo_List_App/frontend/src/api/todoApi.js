import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/todos",
});

export const getTodos = (search = "") =>
  API.get("/", {
    params: search ? { search } : {},
  });

export const getTodo = (id) => API.get(`/${id}`);

export const createTodo = (todo) => API.post("/", todo);

export const updateTodo = (id, todo) => API.put(`/${id}`, todo);

export const updateTodoStatus = (id, status) =>
  API.patch(`/${id}/status`, { status });

export const deleteTodo = (id) => API.delete(`/${id}`);
