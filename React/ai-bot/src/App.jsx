import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaMoon, FaSun } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/predict";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const chatRef = useRef(null);

  // ✅ Auto-scroll
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // ✅ Welcome message
  useEffect(() => {
    if (showChat && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ sender: "bot", text: "👋 Welcome! I’m your UI Fix Bot. Ask me any UI/UX related question." }]);
      }, 400);
    }
  }, [showChat]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userInput = input;
    setInput("");
    setTyping(true);

    try {
      const res = await axios.post(API_URL, { query: userInput });
      const botResponse = res.data.answer;

      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
        setTyping(false);
      }, 800);
    } catch (err) {
      console.error("❌ API Error:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Server error! Check backend URL." }]);
      setTyping(false);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-white via-blue-50 to-purple-100 text-gray-800"} min-h-screen w-full flex justify-center items-center relative overflow-hidden transition duration-500`}>
      
      {/* 🌙 Dark Mode Toggle */}
      <button onClick={() => setDarkMode(!darkMode)} className="absolute top-4 right-4 p-2 rounded-full z-50 shadow-md bg-white/50 backdrop-blur-lg hover:scale-110 transition">
        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
      </button>

      {/* 🔹 Welcome Screen */}
      {!showChat && (
        <div className="absolute inset-0 flex justify-center items-center backdrop-blur-lg">
          <div className={`${darkMode ? "bg-gray-800/60 border-gray-600" : "bg-white/60 border-gray-300"} backdrop-blur-2xl shadow-2xl border rounded-3xl p-10 text-center max-w-md animate-fadeIn`}>
            <h1 className="text-3xl font-bold mb-4">💬 UI Fix Bot</h1>
            <p className="mb-6">Ask me any UI/UX or HTML/CSS related questions. Click below to start chatting!</p>
            <button onClick={() => setShowChat(true)} className="px-6 py-2 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg transition transform hover:scale-105">
              🚀 Start Chat
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Chat UI */}
      {showChat && (
        <div className={`absolute inset-0 flex flex-col ${darkMode ? "bg-gray-800/70" : "bg-white/50"} backdrop-blur-2xl border border-gray-200 animate-slideUp`}>

          {/* Header */}
          <header className={`p-4 text-center text-xl font-bold border-b ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white/40 text-gray-800 border-gray-200"}`}>
            ✨ UI Fix ChatBot
          </header>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {messages.map((msg, i) => {
              const hasCode = msg.text.includes("```");
              const parts = msg.text.split(/```(.*?)```/gs);
              return (
                <div key={i} className={`p-3 max-w-[80%] rounded-2xl shadow-sm animate-fadeIn whitespace-pre-wrap ${msg.sender === "user" ? "bg-blue-400 text-white self-end ml-auto" : `${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`}`}>
                  {hasCode ? parts.map((part, idx) => idx % 2 === 1 ? <CodeBlock key={idx} code={part.trim()} /> : <p key={idx}>{part}</p>) : msg.text}
                </div>
              );
            })}
            {typing && <p className="italic text-gray-400 animate-pulse">🤖 Bot is typing...</p>}
          </div>

          {/* Input Field (Full Width) */}
          <div className={`p-3 flex justify-center border-t ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white/40"}`}>
            <div className="flex gap-2 w-full">
              <input type="text" className={`w-full border p-2 rounded-lg placeholder-gray-400 focus:outline-blue-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white/70 text-gray-800 border-gray-300"}`} placeholder="Ask something about UI fixes..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
              <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 rounded-lg flex items-center justify-center shadow-md transform hover:scale-105 transition" onClick={sendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Toaster */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

/* ✅ Code Block with react-hot-toast Copy */
function CodeBlock({ code }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success(" Code copied to clipboard!");
  };

  return (
    <div className="relative bg-gray-900 text-green-300 font-mono p-3 rounded-lg my-2 overflow-x-auto text-sm shadow-md">
      <button onClick={copyToClipboard} className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 text-xs rounded">
        📋 Copy
      </button>
      <pre className="whitespace-pre-wrap">{code}</pre>
    </div>
  );
}
