import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../context/userContext';
import '../public/styles/PostPage.css';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

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
        setError('An error occurred. Please try again later.');
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setPost(data);
        setNewComment('');
        setError('');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="post-page-container">
      {error && <div className="error">{error}</div>}
      {post && (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {post.author ? (
            <>
              <p><strong>Author:</strong> <Link to={`/user-profile/${post.author._id}`}>{post.author.username}</Link></p>
              <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
            </>
          ) : (
            <p><strong>Author:</strong> Unknown</p>
          )}
          <div className="postpage-comments-section">
            <h4>Comments:</h4>
            {post.comments.map(comment => (
              <div key={comment._id} className="postpage-comment">
                <p>{comment.content}</p>
                {comment.author ? (
                  <>
                    <p><strong>Author:</strong> <Link to={`/user-profile/${comment.author._id}`}>{comment.author.username}</Link></p>
                  </>
                ) : (
                  <p><strong>Author:</strong> Unknown</p>
                )}
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
        </>
      )}
    </div>
  );
};

export default PostPage;
