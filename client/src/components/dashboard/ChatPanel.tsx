"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";

interface Message {
  role: string;
  message: string;
}

interface ChatPanelProps {
  messages: Message[];
  loading: boolean;
  onSend: (text: string) => void;
}

export default function ChatPanel({ messages, loading, onSend }: ChatPanelProps) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || loading) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <section className="flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-black via-black to-zinc-900">
      {/* Header */}
      <div className="shrink-0 border-b border-white/10 px-4 py-5 lg:px-6 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#00ff9c]/10">
            <Sparkles size={18} className="text-[#00ff9c]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white lg:text-base">AI Resume Assistant</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Tell me about your skills, projects and experience.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
        <div className="space-y-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center h-full">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00ff9c]/20 to-[#00ff9c]/5">
                <Sparkles size={28} className="text-[#00ff9c]" />
              </div>
              <p className="text-base font-medium text-white">Start building your resume</p>
              <p className="mt-2 text-sm text-gray-500 max-w-xs">
                Tell me your name, skills, experience, or projects and I&apos;ll help you create an amazing resume.
              </p>
            </div>
          )}

          {messages.map((item, index) => (
            <div
              key={index}
              className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {item.role === "assistant" && (
                <div className="mr-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ff9c]/20 to-[#00ff9c]/5 border border-[#00ff9c]/30">
                  <Sparkles size={16} className="text-[#00ff9c]" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed font-medium ${
                  item.role === "user"
                    ? "rounded-tr-sm bg-[#00ff9c] text-black shadow-lg shadow-[#00ff9c]/20"
                    : "rounded-tl-sm bg-white/10 text-gray-100 border border-white/20"
                }`}
              >
                {item.message}
              </div>
              {item.role === "user" && (
                <div className="ml-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00ff9c] font-semibold text-black text-xs">
                  U
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="mr-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ff9c]/20 to-[#00ff9c]/5 border border-[#00ff9c]/30">
                <Sparkles size={16} className="text-[#00ff9c]" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3 text-sm text-gray-100 border border-white/20">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-[#00ff9c]" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-white/10 p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex items-end gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors focus-within:border-[#00ff9c]/50 focus-within:bg-white/10">
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send)"
            className="max-h-40 min-h-11 flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="rounded-lg bg-[#00ff9c] p-3 text-black transition hover:scale-105 hover:shadow-lg hover:shadow-[#00ff9c]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none font-semibold"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          <span className="text-[#00ff9c] font-semibold">↵</span> to send ·{" "}
          <span className="text-[#00ff9c] font-semibold">shift+↵</span> for new line
        </p>
      </div>
    </section>
  );
}