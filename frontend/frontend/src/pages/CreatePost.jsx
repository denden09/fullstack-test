import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function CreatePost() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return setError("Title and content cannot be empty");
    }

    try {
      const res = await api.post(
        "/posts",
        { title, content, category },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // redirect to detail page of new post
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  if (!token) {
    return <p>Please login to create a post.</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Create New Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
        </div>

        <div>
          <label>Content:</label>
          <textarea
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content"
          />
        </div>

        <div>
          <label>Category (optional):</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
          />
        </div>

        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
