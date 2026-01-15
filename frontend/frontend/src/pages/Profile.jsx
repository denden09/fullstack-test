import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await api.get("/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter only posts created by the logged-in user
        const userPosts = res.data.filter(
          (post) => post.author._id === api.userId
        );

        setPosts(userPosts);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
      }
    };

    if (token) fetchUserPosts();
  }, [token]);

  if (!token) {
    return <p>Please login to see your profile.</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Your Posts</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <Link to={`/posts/${post._id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
      <Link to="/create">
        <button>Create New Post</button>
      </Link>
    </div>
  );
}

export default Profile;
