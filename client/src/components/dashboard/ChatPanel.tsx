// ==========================================
// 📄 Path: components/dashboard/ChatPanel.tsx
// ==========================================

"use client";

import { Send, Sparkles } from "lucide-react";

export default function ChatPanel() {
  return (
    <section className="flex h-full flex-col border-r border-white/10 bg-black">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#00ff9c]" />

          <h3 className="text-sm font-semibold text-white lg:text-base">
            AI Resume Assistant
          </h3>
        </div>

        <p className="mt-1 text-xs text-gray-500">
          Tell me about your skills, projects and experience.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 lg:px-6">
        {/* AI */}
        <div className="max-w-md rounded-2xl bg-white/5 p-4 text-sm text-gray-300">
          👋 Hi Ravi, I&apos;ll help build your resume.
          Start by telling me about yourself.
        </div>

        {/* User */}
        <div className="ml-auto max-w-md rounded-2xl bg-[#00ff9c] p-4 text-sm text-black">
          I am a backend developer skilled in Node.js,
          MongoDB and Redis.
        </div>

        {/* AI */}
        <div className="max-w-md rounded-2xl bg-white/5 p-4 text-sm text-gray-300">
          Great! I added your backend skills. Now tell me
          about your projects or experience.
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <textarea
            rows={1}
            placeholder="Type your message..."
            className="max-h-40 min-h-11 flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
          />

          <button className="rounded-xl bg-[#00ff9c] p-3 text-black transition hover:scale-105">
            <Send size={18} />
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          AI can help write ATS-friendly resume content.
        </p>
      </div>
    </section>
  );
}