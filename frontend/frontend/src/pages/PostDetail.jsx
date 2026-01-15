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

  // Fetch post detail
  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Post not found");
      navigate("/");
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await api.get(`/posts/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment) return alert("Comment cannot be empty");
    try {
      const res = await api.post(
        `/posts/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{post.title}</h2>
        <p style={styles.content}>{post.content}</p>
        <p style={styles.meta}>
          By <strong>{post.author.name}</strong> on{" "}
          {new Date(post.createdAt).toLocaleString()}
        </p>

        {token && post.author._id === userId && (
          <div style={styles.actionButtons}>
            <button style={styles.editBtn} onClick={() => navigate(`/edit/${post._id}`)}>
              Edit Post
            </button>
            <button style={styles.deleteBtn} onClick={handleDeletePost}>
              Delete Post
            </button>
          </div>
        )}
      </div>

      <div style={styles.commentsSection}>
        <h3>Comments</h3>
        {comments.map((c) => (
          <div key={c._id} style={styles.commentCard}>
            <p style={styles.commentContent}>{c.content}</p>
            <p style={styles.commentMeta}>
              By <strong>{c.user.name}</strong> on{" "}
              {new Date(c.createdAt).toLocaleString()}
            </p>
            {token && c.user._id === userId && (
              <button style={styles.deleteCommentBtn} onClick={() => handleDeleteComment(c._id)}>
                Delete
              </button>
            )}
          </div>
        ))}

        {token && (
          <form onSubmit={handleAddComment} style={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={styles.textarea}
            />
            <button type="submit" style={styles.submitBtn}>
              Add Comment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "1rem",
    maxWidth: "800px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  card: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
  },
  title: {
    marginBottom: "0.5rem",
    color: "#333",
  },
  content: {
    marginBottom: "0.5rem",
    lineHeight: "1.6",
  },
  meta: {
    fontSize: "0.85rem",
    color: "#777",
  },
  actionButtons: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  editBtn: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
  },
  commentsSection: {
    marginTop: "2rem",
  },
  commentCard: {
    background: "#f8f9fa",
    padding: "1rem",
    borderRadius: "5px",
    marginBottom: "1rem",
    position: "relative",
  },
  commentContent: {
    marginBottom: "0.5rem",
  },
  commentMeta: {
    fontSize: "0.75rem",
    color: "#555",
  },
  deleteCommentBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.3rem 0.6rem",
    borderRadius: "5px",
    cursor: "pointer",
  },
  commentForm: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  textarea: {
    padding: "0.7rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "vertical",
    minHeight: "80px",
    width: "100%",
    boxSizing: "border-box",
  },
  submitBtn: {
    padding: "0.7rem",
    borderRadius: "5px",
    border: "none",
    background: "#28a745",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },

  // Responsif
  "@media (max-width: 480px)": {
    card: {
      padding: "1rem",
    },
    actionButtons: {
      flexDirection: "column",
    },
    editBtn: {
      width: "100%",
    },
    deleteBtn: {
      width: "100%",
    },
  },
};
