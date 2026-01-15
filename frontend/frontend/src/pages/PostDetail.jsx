import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        setError("Failed to load post");
      }
    };
    fetchPost();
  }, [id]);

  // edit post
  const handleEdit = async () => {
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    try {
      await api.put(
        `/posts/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditMode(false);
      // reload post
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to edit post");
    }
  };

  // delete post
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (!post) return <p>Loading...</p>;

  const isAuthor = token && post.authorId === getUserIdFromToken(token);

  return (
    <div style={styles.container}>
      {error && <p style={styles.error}>{error}</p>}

      {editMode ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {isAuthor && (
            <div>
              <button onClick={() => setEditMode(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
          {/* Comments Section */}
          <CommentSection postId={id} />
        </>
      )}
    </div>
  );
}

// helper decode token (lightweight, only extract id)
function getUserIdFromToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch {
    return null;
  }
}

const styles = {
  container: { maxWidth: "600px", margin: "2rem auto" },
  error: { color: "red" },
};

export default PostDetail;
