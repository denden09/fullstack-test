import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH POST
  ========================= */
  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
      setLoading(false);
    } catch (err) {
      alert("Post not found");
      navigate("/");
    }
  };

  /* =========================
     FETCH COMMENTS (FIXED)
  ========================= */
  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/post/${id}`);
      setComments(res.data);
    } catch (err) {
      setError("Failed to load comments");
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  /* =========================
     ADD COMMENT (FIXED)
  ========================= */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post(
        `/comments/post/${id}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => [...prev, res.data]);
      setNewComment("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    }
  };

  /* =========================
     DELETE POST
  ========================= */
  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch {
      alert("Failed to delete post");
    }
  };

  /* =========================
     DELETE COMMENT
  ========================= */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      alert("Failed to delete comment");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const userId = token
    ? JSON.parse(atob(token.split(".")[1])).id
    : null;

  return (
    <div style={styles.container}>
      {/* POST CARD */}
      <div style={styles.card}>
        <h2>{post.title}</h2>
        <p style={styles.content}>{post.content}</p>
        <p style={styles.meta}>
          By <strong>{post.author.name}</strong> ·{" "}
          {new Date(post.createdAt).toLocaleString()}
        </p>

        {token && post.author._id === userId && (
          <div style={styles.actions}>
            <button onClick={() => navigate(`/edit/${post._id}`)}>Edit</button>
            <button style={styles.danger} onClick={handleDeletePost}>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* COMMENTS */}
      <div style={styles.comments}>
        <h3>Comments</h3>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {comments.map((c) => (
          <div key={c._id} style={styles.comment}>
            <p>{c.content}</p>
            <small>
              By <strong>{c.author?.name}</strong> ·{" "}
              {new Date(c.createdAt).toLocaleString()}
            </small>

            {token && c.author?._id === userId && (
              <button
                style={styles.deleteComment}
                onClick={() => handleDeleteComment(c._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}

        {token && (
          <form onSubmit={handleAddComment} style={styles.form}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button type="submit">Add Comment</button>
          </form>
        )}
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "1rem",
  },
  card: {
    background: "#041201",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  content: {
    marginTop: "1rem",
    lineHeight: 1.6,
  },
  meta: {
    fontSize: "0.85rem",
    color: "#666",
    marginTop: "0.5rem",
  },
  actions: {
    marginTop: "1rem",
    display: "flex",
    gap: "0.5rem",
  },
  danger: {
    background: "#dc3545",
    color: "white",
  },
  comments: {
    marginTop: "2rem",
    color: "#333",
  },
  comment: {
    background: "#041201",
    padding: "1rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    position: "relative",
  },
  deleteComment: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.3rem 0.6rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  form: {
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
};
