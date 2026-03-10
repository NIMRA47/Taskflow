import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Edittodo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, index } = location.state;

  const currentItem = items[index];
  const [updateText, setUpdateText] = useState(
    typeof currentItem === "object" ? currentItem.text : currentItem || ""
  );

  const editTodo = () => {
    if (!updateText.trim()) return;
    const updatedTodos = items.map((item, i) => {
      if (i !== index) return item;
      return typeof item === "object"
        ? { ...item, text: updateText.trim() }
        : { text: updateText.trim(), completed: false, createdAt: new Date().toISOString() };
    });
    localStorage.setItem("todo", JSON.stringify(updatedTodos));
    navigate("/");
  };

  return (
    <div className="todo-page">
      <div className="form-card">
        <h2 className="form-title">✎ Edit Task</h2>
        <input
          className="todo-input"
          type="text"
          value={updateText}
          onChange={(e) => setUpdateText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && editTodo()}
          autoFocus
        />
        <div className="form-actions">
          <button className="btn btn-primary" onClick={editTodo}>
            Update Task
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edittodo;
