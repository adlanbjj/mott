import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareAlt,
  faEnvelope,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { useUser } from "../context/userContext";
import Cookies from 'js-cookie';
import "../public/styles/Words.css";

const WordDetails = () => {
  const { wordId } = useParams();
  const { user } = useUser();
  const [word, setWord] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(`http://localhost:3001/words/${wordId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setWord(data);
      } catch (error) {
        console.error("Error fetching word:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/comments/${wordId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchWord();
    fetchComments();
  }, [wordId]);

  const handleAddComment = async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("http://localhost:3001/comments/add-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wordId, content: newComment }),
        credentials: 'include', 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add comment: ${errorData.message}`);
      }

      const data = await response.json();
      setComments([...comments, { ...data, userId: user }]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditComment = async (id) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`http://localhost:3001/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentContent }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to edit comment");
      }

      const updatedComment = await response.json();
      setComments(
        comments.map((comment) =>
          comment._id === id ? updatedComment : comment
        )
      );
      setEditingComment(null);
      setCommentContent("");
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`http://localhost:3001/comments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', 
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments(comments.filter((comment) => comment._id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const shareUrl = window.location.href;

  if (!word) {
    return <div>Loading...</div>;
  }

  return (
    <div className="words-container">
      <h1 className="word-title">{word.latin}</h1>
      <p className="word-text">
        <strong>Cyrillic:</strong> {word.cyrillic}
      </p>
      <p className="word-text">
        <strong>Translation:</strong> {word.translation}
      </p>
      <div className="share-buttons">
        <a
          href={`https://wa.me/?text=Check out this word: ${word.latin} - ${word.cyrillic} - ${word.translation} ${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button whatsapp"
        >
          <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
        </a>
        <a
          href={`mailto:?subject=Check out this word&body=Check out this word: ${word.latin} - ${word.cyrillic} - ${word.translation} ${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button gmail"
        >
          <FontAwesomeIcon icon={faEnvelope} /> Gmail
        </a>
        <a
          href={`https://t.me/share/url?url=${shareUrl}&text=Check out this word: ${word.latin} - ${word.cyrillic} - ${word.translation}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button telegram"
        >
          <FontAwesomeIcon icon={faTelegram} /> Telegram
        </a>
      </div>

      <div className="comments-section">
        <h2>Comments</h2>
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            {editingComment === comment._id ? (
              <div>
                <input
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <button onClick={() => handleEditComment(comment._id)}>
                  Save
                </button>
                <button onClick={() => setEditingComment(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>{comment.userId ? comment.userId.username : 'Unknown User'}:</strong> {comment.content}
                </p>
                {user && user._id === comment.userId._id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingComment(comment._id);
                        setCommentContent(comment.content);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button onClick={() => handleDeleteComment(comment._id)}>
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        {user ? (
          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        ) : (
          <div className="login-message">Please log in to add a comment.</div>
        )}
      </div>
    </div>
  );
};

export default WordDetails;
