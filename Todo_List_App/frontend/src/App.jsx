import { useEffect, useState } from "react";
import { createTodo, getTodos, updateTodo } from "./api/todoApi";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTodos();
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

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && todos.length === 0 && <p>No todos found</p>}

      <div>
        {todos.map((todo) => (
          <div className="todo" key={todo._id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>Status: {todo.status}</p>

            <button onClick={() => handleEdit(todo)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
