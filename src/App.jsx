import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import Todo from "./pages/Todo";
import Edittodo from "./pages/Edittodo";

function App() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all"); // all | pending | completed
  const navigate = useNavigate();
  const location = useLocation();

  const loadTodos = () => {
    try {
      const storedTodos = localStorage.getItem("todo");
      const parsed = storedTodos ? JSON.parse(storedTodos) : [];
      // Normalize old string todos to objects
      const normalized = parsed.map((item) =>
        typeof item === "string"
          ? { text: item, completed: false, createdAt: new Date().toISOString() }
          : item
      );
      setItems(normalized);
    } catch {
      setItems([]);
    }
  };

  const deletetodo = (indexToDelete) => {
    const filteredItems = items.filter((_, index) => index !== indexToDelete);
    setItems(filteredItems);
    localStorage.setItem("todo", JSON.stringify(filteredItems));
  };

  const handleComplete = (indexToComplete) => {
    const updatedItems = items.map((item, index) =>
      index === indexToComplete
        ? { ...item, completed: !item.completed }
        : item
    );
    setItems(updatedItems);
    localStorage.setItem("todo", JSON.stringify(updatedItems));
  };

  const clearCompleted = () => {
    const remaining = items.filter((item) => !item.completed);
    setItems(remaining);
    localStorage.setItem("todo", JSON.stringify(remaining));
  };

  useEffect(() => {
    loadTodos();
  }, [location.pathname]);

  const filteredItems = items.filter((item) => {
    if (filter === "pending") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  const pendingCount = items.filter((i) => !i.completed).length;
  const completedCount = items.filter((i) => i.completed).length;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <nav className="nav">
              <span className="nav-title">✦ Todo App</span>
              <span className="nav-stats">{pendingCount} pending · {completedCount} done</span>
            </nav>

            <div className="main-container">
              <button className="btn btn-primary create-btn" onClick={() => navigate("/todo")}>
                + Create Task
              </button>

              {/* Filter Tabs */}
              <div className="filter-tabs">
                {["all", "pending", "completed"].map((f) => (
                  <button
                    key={f}
                    className={`filter-tab ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                    <span className="tab-count">
                      {f === "all" ? items.length : f === "pending" ? pendingCount : completedCount}
                    </span>
                  </button>
                ))}
              </div>

              {/* Todo List */}
              <div className="todo-list">
                {filteredItems.length === 0 ? (
                  <div className="empty-state">
                    {filter === "completed" ? "No completed tasks yet." : filter === "pending" ? "Nothing pending! 🎉" : "No tasks yet. Create one!"}
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const realIndex = items.indexOf(item);
                    return (
                      <div key={realIndex} className={`todo-card ${item.completed ? "completed" : ""}`}>
                        <div className="todo-left">
                          <button
                            className={`check-btn ${item.completed ? "checked" : ""}`}
                            onClick={() => handleComplete(realIndex)}
                            title="Toggle complete"
                          >
                            {item.completed ? "✔" : ""}
                          </button>
                          <p className={`todo-text ${item.completed ? "done-text" : ""}`}>
                            {item.text}
                          </p>
                        </div>
                        <div className="todo-actions">
                          <span className={`status-badge ${item.completed ? "badge-done" : "badge-pending"}`}>
                            {item.completed ? "Completed" : "Pending"}
                          </span>
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => navigate("/edit", { state: { items, index: realIndex } })}
                          >
                            ✎ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => deletetodo(realIndex)}
                          >
                            ✕ Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Clear completed */}
              {completedCount > 0 && (
                <div className="clear-section">
                  <button className="btn btn-clear" onClick={clearCompleted}>
                    Clear {completedCount} completed task{completedCount > 1 ? "s" : ""}
                  </button>
                </div>
              )}
            </div>
          </>
        }
      />
      <Route path="/todo" element={<Todo />} />
      <Route path="/edit" element={<Edittodo />} />
    </Routes>
  );
}

export default App;
