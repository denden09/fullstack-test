import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch post detail
  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Post not found");
      navigate("/");
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await api.get(`/posts/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment) return alert("Comment cannot be empty");
    try {
      const res = await api.post(
        `/posts/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="post-detail">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>
        By {post.author.name} on {new Date(post.createdAt).toLocaleString()}
      </p>

      {token && post.author._id === JSON.parse(atob(token.split(".")[1])).id && (
        <div>
          <button onClick={() => navigate(`/edit/${post._id}`)}>Edit Post</button>
          <button onClick={handleDeletePost}>Delete Post</button>
        </div>
      )}

      <hr />

      <h3>Comments</h3>
      {comments.map((c) => (
        <div key={c._id} style={{ borderBottom: "1px solid #ccc", marginBottom: "5px" }}>
          <p>{c.content}</p>
          <p>
            By {c.user.name} on {new Date(c.createdAt).toLocaleString()}
          </p>
          {token && c.user._id === JSON.parse(atob(token.split(".")[1])).id && (
            <button onClick={() => handleDeleteComment(c._id)}>Delete</button>
          )}
        </div>
      ))}

      {token && (
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit">Add Comment</button>
        </form>
      )}
    </div>
  );
}
