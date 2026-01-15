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

  // fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/posts/${postId}/comments`);
        setComments(res.data);
      } catch (err) {
        setError("Failed to load comments");
      }
    };
    fetchComments();
  }, [postId]);

  // add comment
  const handleAdd = async () => {
    if (!newComment.trim()) return setError("Comment cannot be empty");

    try {
      const res = await api.post(
        `/posts/${postId}/comments`,
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

  // start edit comment
  const startEdit = (comment) => {
    setEditCommentId(comment._id);
    setEditContent(comment.content);
  };

  // save edited comment
  const saveEdit = async () => {
    if (!editContent.trim()) return setError("Comment cannot be empty");

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

  // delete comment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await api.delete(`/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete comment");
    }
  };

  // helper decode token
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
        <div>
          <textarea
            rows="2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAdd}>Post</button>
        </div>
      )}

      <ul>
        {comments.map((c) => (
          <li key={c._id}>
            {editCommentId === c._id ? (
              <>
                <textarea
                  rows="2"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditCommentId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{c.content}</p>
                {c.userId === userId && (
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
