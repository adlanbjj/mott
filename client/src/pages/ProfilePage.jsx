import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../public/styles/ProfilePage.css';

function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState('');
  const [messageSuccess, setMessageSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        console.log("UserID:", userId);
        try {
          const response = await fetch(`http://localhost:3001/auth/user/${userId}`, {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            throw new Error('Failed to fetch user');
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          setError('Failed to fetch user');
        }
      } else {
        console.error('UserID is undefined');
        setError('UserID is undefined');
      }
    };
    fetchUser();
  }, [userId]);

  const handleSendMessage = async () => {
    if (!message) {
      setMessageError('Message cannot be empty');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: message, recipient: userId }),
      });

      if (response.ok) {
        setMessageSuccess('Message sent successfully');
        setMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessageError('Failed to send message');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-header">{user.username}'s Profile</h1>
      <p className="profile-info">Age: {user.age}</p>
      <p className="profile-info">Location: {user.location}</p>

      <div className="message-section">
        <h2 className="message-title">Send Message</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here"
          className="message-textarea"
        ></textarea>
        <button onClick={handleSendMessage} className="message-button">Send</button>
        {messageError && <p className="error-message">{messageError}</p>}
        {messageSuccess && <p className="success-message">{messageSuccess}</p>}
      </div>
    </div>
  );
}

export default ProfilePage;
