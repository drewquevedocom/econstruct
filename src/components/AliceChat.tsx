"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING =
  "Hi, I'm Alice — eConstruct's AI concierge. I can answer questions about our services, fire rebuild process, or help you schedule a free consultation. How can I help?";

export default function AliceChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const reply = data.reply || data.error || "Sorry, something went wrong.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting. Please call us at (310) 740-9999 or try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B8963E] to-[#D4AF37] px-5 py-3.5 text-white shadow-[0_8px_32px_rgba(184,150,62,0.35)] transition-all hover:shadow-[0_12px_40px_rgba(184,150,62,0.5)] hover:scale-105 active:scale-95"
          aria-label="Chat with Alice"
        >
          <Sparkles size={18} />
          <span className="text-sm font-semibold hidden sm:inline">Ask Alice</span>
          <MessageCircle size={18} className="sm:hidden" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[100] flex flex-col w-full sm:w-[400px] h-[100dvh] sm:h-[560px] sm:rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-gray-200/60 sm:border overflow-hidden animate-alice-in">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#1C1C1E] to-[#2C2C2E] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B8963E] to-[#D4AF37] flex items-center justify-center text-white text-sm font-bold shadow-inner">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-tight">
                  Alice
                </h3>
                <p className="text-white/50 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  AI Concierge
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/60 hover:text-white"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#FAFAF8]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#B8963E] to-[#D4AF37] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 shadow-sm">
                    <Sparkles size={12} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1C1C1E] text-white rounded-br-md"
                      : "bg-white text-[#1C1C1E] border border-gray-100 shadow-sm rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#B8963E] to-[#D4AF37] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Sparkles size={12} />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-[#B8963E]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about our services..."
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-2.5 text-sm text-[#1C1C1E] placeholder:text-gray-400 outline-none focus:border-[#B8963E]/40 focus:ring-2 focus:ring-[#B8963E]/10 transition-all disabled:opacity-60"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-[#1C1C1E] text-white flex items-center justify-center transition-all hover:bg-[#B8963E] disabled:opacity-30 disabled:hover:bg-[#1C1C1E] active:scale-95"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Alice is an AI assistant. For urgent matters, call{" "}
              <a href="tel:310-740-9999" className="text-[#B8963E]">
                (310) 740-9999
              </a>
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes alice-slide-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-alice-in {
          animation: alice-slide-in 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
