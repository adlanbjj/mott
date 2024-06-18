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
    </div>
  );
};

export default WordDetails;
