// components/MessagesPage.js
import React, { useState, useEffect } from "react";

function MessagesPage({ recipient, onClose }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (recipient) {
      fetchConversation(recipient._id);
    }
  }, [recipient]);

  const fetchConversation = async (recipientId) => {
    const response = await fetch(`http://localhost:3001/messages/conversation/${recipientId}`, {
      method: "GET",
      credentials: 'include',
    });
    const data = await response.json();
    setMessages(data);
  };

  const sendMessage = async () => {
    const response = await fetch("http://localhost:3001/messages/send", {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, recipient: recipient._id }),
    });
    if (response.ok) {
      const newMessage = await response.json();
      setMessages([...messages, newMessage]);
      setContent("");
    }
  };

  return (
    <div>
      <h2>Messages with {recipient.username}</h2>
      <button onClick={onClose}>Close</button>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.content} - {new Date(msg.createdAt).toLocaleString()}</div>
        ))}
      </div>
      <input 
        type="text" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="Type a message..." 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default MessagesPage;
