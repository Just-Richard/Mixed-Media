import React, { useState } from "react";
import { getSimilarMedia } from "../ai/openrouter";
import "./Chatbot.css";

export const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Powered by OpenRouter AI"
  );

  const sendMessage = async () => {
    if (!input.trim()) return;

    setWelcomeMessage(null);

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const reply = await getSimilarMedia(input);

    setMessages([...newMessages, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <h2 className="chat-title">Ask for Recommendations</h2>
      <div className="chat-messages">
        {welcomeMessage && <div className="bot-message">{welcomeMessage}</div>}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            🤖 Open Router is thinking...
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask Away..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};
