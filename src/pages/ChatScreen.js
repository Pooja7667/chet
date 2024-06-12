import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "../style/ChatScreen.css";

const socket = io("http://localhost:5000");

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const conversationId = "123"; // Example conversation ID

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/messages/${conversationId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    fetchMessages();

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [conversationId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        senderId: "me",
        recipientId: "2",
        timestamp: new Date(),
        content: newMessage,
        status: "sent",
        conversationId,
      };
      socket.emit("sendMessage", message);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-screen">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.senderId === "me" ? "sent" : "received"}`}
          >
            <p className="message-content">{msg.content}</p>
            <div className="message-info">
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              <span className={`status ${msg.status}`}>{msg.status}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatScreen;
