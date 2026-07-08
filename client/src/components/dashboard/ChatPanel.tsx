"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, Loader2, Paperclip, X, MessageSquare, Crown } from "lucide-react";
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
  isPremium?: boolean;
}

export default function ChatPanel({
  messages,
  loading,
  onSend,
  onUploadSuccess,
  tokensUsed = 0,
  tokensLimit = 5,
  userName,
  isPremium = false,
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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [onUploadSuccess]);

  const tokenPercent = Math.min((tokensUsed / tokensLimit) * 100, 100);
  const tokensRemaining = Math.max(tokensLimit - tokensUsed, 0);
  const isLimitReached = tokensUsed >= tokensLimit;
  const isLow = tokensRemaining <= 5 && tokensRemaining > 0;

  return (
    <section className="flex h-full flex-col border-r border-white/5 bg-[#09090b]">
      {/* Header */}
      <div className="shrink-0 border-b border-white/5 px-6 py-5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#00ff9c]/10 to-[#00cc7a]/5 border border-[#00ff9c]/20 shadow-inner">
              <Sparkles size={20} className="text-[#00ff9c]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight lg:text-base">
                AI Resume Assistant
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {userName ? `Building resume for ${userName}` : "Chat to build your resume"}
              </p>
            </div>
          </div>

          {/* Token Counter */}
          {!isPremium ? (
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5">
                <MessageSquare size={13} className={isLimitReached ? "text-red-400" : isLow ? "text-yellow-400" : "text-gray-400"} />
                <span className={`text-xs font-semibold tracking-wide uppercase ${isLimitReached ? "text-red-400" : isLow ? "text-yellow-400" : "text-gray-400"}`}>
                  {isLimitReached ? "Limit reached" : `${tokensRemaining} chats left`}
                </span>
              </div>
              <div className="w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isLimitReached ? "bg-red-500" : isLow ? "bg-yellow-400" : "bg-gradient-to-r from-[#00ff9c] to-[#00cc7a]"
                  }`}
                  style={{ width: `${tokenPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#00ff9c]/10 border border-[#00ff9c]/20 px-3 py-1.5 rounded-lg select-none">
              <Crown size={14} className="text-[#00ff9c] animate-pulse" />
              <span className="text-xs font-bold text-[#00ff9c] uppercase tracking-wider">
                Unlimited Chats
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00ff9c]/10 to-transparent border border-[#00ff9c]/10 shadow-lg">
              <Sparkles size={32} className="text-[#00ff9c]" />
            </div>
            <p className="text-lg font-bold text-white tracking-tight">Start building your resume</p>
            <p className="mt-2 text-sm text-gray-400 max-w-sm leading-relaxed">
              Introduce yourself to get started, or upload your current resume in PDF or TXT format using the clip icon.
            </p>
          </div>
        )}

        {messages.map((item, index) => (
          <div
            key={index}
            className={`flex items-start ${item.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {item.role === "assistant" && (
              <div className="mr-3.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00ff9c]/10 to-[#00cc7a]/5 border border-[#00ff9c]/10 shadow-sm">
                <Sparkles size={16} className="text-[#00ff9c]" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed shadow-sm ${
                item.role === "user"
                  ? "rounded-tr-sm bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] text-black font-semibold shadow-md shadow-[#00ff9c]/5"
                  : "rounded-tl-sm bg-[#18181b] text-gray-100 border border-white/5 whitespace-pre-wrap"
              }`}
            >
              {item.message}
            </div>
            {item.role === "user" && (
              <div className="ml-3.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] font-bold text-black text-xs shadow-md">
                {userName ? userName[0].toUpperCase() : "U"}
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-start justify-start">
            <div className="mr-3.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00ff9c]/10 to-[#00cc7a]/5 border border-[#00ff9c]/10 shadow-sm">
              <Sparkles size={16} className="text-[#00ff9c]" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-[#18181b] px-4 py-3.5 text-sm text-gray-100 border border-white/5">
              <div className="flex items-center gap-2.5">
                <Loader2 size={16} className="animate-spin text-[#00ff9c]" />
                <span className="text-gray-400 font-medium animate-pulse">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Upload loading */}
        {uploading && (
          <div className="flex items-start justify-start">
            <div className="mr-3.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00ff9c]/10 border border-[#00ff9c]/25">
              <Sparkles size={16} className="text-[#00ff9c]" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-[#18181b] px-4 py-3.5 text-sm text-gray-100 border border-white/5">
              <div className="flex items-center gap-2.5">
                <Loader2 size={16} className="animate-spin text-[#00ff9c]" />
                <span className="text-gray-400 font-medium">Extracting your resume data...</span>
              </div>
            </div>
          </div>
        )}

        {/* Upload error */}
        {uploadError && (
          <div className="flex items-start justify-start">
            <div className="mr-3.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30">
              <X size={16} className="text-red-400" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-red-500/5 px-4 py-3.5 text-sm text-red-300 border border-red-500/10">
              {uploadError}
            </div>
          </div>
        )}

        {/* Limit reached */}
        {isLimitReached && (
          <div className="mx-auto max-w-sm rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 text-center shadow-lg">
            <p className="text-sm font-bold text-yellow-300">Daily Chat Limit Reached</p>
            <p className="mt-1 text-xs text-yellow-400/70 leading-relaxed">
              Upgrade to Premium for unlimited chats, lightning-fast PDF compiles, and templates.
            </p>
            <a
              href="/dashboard/billing"
              className="mt-4 inline-block w-full rounded-xl bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] py-2.5 text-xs font-bold text-black hover:shadow-lg hover:shadow-[#00ff9c]/20 transition"
            >
              Upgrade Now
            </a>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Section */}
      <div className="shrink-0 border-t border-white/5 p-5 bg-[#09090b]">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex items-end gap-2.5 rounded-2xl border border-white/5 bg-[#18181b] p-3 transition focus-within:border-[#00ff9c]/40 focus-within:ring-1 focus-within:ring-[#00ff9c]/20">
          {/* Attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || loading}
            title="Upload existing resume (PDF or TXT)"
            className="flex-shrink-0 rounded-xl p-2.5 text-gray-400 hover:bg-white/5 hover:text-[#00ff9c] transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            {uploading ? <Loader2 size={18} className="animate-spin text-[#00ff9c]" /> : <Paperclip size={18} />}
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            disabled={isLimitReached}
            placeholder={isLimitReached ? "Please upgrade to continue..." : "Type your message here..."}
            className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-gray-500 disabled:cursor-not-allowed leading-relaxed"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim() || isLimitReached}
            className="flex-shrink-0 rounded-xl bg-[#00ff9c] p-3 text-black transition hover:scale-[1.03] hover:shadow-md hover:shadow-[#00ff9c]/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none font-semibold"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 px-1">
          <div className="flex items-center gap-1.5">
            <kbd className="rounded bg-white/5 px-1.5 py-0.5 border border-white/5 text-[10px] font-mono text-gray-400">Enter</kbd>
            <span>to send</span>
            <span className="text-gray-700 font-bold">·</span>
            <kbd className="rounded bg-white/5 px-1.5 py-0.5 border border-white/5 text-[10px] font-mono text-gray-400">Shift + Enter</kbd>
            <span>for new line</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📎 PDF or TXT files</span>
          </div>
        </div>
      </div>
    </section>
  );
}