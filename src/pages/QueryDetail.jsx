import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addComment, getComments } from "../services/queryService";
import { useAuth } from "../context/AuthContext";

export default function QueryDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

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

  return (
    <div>
      <h2>Comments</h2>

      {/* Add Comment */}
      <input
        placeholder="Write comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      {/* Show Comments */}
      <div>
        {comments.map((c) => (
          <div key={c.id} style={{ border: "1px solid", margin: 5 }}>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}   