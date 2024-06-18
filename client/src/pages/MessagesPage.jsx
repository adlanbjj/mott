import React, { useState, useEffect } from "react";
import '../public/styles/MessagesPage.css';

function MessagesPage({ onClose }) {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch("http://localhost:3001/messages/conversations", {
        method: "GET",
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchConversation = async (recipientId) => {
    try {
      const response = await fetch(`http://localhost:3001/messages/conversation/${recipientId}`, {
        method: "GET",
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      const data = await response.json();
      setMessages(data);
      setSelectedChat(recipientId);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!content || !selectedChat) return;
    try {
      const response = await fetch("http://localhost:3001/messages/send", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, recipient: selectedChat }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const newMessage = await response.json();
      setMessages([...messages, newMessage]);
      setContent("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="messages-container">
      <div className="chat-list">
        {conversations.map((conv, index) => (
          <div key={index} className="chat-item" onClick={() => fetchConversation(conv._id)}>
            <img src={conv.avatar || 'default-avatar.png'} alt="avatar" className="avatar" />
            <span>{conv.username}</span>
          </div>
        ))}
      </div>
      <div className="chat-window">
        {selectedChat ? (
          <>
            <h2>Messages</h2>
            <button onClick={onClose}>Close</button>
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === selectedChat ? 'sent' : 'received'}`}>
                  <div>{msg.content}</div>
                  <small>{new Date(msg.createdAt).toLocaleString()}</small>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input 
                type="text" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Type a message..." 
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
