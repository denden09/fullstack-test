import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts").then((res) => setPosts(res.data));
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>All Posts</h1>
      <div style={styles.grid}>
        {posts.map((post) => (
          <div key={post._id} style={styles.card}>
            <h3 style={styles.title}>{post.title}</h3>
            <p style={styles.content}>{post.content.slice(0, 120)}...</p>
            <p style={styles.meta}>
              By <strong>{post.author.name}</strong> on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <Link to={`/posts/${post._id}`} style={styles.readMore}>
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "1rem",
    boxSizing: "border-box",
  },
  heading: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    marginBottom: "0.5rem",
    color: "#007bff",
  },
  content: {
    flexGrow: 1,
    marginBottom: "1rem",
    lineHeight: "1.5",
    color: "#555",
  },
  meta: {
    fontSize: "0.8rem",
    color: "#777",
    marginBottom: "0.5rem",
  },
  readMore: {
    textDecoration: "none",
    background: "#28a745",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    textAlign: "center",
    transition: "background 0.3s",
  },
  readMoreHover: {
    background: "#218838",
  },
};
