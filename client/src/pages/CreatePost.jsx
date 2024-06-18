import React, { useState } from 'react';
import '../public/styles/CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setTitle('');
        setContent('');
        onPostCreated(data);
        setError('');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.log(error)
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="post-create-container">
    <div className="post-header">
      <img src="https://via.placeholder.com/40" alt="User Avatar" className="avatar" />
      <div className="user-info">
        <span className="username">Ezra Aung</span>
        <span className="user-handle">@ezraaung</span>
      </div>
      <button className="close-button">&times;</button>
    </div>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="post-input"
      />
      <textarea
        className="post-textarea"
        placeholder="What's happening today?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="post-footer">
        <div className="post-options">
          <button type="button" className="option-button">
            <i className="fas fa-globe"></i> Anyone
          </button>
          <div className="icon-buttons">
            <button type="button"><i className="fas fa-camera"></i></button>
            <button type="button"><i className="fas fa-video"></i></button>
            <button type="button"><i className="fas fa-image"></i></button>
            <button type="button"><i className="fas fa-map-marker-alt"></i></button>
            <button type="button"><i className="fas fa-ellipsis-h"></i></button>
          </div>
        </div>
        <button type="submit" className="post-button">Post</button>
      </div>
    </form>
    {error && <div className="error">{error}</div>}
  </div>
  );
};

export default CreatePost;
