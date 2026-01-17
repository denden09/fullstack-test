import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function CommentSection({ postId }) {
  const { token } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState("");

  /* =========================
     FETCH COMMENTS
  ========================= */
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/post/${postId}`);
        setComments(res.data);
      } catch (err) {
        setError("Failed to load comments");
      }
    };
    fetchComments();
  }, [postId]);

  /* =========================
     ADD COMMENT
  ========================= */
  const handleAdd = async () => {
    if (!newComment.trim()) {
      return setError("Comment cannot be empty");
    }

    try {
      const res = await api.post(
        `/comments/post/${postId}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([...comments, res.data]);
      setNewComment("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    }
  };

  /* =========================
     EDIT COMMENT
  ========================= */
  const startEdit = (comment) => {
    setEditCommentId(comment._id);
    setEditContent(comment.content);
  };

  const saveEdit = async () => {
    if (!editContent.trim()) {
      return setError("Comment cannot be empty");
    }

    try {
      const res = await api.put(
        `/comments/${editCommentId}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(
        comments.map((c) => (c._id === editCommentId ? res.data : c))
      );

      setEditCommentId(null);
      setEditContent("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to edit comment");
    }
  };

  /* =========================
     DELETE COMMENT
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await api.delete(`/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete comment");
    }
  };

  /* =========================
     HELPER: GET USER ID
  ========================= */
  const getUserIdFromToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };

  const userId = token ? getUserIdFromToken(token) : null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Comments</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {token && (
        <div style={{ marginBottom: "1rem" }}>
          <textarea
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            style={{ width: "100%" }}
          />
          <button onClick={handleAdd}>Post</button>
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {comments.map((c) => (
          <li key={c._id} style={{ marginBottom: "1rem" }}>
            {editCommentId === c._id ? (
              <>
                <textarea
                  rows="2"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditCommentId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>{c.author?.name}</strong>: {c.content}
                </p>

                {c.author?._id === userId && (
                  <div>
                    <button onClick={() => startEdit(c)}>Edit</button>
                    <button onClick={() => handleDelete(c._id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentSection;
