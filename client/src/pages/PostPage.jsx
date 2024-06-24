import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "../context/userContext";
import "../public/styles/PostPage.css";

const PostPage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts/${id}`);
        const data = await response.json();
        if (response.ok) {
          setPost(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newComment }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPost(data);
        setNewComment("");
        setError("");
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="post-page-wrapper">
      {error && <div className="error">{error}</div>}
      {post && (
        <div className="comment">
          <div>
            <div className="content">
              <div className="avatar">
                <img src={`http://localhost:3001${post.author.avatar}`} alt={post.author.username} />
              </div>
              <div className="content-comment">
                <div className="user">
                  <h5>
                    <Link to={`/user-profile/${post.author._id}`}>
                      {post.author.username}
                    </Link>
                  </h5>
                  <span className="is-mute">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{post.content}</p>
              </div>
            </div>
            <div className="footer"></div>
          </div>
          <div className="subcomment">
            <div className="other_comments">
              {post.comments.map((comment) => (
                <div className="com" key={comment._id}>
                  <div className="content">
                    <div className="avatar">
                      <img src={`http://localhost:3001${comment.author.avatar}`} alt={comment.author.username} />
                    </div>
                    <div className="content-comment">
                      <div className="user">
                        <h5>
                          <Link to={`/user-profile/${comment.author._id}`}>
                            {comment.author.username}
                          </Link>
                        </h5>
                        <span className="is-mute">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                  <div className="footer"></div>
                </div>
              ))}
              {user && (
                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit">Submit Comment</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
