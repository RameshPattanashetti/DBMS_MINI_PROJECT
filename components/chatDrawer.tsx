"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";

export default function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const aiReply = data.response || data.insights || "Query processed successfully.";
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          <Bot className="w-5 h-5" />
          <span>Banking Assistant</span>
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="w-80 h-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800 p-3 px-4 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Bot className="w-4 h-4 text-blue-400" />
              <span>Banking Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
            {messages.length === 0 && (
              <p className="text-slate-400 text-center mt-8">
                Hi! Ask me anything about your bank accounts or branch metrics.
              </p>
            )}
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg max-w-[85%] ${
                  m.role === "user"
                    ? "bg-blue-600 text-white ml-auto text-right"
                    : "bg-slate-800 text-slate-200 border border-slate-700"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-slate-800 text-slate-400 p-2 rounded-lg w-max text-xs animate-pulse">
                Thinking...
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}