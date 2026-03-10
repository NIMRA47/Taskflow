import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Todo = () => {
  const [todo, setTodo] = useState("");
  const navigate = useNavigate();

  const saveTodo = () => {
    if (!todo.trim()) return;

    let todos = [];
    try {
      const stored = localStorage.getItem("todo");
      todos = stored ? JSON.parse(stored) : [];
    } catch {
      todos = [];
    }

    todos.push({ text: todo.trim(), completed: false, createdAt: new Date().toISOString() });
    localStorage.setItem("todo", JSON.stringify(todos));
    setTodo("");
    navigate("/");
  };

  return (
    <div className="todo-page">
      <div className="form-card">
        <h2 className="form-title">✦ New Task</h2>
        <input
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveTodo()}
          className="todo-input"
          type="text"
          placeholder="What needs to be done?"
          autoFocus
        />
        <div className="form-actions">
          <button onClick={saveTodo} className="btn btn-primary">
            Save Task
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Todo;
