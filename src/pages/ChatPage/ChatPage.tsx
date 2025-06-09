import React, { useState } from "react";
import { sendChatMessage } from "../../services/chatapiService";
import "./ChatPage.scss";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>(crypto.randomUUID());
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await sendChatMessage(sessionId, userMessage);
      setMessages((prev) => [...prev, { sender: "bot", text: response.response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Đã xảy ra lỗi khi gửi tin nhắn." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setSessionId(crypto.randomUUID());
    setMessages([{ sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }]);
  };

  return (
    <div className="chat-page">
      <div className="chat-page__left">
        <img
          src="https://img.freepik.com/premium-vektor/digital-chat-bot-robot-assistant-for-customer-support-concept-of-virtual-conversation-assistant-for-getting-help-vector-illustration-isolated-on-white-background_714605-1050.jpg"
          alt="AI Robot"
          className="chat-page__image"
        />
      </div>
      <div className="chat-page__right">
        <div className="chat-page__chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-page__message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="chat-page__message bot">Đang trả lời...</div>}
        </div>
        <div className="chat-page__input-container">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading}>Gửi</button>
          <button onClick={handleClearHistory} className="chat-page__clear-btn">
            Xóa lịch sử
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
