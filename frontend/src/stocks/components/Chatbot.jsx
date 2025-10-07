import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to get the current route
import axios from "axios";
import "./Chatbot.css";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you track your portfolio today?" },
  ]);

  const location = useLocation(); // Get the current route

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (message) => {
    setMessages((prev) => [...prev, { sender: "user", text: message }]);

    // Determine the API endpoint based on the current route
    const apiEndpoint =
      location.pathname === "/indian-stocks"
        ? "http://localhost:3001/api/chatboti"
        : "http://localhost:3001/api/chatbot";

    try {
      const response = await axios.post(apiEndpoint, { message });
      const botReply = response.data.reply;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't connect to the server." },
      ]);
    }
  };

  return (
    <div id="chatbot-root" className="chatbot-container">
      <div className={`chatbot ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header" onClick={toggleChat}>
          <span>Stock Tracker Assistant</span>
          <button className="close-btn">{isOpen ? "×" : "💬"}</button>
        </div>
        {isOpen && (
          <div className="chatbot-body">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <ChatMessage key={index} sender={msg.sender} text={msg.text} />
              ))}
            </div>
            <ChatInput onSend={sendMessage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
