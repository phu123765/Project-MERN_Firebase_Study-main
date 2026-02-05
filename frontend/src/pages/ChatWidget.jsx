import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post("http://localhost:3000/openai", {
        prompt: input,
      });
      setMessages((prev) => [...prev, { from: "ai", text: res.data }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Có lỗi xảy ra khi gọi AI." },
      ]);
    }
    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Nút mở chat */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer text-2xl z-50 hover:bg-blue-700 transition"
      >
        💬
      </div>

      {/* Giao diện chat */}
      {open && (
        <div className="fixed bottom-20 right-4 w-80 max-w-full h-[500px] bg-white rounded-xl shadow-lg flex flex-col z-50 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">Trợ lý AI</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-xl hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  msg.from === "user"
                    ? "bg-blue-100 self-end ml-auto text-right"
                    : "bg-gray-200 self-start mr-auto text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Ô nhập và nút gửi */}
          <div className="items-center flex justify-center">
            <form
              onSubmit={handleSend}
              className="flex flex-col gap-2 p-2 border-t border-gray-200 bg-white w-full max-w-md"
            >
              <textarea
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className=" px-48 py-2 text-sm border rounded-lg outline-none"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
