import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faComment,
  faDeleteLeft,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import "./PostList.css";

const PostList = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/posts", {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setPosts(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (post) => {
    setEditingPost(post._id);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${editingPost}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPosts(posts.map((post) => (post._id === editingPost ? data : post)));
        setEditingPost(null);
        setError("");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
        setError("");
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        const { post: updatedPost, likeCount } = await response.json();
        setPosts(
          posts.map((post) => (post._id === postId ? updatedPost : post))
        );
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/dislike`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        const { post: updatedPost, likeCount } = await response.json();
        setPosts(
          posts.map((post) => (post._id === postId ? updatedPost : post))
        );
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleCommentToggle = (postId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/comments`,
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
        setPosts(posts.map((post) => (post._id === postId ? data : post)));
        setNewComment("");
        setShowComments((prevState) => ({
          ...prevState,
          [postId]: true,
        }));
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const truncateText = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="post-list-container">
      {error && <div className="error">{error}</div>}
      <div className="posts-wrapper">
        {sortedPosts.map((post) => (
          <div key={post._id} className="post">
            {editingPost === post._id ? (
              <form onSubmit={handleUpdate} className="edit-form">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="edit-input"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="edit-textarea"
                ></textarea>
                <button type="submit" className="edit-button">
                  Karl yaqa
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="edit-button cancel-button"
                >
                  Saciyta
                </button>
              </form>
            ) : (
              <div>
                <div className="post-header">
                  <div className="author-info">
                    <div className="author-details">
                          <img
                      src={`http://localhost:3001${post.author.avatar}`}
                      alt='img'
                      className="user-post-avatar"
                    />
                      <span className="author-name">
                        <Link to={`/user-profile/${post.author._id}`}>
                          {post.author.username}
                        </Link>{" "}
                      </span>
                      <span className="post-time">
                        {new Date(post.createdAt).toLocaleTimeString('fr-FR', { timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                  {user && (user._id === post.author._id || user.isAdmin) && (
                    <div className="post-controls">
                      <FontAwesomeIcon
                        icon={faDeleteLeft}
                        onClick={() => handleDelete(post._id)}
                        className="control-icon delete-icon"
                      />
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => handleEdit(post)}
                        className="control-icon edit-icon"
                      />
                    </div>
                  )}
                </div>
                <p className="post-title">{truncateText(post.title, 20)}</p>
                <p className="post-content">{truncateText(post.content, 20)}</p>
                <div className="post-actions">
                  <div className="left-actions">
                    <button
                      onClick={() => handleCommentToggle(post._id)}
                      className="comment-button"
                    >
                      <FontAwesomeIcon icon={faComment} />{" "}
                      {post.comments.length}
                      <p>Comments</p>
                    </button>
                  </div>
                  <div className="like-systeme-block">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post._id);
                      }}
                      className="like-button"
                    >
                      <FontAwesomeIcon icon={faThumbsUp} className="icon" />{" "}
                      {post.likes ? post.likes.length : 0}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDislike(post._id);
                      }}
                      className="dislike-button"
                    >
                      <FontAwesomeIcon icon={faThumbsDown} className="icon" />{" "}
                      {post.dislikes ? post.dislikes.length : 0}
                    </button>
                  </div>
                </div>
                {showComments[post._id] && (
                  <div className="comments-section">
                    {post.comments.map((comment) => (
                      <div className="comment" key={comment._id}>
                        <div className="comment-content">
                          <div className="comment-author">
                            <Link to={`/user-profile/${comment.author._id}`}>
                              {comment.author.username}
                            </Link>
                          </div>
                          <div className="comment-text">{comment.content}</div>
                        </div>
                      </div>
                    ))}
                    {user && (
                      <form
                        onSubmit={(e) => handleCommentSubmit(e, post._id)}
                      >
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
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
