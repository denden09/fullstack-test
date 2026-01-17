import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Posts({ newPost }) { // optional prop: post baru dari PostForm
  const [posts, setPosts] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch posts dari backend
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/posts", {
        params: { search },
      });

      // ambil array posts dari backend
      const data = Array.isArray(res.data.posts) ? res.data.posts : [];
      setPosts(data);
    } catch (err) {
      console.error("Fetch posts error:", err);
      setPosts([]); // anti crash
    } finally {
      setLoading(false);
    }
  }, [search]);

  // fetch awal & tiap search berubah
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPosts();
    }, 400); // debounce search

    return () => clearTimeout(delay);
  }, [search, fetchPosts]);

  // update otomatis saat ada post baru
  useEffect(() => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
  }, [newPost]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Latest Posts</h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search posts by title or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

        {!loading && posts.length === 0 && (
          <p style={{ textAlign: "center" }}>No posts found</p>
        )}

        <div style={styles.grid}>
          {Array.isArray(posts) &&
            posts.map((post) => (
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
                  {post.content?.slice(0, 140)}...
                </p>

                <div style={styles.footer}>
                  <span style={styles.meta}>
                    {post.author?.name || "Unknown"} ·{" "}
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
  page: { width: "100%" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" },
  heading: { textAlign: "center", marginBottom: "2rem", fontSize: "2.4rem", fontWeight: "700", color: "#222" },
  search: {
    width: "100%",
    maxWidth: "500px",
    display: "block",
    margin: "0 auto 3rem",
    padding: "0.8rem 1rem",
    borderRadius: "999px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" },
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
  cardHover: { transform: "translateY(-8px)", boxShadow: "0 18px 40px rgba(0,0,0,0.15)" },
  title: { fontSize: "1.3rem", marginBottom: "0.7rem", color: "#007bff" },
  content: { flexGrow: 1, color: "#555", lineHeight: "1.6", marginBottom: "1.5rem" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  meta: { fontSize: "0.85rem", color: "#777" },
  readMore: { textDecoration: "none", fontWeight: "600", color: "#28a745", fontSize: "0.95rem" },
};
