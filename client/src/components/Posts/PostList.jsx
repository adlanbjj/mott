import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faComment,
  faEdit,
  faTrashAlt,
  faShare,
  faPaperPlane,
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

  const apiUrl = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/posts`, {
          credentials: "include",
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
        `https://mott-server-f5c8bc5b637d.herokuapp.com/posts/${editingPost}`,
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
      const response = await fetch(`https://mott-server-f5c8bc5b637d.herokuapp.com/posts/${postId}`, {
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
        `https://mott-server-f5c8bc5b637d.herokuapp.com/posts/${postId}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPosts(posts.map((post) => (post._id === postId ? data : post)));
        setError("");
      } else {
        setError(data.error || "An error occurred. Please try again later.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await fetch(
        `https://mott-server-f5c8bc5b637d.herokuapp.com/posts/${postId}/dislike`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPosts(posts.map((post) => (post._id === postId ? data : post)));
        setError("");
      } else {
        setError(data.error || "An error occurred. Please try again later.");
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
        `https://mott-server-f5c8bc5b637d.herokuapp.com/posts/${postId}/comments`,
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
        setError("");
      } else {
        setError(data.error || "An error occurred. Please try again later.");
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
      {sortedPosts.map((post) =>
        post && post._id && post.author ? (
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
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="edit-button cancel-button"
                >
                  Yuxvala
                </button>
              </form>
            ) : (
              <div>
                <div className="post-header">
                  <figure className="avatar-wrapper">
                    <img
                      src={`https://mott-server-f5c8bc5b637d.herokuapp.com${post.author.avatar}`}
                      alt="img"
                      className="user-post-avatar"
                    />
                  </figure>
                  <div className="content">
                    <h3>{post.author.username}</h3>
                  </div>
                  <span className="updated">
                      {new Date(post.createdAt).toLocaleTimeString("fr-FR", {
                        timeStyle: "short",
                      })}
                    </span>
                  {user && (user._id === post.author._id || user.isAdmin) && (
                    <div className="post-controls">
                      <FontAwesomeIcon
                        icon={faTrashAlt}
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
                  <button
                    onClick={() => handleCommentToggle(post._id)}
                    className="btn btn-comment"
                  >
                    <FontAwesomeIcon icon={faComment} className="icon" /> Comments:{" "}
                    {post.comments.length}
                  </button>
                  <div className="btn-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post._id);
                      }}
                      className="btn btn-like"
                    >
                      <FontAwesomeIcon icon={faThumbsUp} className="icon" />{" "}
                      {post.likes ? post.likes.length : 0}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDislike(post._id);
                      }}
                      className="btn btn-dislike"
                    >
                      <FontAwesomeIcon icon={faThumbsDown} className="icon" />{" "}
                      {post.dislikes ? post.dislikes.length : 0}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Post shared!");
                      }}
                      className="btn btn-share"
                    >
                      <FontAwesomeIcon icon={faShare} className="icon" />
                    </button>
                  </div>
                </div>
                {showComments[post._id] && (
                  <section className="post-comment-feed">
                    {post.comments.map((comment) => (
                      <div className="comment" key={comment._id}>
                        <div className="avatar-wrapper">
                          <img
                            src={`https://mott-server-f5c8bc5b637d.herokuapp.com${comment.author.avatar}`}
                            alt="img"
                            className="avatar"
                          />
                          <span className="user">
                            <Link to={`/user-profile/${comment.author._id}`}>
                              {comment.author.username}
                            </Link>
                          </span>
                        </div>
                        <div className="content">
                          <span className="text">{comment.content}</span>
                        </div>
                      </div>
                    ))}
                    {user && (
                      <div className="add-comment">
                        <figure className="avatar-wrapper">
                          <img
                            src={`https://mott-server-f5c8bc5b637d.herokuapp.com${user.avatar}`}
                            alt="img"
                            className="avatar"
                          />
                        </figure>
                        <div className="textfield">
                          <form
                            onSubmit={(e) =>
                              handleCommentSubmit(e, post._id)
                            }
                          >
                            <input
                              type="text"
                              placeholder="Add a comment"
                              value={newComment}
                              onChange={(e) =>
                                setNewComment(e.target.value)
                              }
                              required
                            />
                            <button className="btn btn-camera">
                              <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}
          </div>
        ) : null
      )}
    </div>
  </div>
  
  
  );
};

export default PostList;
