import { useEffect, useState } from "react";
import { createTodo, getTodos } from "./api/todoApi";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

      const response = await createTodo({
        title,
        description,
      });

      setTodos((currentTodos) => [response.data, ...currentTodos]);
      setTitle("");
      setDescription("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create todo");
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

        <button type="submit">Add Todo</button>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
