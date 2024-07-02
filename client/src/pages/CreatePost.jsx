import React, { useState } from 'react';
import '../public/styles/CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mott-server-f5c8bc5b637d.herokuapp.com/posts/create', {
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
      
        <button type="submit" className="post-button">Post</button>
      </div>
    </form>
    {error && <div className="error">{error}</div>}
  </div>
  );
};

export default CreatePost;
