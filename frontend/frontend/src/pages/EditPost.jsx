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
    <div className="edit-post">
      <h2>Edit Post</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}
