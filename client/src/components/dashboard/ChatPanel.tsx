"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, Loader2, Paperclip, X, MessageSquare } from "lucide-react";
import { uploadResume } from "@/lib/api";

interface Message {
  role: string;
  message: string;
}

interface ChatPanelProps {
  messages: Message[];
  loading: boolean;
  onSend: (text: string) => void;
  onUploadSuccess?: (resumeId: string, resumeData: unknown) => void;
  tokensUsed?: number;
  tokensLimit?: number;
  userName?: string;
}

export default function ChatPanel({
  messages,
  loading,
  onSend,
  onUploadSuccess,
  tokensUsed = 0,
  tokensLimit = 5,
  userName,
}: ChatPanelProps) {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    // Auto-resize reset
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setUploadError("");
    setUploading(true);

    try {
      const res = await uploadResume(file, token);

      if (res.success && res.data) {
        onUploadSuccess?.(res.data.resumeId, res.data.resumeData);
      } else {
        const errRes = res as { message?: string };
        setUploadError(errRes.message || "Upload failed. Please try again.");
        setTimeout(() => setUploadError(""), 5000);
      }
    } catch {
      setUploadError("Upload failed. Please check your file and try again.");
      setTimeout(() => setUploadError(""), 5000);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [onUploadSuccess]);

  const tokenPercent = Math.min((tokensUsed / tokensLimit) * 100, 100);
  const tokensRemaining = Math.max(tokensLimit - tokensUsed, 0);
  const isLimitReached = tokensUsed >= tokensLimit;
  const isLow = tokensRemaining <= 5 && tokensRemaining > 0;

  return (
    <section className="flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-black via-black to-zinc-900">
      {/* Header */}
      <div className="shrink-0 border-b border-white/10 px-4 py-4 lg:px-6 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00ff9c]/10">
              <Sparkles size={18} className="text-[#00ff9c]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white lg:text-base">AI Resume Assistant</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {userName ? `Building resume for ${userName}` : "Chat to build your resume"}
              </p>
            </div>
          </div>

          {/* Token Counter */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <MessageSquare size={12} className={isLimitReached ? "text-red-400" : isLow ? "text-yellow-400" : "text-gray-400"} />
              <span className={`text-xs font-semibold ${isLimitReached ? "text-red-400" : isLow ? "text-yellow-400" : "text-gray-400"}`}>
                {isLimitReached ? "Limit reached" : `${tokensRemaining} chats left`}
              </span>
            </div>
            <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isLimitReached ? "bg-red-500" : isLow ? "bg-yellow-400" : "bg-[#00ff9c]"
                }`}
                style={{ width: `${tokenPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
        <div className="space-y-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00ff9c]/20 to-[#00ff9c]/5 border border-[#00ff9c]/20">
                <Sparkles size={28} className="text-[#00ff9c]" />
              </div>
              <p className="text-base font-medium text-white">Start building your resume</p>
              <p className="mt-2 text-sm text-gray-500 max-w-xs">
                Tell me your name to get started, or upload an existing resume using the 📎 button below.
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
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  item.role === "user"
                    ? "rounded-tr-sm bg-[#00ff9c] text-black shadow-lg shadow-[#00ff9c]/20 font-medium"
                    : "rounded-tl-sm bg-white/8 text-gray-100 border border-white/15 whitespace-pre-wrap"
                }`}
              >
                {item.message}
              </div>
              {item.role === "user" && (
                <div className="ml-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00ff9c] font-bold text-black text-xs">
                  {userName ? userName[0].toUpperCase() : "U"}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="mr-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ff9c]/20 to-[#00ff9c]/5 border border-[#00ff9c]/30">
                <Sparkles size={16} className="text-[#00ff9c]" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white/8 px-4 py-3 text-sm text-gray-100 border border-white/15">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-[#00ff9c]" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Upload loading */}
          {uploading && (
            <div className="flex justify-start">
              <div className="mr-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00ff9c]/10 border border-[#00ff9c]/30">
                <Sparkles size={16} className="text-[#00ff9c]" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white/8 px-4 py-3 text-sm text-gray-100 border border-white/15">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-[#00ff9c]" />
                  <span>Extracting your resume data...</span>
                </div>
              </div>
            </div>
          )}

          {/* Upload error */}
          {uploadError && (
            <div className="flex justify-start">
              <div className="mr-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30">
                <X size={16} className="text-red-400" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-red-500/10 px-4 py-3 text-sm text-red-300 border border-red-500/20">
                {uploadError}
              </div>
            </div>
          )}

          {/* Limit reached */}
          {isLimitReached && (
            <div className="mx-auto max-w-sm rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
              <p className="text-sm font-semibold text-yellow-300">Chat limit reached</p>
              <p className="mt-1 text-xs text-yellow-400/80">
                Upgrade to continue building your resume.
              </p>
              <a
                href="/dashboard/billing"
                className="mt-3 inline-block rounded-lg bg-[#00ff9c] px-4 py-1.5 text-xs font-bold text-black hover:bg-[#00cc7a] transition"
              >
                Upgrade Now
              </a>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-white/10 p-4 bg-black/50 backdrop-blur-sm">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors focus-within:border-[#00ff9c]/50 focus-within:bg-white/8">
          {/* Attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || loading}
            title="Upload existing resume (PDF or TXT)"
            className="flex-shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-white/10 hover:text-[#00ff9c] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            disabled={isLimitReached}
            placeholder={isLimitReached ? "Upgrade to continue chatting..." : "Type your message... (Enter to send)"}
            className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim() || isLimitReached}
            className="flex-shrink-0 rounded-lg bg-[#00ff9c] p-2.5 text-black transition hover:scale-105 hover:shadow-lg hover:shadow-[#00ff9c]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none font-semibold"
          >
            <Send size={17} />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-600 flex items-center gap-3">
          <span><span className="text-[#00ff9c] font-semibold">↵</span> to send · <span className="text-[#00ff9c] font-semibold">shift+↵</span> for new line</span>
          <span>·</span>
          <span className="text-gray-600"><span className="text-[#00ff9c]">📎</span> Upload PDF/TXT resume</span>
        </p>
      </div>
    </section>
  );
}