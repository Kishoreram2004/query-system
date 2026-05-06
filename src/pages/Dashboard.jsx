import { useEffect, useState } from "react";
import { addQuery, deleteQueryAndComments, getQueries, updateQueryStatus } from "../services/queryService";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, role, setUser, setRole } = useAuth();
  const [queries, setQueries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loadQueries = async () => {
    try {
      setError("");
      const data = await getQueries();
      setQueries(data);
    } catch (err) {
      setError(err.message || "Failed to load queries.");
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setRole(null);
    navigate("/login");
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const handleAdd = async () => {
    if (!title) return;

    await addQuery({ title, description });
    setTitle("");
    setDescription("");
    await loadQueries();
  };

  const handleDeleteQuery = async (id) => {
    const confirmDelete = window.confirm("Delete this query and all comments?");
    if (!confirmDelete) return;
    await deleteQueryAndComments(id);
    await loadQueries();
  };

  const handleMarkResolved = async (id) => {
    await updateQueryStatus(id, "resolved");
    await loadQueries();
  };

  const filteredQueries = queries.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );
    
  return (
    <div className="page">
      <div className="page-shell">
        <div className="page-header">
          <div>
            <p className="brand">Query Hub</p>
          </div>
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>

        <div className="dashboard-layout">
          <div className="dashboard-left">
            <div className="panel">
              <h3 className="panel-title">Find a query</h3>
              <p className="panel-subtitle">
                Search by title to quickly jump to the conversation you need.
              </p>
              <input
                placeholder="Search queries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input"
              />
            </div>

            {role === "student" && (
              <div className="panel">
                <h3 className="panel-title">Create a new query</h3>
                <p className="panel-subtitle">
                  Share a clear title and a concise description to get faster help.
                </p>
                <div className="form-stack">
                  <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                  />
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="textarea"
                  />
                  <button onClick={handleAdd} className="btn btn-primary auth-submit">
                    Add Query
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="panel">
            <div className="page-header">
              <h3 className="panel-title">Recent Queries</h3>
              <span className="pill">
                {filteredQueries.length} total
              </span>
            </div>

            <div className="query-grid">
              {filteredQueries.map((q) => (
                <div key={q.id} className="query-card">
                  <div className="page-header">
                    <Link to={`/query/${q.id}`} className="query-title">
                      {q.title}
                    </Link>
                    <span
                      className={`status-pill ${
                        q.status === "resolved"
                          ? "status-resolved"
                          : "status-open"
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <p className="query-text">{q.description}</p>
                  {q.userId === user?.id && (
                    <div className="card-actions">
                      {q.status !== "resolved" && (
                        <button
                          onClick={() => handleMarkResolved(q.id)}
                          className="btn"
                        >
                          Mark Resolved
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteQuery(q.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredQueries.length === 0 && (
              <div className="empty-state">
                No queries match your search yet. Try another title or add a new query.
              </div>
            )}
            {error && <div className="alert">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
