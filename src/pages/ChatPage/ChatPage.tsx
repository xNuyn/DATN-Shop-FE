import React, { useState, useEffect } from "react";
import { sendChatMessage } from "../../services/chatapiService";
import { fetchFilteredProducts, PaginatedResponse } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import ProductItem from "../../components/ProductItem";
import "./ChatPage.scss";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price_min: number;
  price_max: number;
  category: number;
  brands: number;
  sold_per_month: number;
  discount_percentage_max: number | null;
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>(crypto.randomUUID());
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Gọi API fetchFilteredProducts từ URL query params
  const fetchProducts = async (url: string) => {
    try {
      const params = new URLSearchParams(url.split("?")[1]);
      const categories = params.get("categories")?.split(",") || [];
      const brands = params.get("brands")?.split(",") || [];
      const priceRange = params.get("price") || "";
      const keyword = params.get("keyword") || "";
      const sort_by = params.get("sort_by") || "bestseller";
      // Giới hạn lần lấy 5 sản phẩm đầu
      const page = 1;
      const limit = 5;
      // Các tham số ẩn (hiddenFilters)
      const hiddenFilters: Record<string, string> = {};
      params.forEach((val, key) => {
        if (
          ![
            "categories",
            "brands",
            "price",
            "keyword",
            "type_search_keyword",
            "sort_by",
            "page",
            "limit",
          ].includes(key)
        ) {
          hiddenFilters[key] = val;
        }
      });

      const resp: PaginatedResponse = await fetchFilteredProducts(
        categories,
        brands,
        priceRange,
        keyword,
        sort_by,
        page,
        limit,
        hiddenFilters
      );
      setProducts(resp.data);
    } catch (err) {
      console.error("Lỗi khi fetchFilteredProducts:", err);
    }
  };

  // Khi có bot message chứa JUMPTO: thì tự động fetch
  useEffect(() => {
    const last = [...messages]
      .reverse()
      .find((m) => m.sender === "bot" && m.text.includes("JUMPTO:"));
    if (last) {
      const rawUrl = last.text.split("JUMPTO:")[1].trim();
      fetchProducts(rawUrl);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(sessionId, input);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Đã xảy ra lỗi khi gửi tin nhắn." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSessionId(crypto.randomUUID());
    setMessages([{ sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }]);
    setProducts([]);
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
        {/* Chat window */}
        <div className="chat-page__chat-window">
          {messages.map((msg, index) => {
            if (msg.sender === "bot" && msg.text.includes("JUMPTO:")) {
              const parts = msg.text.split("JUMPTO:");
              const beforeText = parts[0].trim();
              const rawUrl = parts[1].trim(); 
              const url = encodeURI(rawUrl);
              return (
                <div key={index} className="chat-page__message bot">
                  {beforeText && <div>{beforeText}</div>}
                  <button
                    onClick={() => navigate(url)}
                    className="chat-page__jump-btn"
                  >
                    👉 Đi tới liên kết
                  </button>
                </div>
              );
            }
            return (
              <div key={index} className={`chat-page__message ${msg.sender}`}>
                {msg.text}
              </div>
            );
          })}
          {loading && <div className="chat-page__message bot">Đang trả lời...</div>}
        </div>

        {/* Gợi ý 5 sản phẩm */}
        {products.length > 0 && (
          <div className="chat-page__product-list">
            <h4>Gợi ý sản phẩm:</h4>
            <div className="product-grid">
              {products.map((p) => (
                <ProductItem key={p.id} {...p} />
              ))}
            </div>
          </div>
        )}

        {/* Input + buttons */}
        <div className="chat-page__input-container">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading}>
            Gửi
          </button>
          <button onClick={handleClear} className="chat-page__clear-btn">
            Xóa lịch sử
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
