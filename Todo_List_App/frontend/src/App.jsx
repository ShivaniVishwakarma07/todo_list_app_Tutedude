import { useEffect, useState } from "react";
import { getTodos } from "./api/todoApi";

function App() {
  const [todos, setTodos] = useState([]);
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

  return (
    <div className="app">
      <h1>Todo List</h1>

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
