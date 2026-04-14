import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addComment,
  deleteComment,
  deleteQueryAndComments,
  getComments,
  getQueryById
} from "../services/queryService";
import { useAuth } from "../context/AuthContext";

export default function QueryDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [queryItem, setQueryItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  // Fetch query
  useEffect(() => {
    const unsubscribe = getQueryById(id, setQueryItem);
    return () => unsubscribe();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    const unsubscribe = getComments(id, setComments);
    return () => unsubscribe();
  }, [id]);

  // Add comment
  const handleAdd = async () => {
    if (!text) return;

    await addComment({
      queryId: id,
      userId: user.uid,
      text,
      createdAt: new Date()
    });

    setText("");
  };

  const handleDeleteQuery = async () => {
    const confirmDelete = window.confirm("Delete this query and all comments?");
    if (!confirmDelete) return;
    await deleteQueryAndComments(id);
    navigate("/");
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
  };

  return (
    <div className="page">
      <div className="page-shell">
        <div className="panel detail-header">
          <p className="brand">Query Detail</p>
          <div className="page-header">
            <h2 className="detail-title">
              {queryItem?.title || "Loading query..."}
            </h2>
            {queryItem?.userId === user?.uid && (
              <button onClick={handleDeleteQuery} className="btn btn-danger">
                Delete Query
              </button>
            )}
          </div>
          <p className="panel-subtitle">
            {queryItem?.description || "Fetching description..."}
          </p>
          {queryItem?.status && (
            <span
              className={`status-pill ${
                queryItem.status === "resolved"
                  ? "status-resolved"
                  : "status-open"
              }`}
            >
              {queryItem.status}
            </span>
          )}
        </div>

        <div className="detail-grid">
          <div className="panel">
            <h3 className="panel-title">Add a comment</h3>
            <p className="panel-subtitle">
              Share updates, ask for clarification, or mark next steps.
            </p>
            <div className="form-stack">
              <textarea
                placeholder="Write your comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                className="textarea"
              />
              <button onClick={handleAdd} className="btn btn-primary auth-submit">
                Post Comment
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="page-header">
              <h3 className="panel-title">Conversation</h3>
              <span className="pill">
                {comments.length} notes
              </span>
            </div>

            <div className="form-stack">
              {comments.map((c) => (
                <div key={c.id} className="comment-card">
                  <p className="comment-text">{c.text}</p>
                  {c.userId === user?.uid && (
                    <button onClick={() => handleDeleteComment(c.id)} className="btn btn-danger comment-delete">
                      Delete
                    </button>
                  )}
                </div>
              ))}
              {comments.length === 0 && (
                <div className="empty-state">
                  No comments yet. Be the first to leave an update.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}   
