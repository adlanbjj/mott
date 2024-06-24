import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from '../context/userContext';
import StarRating from "../components/Raiting/StarRating";
import "../public/styles/ProfilePage.css";

function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [showMessageField, setShowMessageField] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        console.log("UserID:", userId);
        try {
          const response = await fetch(
            `http://localhost:3001/auth/user/${userId}`,
            {
              credentials: "include",
            }
          );
          if (response.ok) {
            const data = await response.json();
            setProfileUser(data);
          } else {
            throw new Error("Failed to fetch user");
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setError("Failed to fetch user");
        }
      } else {
        console.error("UserID is undefined");
        setError("UserID is undefined");
      }
    };
    fetchUser();
  }, [userId]);

  const handleSendMessage = async () => {
    if (!message) {
      setMessageError("Message cannot be empty");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: message, recipient: userId }),
      });

      if (response.ok) {
        setMessageSuccess("Message sent successfully");
        setMessage("");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageError("Failed to send message");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profileUser) {
    return <div>Loading...</div>;
  }

  const isCurrentUserProfile = currentUser && currentUser._id === userId;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="left-card">
          <img
            src={`http://localhost:3001${profileUser.avatar}`}
            alt={`${profileUser.username}'s avatar`}
            className="profile-avatar"
          />
          <div className="profile-details">
            <div className="profile-contact">
              {!isCurrentUserProfile && (
                <>
                  <button
                    className="contact-button"
                    onClick={() => setShowMessageField(!showMessageField)}
                  >
                    Contact
                  </button>
                  <button className="resume-button">Resume</button>
                </>
              )}
              {isCurrentUserProfile && (
                <button className="resume-button">Resume</button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-info-section">
          <h1 className="profile-name">{profileUser.username}</h1>
          <StarRating likeCount={profileUser.likeCount} />
          <p>
            <strong>Posts:</strong> {profileUser.postCount}
          </p>
          <p>
            <strong>Likes:</strong> {profileUser.likeCount}
          </p>
          <p>
            <strong>Age:</strong> {profileUser.age}
          </p>
          <p>
            <strong>Location:</strong> {profileUser.location}
          </p>
          <p>
            <strong>Years experience:</strong> {profileUser.experience}
          </p>
        </div>
      </div>

      {showMessageField && (
        <div className="message-section">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here"
            className="message-textarea"
          ></textarea>
          <button onClick={handleSendMessage} className="message-button">
            Send
          </button>
          {messageError && <p className="error-message">{messageError}</p>}
          {messageSuccess && (
            <p className="success-message">{messageSuccess}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
