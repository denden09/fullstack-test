import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 validation
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    try {
      await api.post(
        "/posts",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create New Post</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Post content"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  error: {
    color: "red",
  },
};

export default CreatePost;
