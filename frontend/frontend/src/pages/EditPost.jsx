import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch post data
  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      const post = res.data;

      // Only allow author to edit
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      if (post.author._id !== userId) {
        alert("You are not authorized to edit this post");
        navigate(`/posts/${id}`);
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Post not found");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // Submit update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Title and content cannot be empty");

    try {
      await api.put(
        `/posts/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Edit Post</h2>
        <form onSubmit={handleUpdate} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              style={{ ...styles.input, resize: "vertical" }}
            />
          </div>

          <button type="submit" style={styles.button}>
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 70px)",
    background: "#f5f5f5",
    padding: "1rem",
  },
  card: {
    background: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  heading: {
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "0.5rem",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    padding: "0.6rem 0.8rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "0.7rem",
    borderRadius: "5px",
    border: "none",
    background: "#28a745",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};
