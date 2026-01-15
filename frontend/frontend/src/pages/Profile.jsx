import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios"; // pastikan ini sudah ada dan mengatur baseURL + headers
import { Link } from "react-router-dom";

export default function Profile() {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchUserPosts = async () => {
      try {
        const res = await api.get("/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // filter post milik user
        const userPosts = res.data.filter(post => post.author === getUserIdFromToken(token));
        setPosts(userPosts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [token]);

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  if (!token) return <p>Please login to see your profile.</p>;

  if (loading) return <p>Loading your posts...</p>;

  return (
    <div>
      <h2>My Posts</h2>
      {posts.length === 0 ? (
        <p>You have no posts yet.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post._id}>
              <Link to={`/posts/${post._id}`}>{post.title}</Link>
              <button onClick={() => handleDelete(post._id)}>Delete</button>
              <Link to={`/posts/${post._id}/edit`}><button>Edit</button></Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
