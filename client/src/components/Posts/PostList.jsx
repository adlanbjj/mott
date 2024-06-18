import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/userContext';
import './PostList.css';

const PostList = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/posts');
        const data = await response.json();
        if (response.ok) {
          setPosts(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('An error occurred. Please try again later.');
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
      const response = await fetch(`http://localhost:3001/posts/${editingPost}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setPosts(posts.map(post => (post._id === editingPost ? data : post)));
        setEditingPost(null);
        setError('');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId));
        setError('');
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  const truncateText = (text, wordLimit) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
                <button type="submit" className="edit-button">Update</button>
                <button type="button" onClick={() => setEditingPost(null)} className="edit-button cancel-button">Cancel</button>
              </form>
            ) : (
              <>
                <div className="post-header">
                  <h3>{post.title}</h3>
                  {user && post.author && user._id === post.author._id && (
                    <div>
                      <button onClick={() => handleEdit(post)} className="post-button">Edit</button>
                      <button onClick={() => handleDelete(post._id)} className="post-button delete-button">Delete</button>
                    </div>
                  )}
                </div>
                <p>{truncateText(post.content, 20)}</p>
                <Link to={`/posts/${post._id}`} className="read-more-link">Read more</Link>
                {post.author ? (
                  <p><strong>Author:</strong> {post.author.username}</p>
                ) : (
                  <p><strong>Author:</strong> Unknown</p>
                )}
                <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                <div className="postlist-comments-section">
                  <h4>Comments: {post.comments.length}</h4>
                  <Link to={`/posts/${post._id}`} className="comment-button">
                    Add Comment
                  </Link>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
