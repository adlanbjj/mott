import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/userContext';
import '../public/styles/Commented.css'

const CommentedWords = () => {
  const { user } = useUser();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommentedWords = async () => {
      setLoading(true); 
      try {
        const response = await fetch('http://localhost:3001/comments/commented', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setWords(data);
        } else {
          setError('Expected an array but got: ' + JSON.stringify(data));
        }
      } catch (error) {
        setError('Error fetching commented words: ' + error.message);
      }
      setLoading(false);
    };

    if (user && words.length === 0) {
      fetchCommentedWords();
    } else {
      setLoading(false);
    }
  }, [user]);

 
  if (!user) {
    return <div className="login-message">Please log in to view your commented words.</div>;
  }

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="commented-words-container">
    <h1 className="title">Words You Commented On</h1>
    <ul className="words-list">
      {words.map((word) => (
        <li key={word._id} className="word-item">
          <Link to={`/word/${word._id}`} className="word-link">
            <span className="word-latin">{word.latin}</span> - <span className="word-cyrillic">{word.cyrillic}</span> - <span className="word-translation">{word.translation}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default CommentedWords;
