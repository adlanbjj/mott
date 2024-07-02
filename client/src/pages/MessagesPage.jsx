import React, { useState, useEffect } from "react";
import "../public/styles/MessagesPage.css";

function MessagesPage({ onClose }) {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch(
        "https://mott-server-f5c8bc5b637d.herokuapp.com/messages/conversations",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      const data = await response.json();
      const sortedConversations = data.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      setConversations(sortedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchConversation = async (recipientId) => {
    try {
      const response = await fetch(
        `https://mott-server-f5c8bc5b637d.herokuapp.com/messages/conversation/${recipientId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch conversation");
      }
      const data = await response.json();
      setMessages(data.messages);
      setChatUser(data.user);
      setSelectedChat(recipientId);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  const sendMessage = async () => {
    if (!content || !selectedChat) return;
    try {
      const response = await fetch("https://mott-server-f5c8bc5b637d.herokuapp.com/messages/send", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, recipient: selectedChat }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      const newMessage = await response.json();
      setMessages([...messages, newMessage]);
      setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const truncateMessage = (message) => {
    return message.length > 10 ? message.substring(0, 10) + "..." : message;
  };

  return (
    <div className="messages-container">
      <div className="message-block">
        <div className="left-message-block">
          <div className="top">
            <input type="text" placeholder="Search" />
            <button className="search" aria-label="Search"></button>
          </div>
          <div className="people">
            {conversations.map((conv, index) => (
              <div
                key={index}
                className={`person ${
                  selectedChat === conv._id ? "active" : ""
                }`}
                data-chat={conv._id}
                onClick={() => fetchConversation(conv._id)}
              >
                <img
                  src={
                    `https://mott-server-f5c8bc5b637d.herokuapp.com${conv.avatar}` ||
                    "default-avatar.png"
                  }
                  alt="avatar"
                />
                <span className="name">{conv.username}</span>
                <span className="preview">{truncateMessage(conv.latestMessage)}</span>
                <span className="time">
                  {new Date(conv.lastMessageTime).toLocaleTimeString('fr-FR', {timeStyle: 'short'})}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="right-message-block">
          <div className="top">
            <span className="name">
              {chatUser?.username || "Select a chat"}
            </span>
          </div>
          <div className="chat-window">
            {selectedChat ? (
              <>
                <div className="chat active-chat" data-chat={selectedChat}>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`bubble ${
                        msg.sender === selectedChat ? "you" : "me"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>
                <div className="write">
                  <button className="write-link attach" aria-label="Attach file"></button>
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                  />
                  <button className="write-link smiley" aria-label="Insert smiley"></button>
                  <button
                    className="write-link send"
                    onClick={sendMessage}
                    aria-label="Send message"
                  ></button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
