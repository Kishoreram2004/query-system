import { useEffect, useState } from "react";
import { addQuery, getQueries, updateQueryStatus } from "../services/queryService";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, role } = useAuth();
  const [queries, setQueries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch queries
  useEffect(() => {
    const unsubscribe = getQueries(setQueries);
    return () => unsubscribe();
  }, []);

  // Add query
  const handleAdd = async () => {
    if (!title) return;

    await addQuery({
      title,
      description,
      userId: user.uid,
      status: "open",
      createdAt: new Date()
    });

    setTitle("");
    setDescription("");
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Create Query (only student) */}
      {role === "student" && (
        <div>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button onClick={handleAdd}>Add Query</button>
        </div>
      )}

      {/* Query List */}
      <div>
        {queries.map((q) => (
          <div key={q.id} style={{ border: "1px solid", margin: 10 }}>
            <Link to={`/query/${q.id}`}>
                <h3>{q.title}</h3>
            </Link>
            <p>{q.description}</p>
            <p>Status: {q.status}</p>

            {/* Only owner can update */}
            {q.userId === user?.uid && (
              <button onClick={() => updateQueryStatus(q.id, "resolved")}>
                Mark Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}