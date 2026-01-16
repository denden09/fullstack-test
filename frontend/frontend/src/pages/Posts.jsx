import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    api.get("/posts").then((res) => setPosts(res.data));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Latest Posts</h1>

        <div style={styles.grid}>
          {posts.map((post) => (
            <div
              key={post._id}
              style={{
                ...styles.card,
                ...(hovered === post._id && styles.cardHover),
              }}
              onMouseEnter={() => setHovered(post._id)}
              onMouseLeave={() => setHovered(null)}
            >
              <h3 style={styles.title}>{post.title}</h3>

              <p style={styles.content}>
                {post.content.slice(0, 140)}...
              </p>

              <div style={styles.footer}>
                <span style={styles.meta}>
                  {post.author.name} ·{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>

                <Link to={`/posts/${post._id}`} style={styles.readMore}>
                  Read →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
  },
  heading: {
    textAlign: "center",
    marginBottom: "3rem",
    fontSize: "2.4rem",
    fontWeight: "700",
    color: "#222",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "2rem",
  },
  card: {
    background: "#fff",
    padding: "1.6rem",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.25s ease",
    cursor: "pointer",
  },
  cardHover: {
    transform: "translateY(-8px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
  },
  title: {
    fontSize: "1.3rem",
    marginBottom: "0.7rem",
    color: "#007bff",
  },
  content: {
    flexGrow: 1,
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    fontSize: "0.85rem",
    color: "#777",
  },
  readMore: {
    textDecoration: "none",
    fontWeight: "600",
    color: "#28a745",
    fontSize: "0.95rem",
  },
};
