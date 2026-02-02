import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Go to supermarket", done: false },
    { id: 2, text: "Do my homework", done: true },
    { id: 3, text: "Play game", done: false },
    { id: 4, text: "Read novel", done: false },
  ]);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const [currentTodo, setCurrentTodo] = useState(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef();

  useEffect(() => {
    if (showCreate || showUpdate) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [showCreate, showUpdate]);

  // Toggle done
  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  // Filter + search
  const filteredTodos = todos.filter((t) => {
    if (filter === "done" && !t.done) return false;
    if (filter === "progress" && t.done) return false;
    if (!t.text.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  // Create
  const handleCreate = () => {
    if (!value.trim()) {
      setError("Please enter todo name");
      return;
    }
    setTodos([
      ...todos,
      { id: Date.now(), text: value, done: false },
    ]);
    setValue("");
    setError("");
    setShowCreate(false);
  };

  // Delete
  const handleDelete = () => {
    setTodos(todos.filter((t) => t.id !== currentTodo.id));
    setShowDelete(false);
  };

  // Update
  const handleUpdate = () => {
    if (!value.trim()) {
      setError("Please enter todo name");
      return;
    }
    if (value === currentTodo.text) {
      setShowUpdate(false);
      return;
    }
    setTodos(
      todos.map((t) =>
        t.id === currentTodo.id ? { ...t, text: value } : t
      )
    );
    setShowUpdate(false);
  };

  return (
    <div className="container">
      <h1 className="title">TODO</h1>

      {/* Search + Create */}
      <div className="top">
        <input
          placeholder="Input search key"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setShowCreate(true)}>
          Create
        </button>
      </div>

      {/* Filter */}
      <div className="filter">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "done" ? "active" : ""}
          onClick={() => setFilter("done")}
        >
          Done
        </button>
        <button
          className={filter === "progress" ? "active" : ""}
          onClick={() => setFilter("progress")}
        >
          In-progress
        </button>
      </div>

      {/* List */}
      {filteredTodos.length === 0 ? (
        <p className="empty">No search found</p>
      ) : (
        <ul className="list">
          {filteredTodos.map((t) => (
            <li
              key={t.id}
              className={`todo-item ${t.done ? "completed" : ""}`}
            >
              <span
                className={t.done ? "done" : ""}
                onClick={() => toggleTodo(t.id)}
              >
                {t.text}
              </span>

              <div className="actions">
                <button
                  className="delete"
                  onClick={() => {
                    setCurrentTodo(t);
                    setShowDelete(true);
                  }}
                >
                  🗑
                </button>
                <button
                  className="edit"
                  onClick={() => {
                    setCurrentTodo(t);
                    setValue(t.text);
                    setShowUpdate(true);
                  }}
                >
                  ✏️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="modal">
          <div className="dialog">
            <h3>Create Todo</h3>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={error ? "error" : ""}
            />
            {error && <p className="msg">{error}</p>}
            <div className="dialog-btn">
              <button onClick={handleCreate}>Create</button>
              <button onClick={() => setShowCreate(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="modal">
          <div className="dialog">
            <p>Delete this todo?</p>
            <div className="dialog-btn">
              <button onClick={handleDelete}>Delete</button>
              <button onClick={() => setShowDelete(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {showUpdate && (
        <div className="modal">
          <div className="dialog">
            <h3>Update Todo</h3>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={error ? "error" : ""}
            />
            {error && <p className="msg">{error}</p>}
            <div className="dialog-btn">
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setShowUpdate(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
