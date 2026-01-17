import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CreatePost() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [preview, setPreview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      return alert("Title and content are required");
    }

    try {
      await api.post(
        "/posts",
        { title, content, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/");
    } catch (err) {
      alert("Failed to create post");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create New Post</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Write in Markdown (## Heading, **bold**, - list)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            style={{ ...styles.input, resize: "vertical" }}
          />

          <label style={styles.previewToggle}>
            <input
              type="checkbox"
              checked={preview}
              onChange={() => setPreview(!preview)}
            />
            Live Markdown Preview
          </label>

          {preview && (
            <div style={styles.preview}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}

          <button type="submit" style={styles.button}>
            Create Post
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
    padding: "2rem",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
  },
  heading: { textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: {
    padding: "0.7rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    background: "#007bff",
    color: "#fff",
    padding: "0.7rem",
    border: "none",
    borderRadius: "6px",
  },
  previewToggle: {
    fontSize: "0.9rem",
    color: "#555",
  },
  preview: {
    border: "1px solid #ddd",
    padding: "1rem",
    borderRadius: "6px",
    background: "#fafafa",
  },
};
