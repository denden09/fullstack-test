import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Profile() {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchUserPosts = async () => {
      try {
        const res = await api.get("/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userPosts = res.data.filter(
          (post) => post.author._id === getUserIdFromToken(token)
        );
        setPosts(userPosts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  if (!token)
    return <p style={styles.center}>Please login to see your profile.</p>;
  if (loading)
    return <p style={styles.center}>Loading your posts...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Posts</h2>
      {posts.length === 0 ? (
        <p style={styles.center}>You have no posts yet.</p>
      ) : (
        <div style={styles.grid}>
          {posts.map((post) => (
            <div key={post._id} style={styles.card}>
              <h3 style={styles.title}>{post.title}</h3>
              <p style={styles.content}>{post.content.slice(0, 100)}...</p>
              <p style={styles.meta}>
                Created on {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div style={styles.actions}>
                <Link to={`/posts/${post._id}`} style={styles.button}>
                  View
                </Link>
                <Link
                  to={`/edit/${post._id}`}
                  style={{ ...styles.button, background: "#ffc107", color: "#333" }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  style={{ ...styles.button, background: "#dc3545" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
  center: {
    textAlign: "center",
    marginTop: "2rem",
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
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
    color: "#555",
  },
  meta: {
    fontSize: "0.8rem",
    color: "#777",
    marginBottom: "0.5rem",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  button: {
    flex: 1,
    textAlign: "center",
    padding: "0.5rem 0.6rem",
    borderRadius: "5px",
    color: "#fff",
    background: "#28a745",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  // Responsif
  "@media (max-width: 480px)": {
    actions: {
      flexDirection: "column",
    },
    button: {
      width: "100%",
    },
  },
};
