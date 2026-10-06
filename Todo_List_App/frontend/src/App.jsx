import { useEffect, useState } from "react";
import {
  createTodo,
  getTodos,
  updateTodo,
  updateTodoStatus,
  deleteTodo,
} from "./api/todoApi";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTodos(search);
      setTodos(response.data);
    } catch (error) {
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setError("");

      if (editingId) {
        const response = await updateTodo(editingId, {
          title,
          description,
        });

        setTodos((currentTodos) =>
          currentTodos.map((todo) =>
            todo._id === editingId ? response.data : todo,
          ),
        );

        setEditingId(null);
      } else {
        const response = await createTodo({
          title,
          description,
        });

        setTodos((currentTodos) => [response.data, ...currentTodos]);
      }

      setTitle("");
      setDescription("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save todo");
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setTitle(todo.title);
    setDescription(todo.description);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setError("");
  };

  const handleStatusChange = async (todo) => {
    try {
      setError("");

      const newStatus = todo.status === "completed" ? "pending" : "completed";

      if (!["pending", "completed"].includes(newStatus)) {
        setError("Status must be pending or completed");
        return;
      }

      const response = await updateTodoStatus(todo._id, newStatus);

      setTodos((currentTodos) =>
        currentTodos.map((item) =>
          item._id === todo._id ? response.data : item,
        ),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      await deleteTodo(id);

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo._id !== id),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete todo");
    }
  };

  return (
    <div className="app">
      <h1>Todo List</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter todo title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <button type="submit">{editingId ? "Update Todo" : "Add Todo"}</button>

        {editingId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <div className="search">
        <input
          type="text"
          placeholder="Search todos"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button type="button" onClick={fetchTodos}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && todos.length === 0 && <p>No todos found</p>}

      <div>
        {todos.map((todo) => (
          <div className="todo" key={todo._id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>Status: {todo.status}</p>

            <button className="edit-btn" onClick={() => handleEdit(todo)}>
              Edit
            </button>

            <button
              className={
                todo.status === "completed" ? "pending-btn" : "complete-btn"
              }
              onClick={() => handleStatusChange(todo)}
            >
              {todo.status === "completed" ? "Mark Pending" : "Mark Completed"}
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDelete(todo._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
