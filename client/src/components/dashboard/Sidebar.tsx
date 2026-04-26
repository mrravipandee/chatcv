"use client";

import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Plus,
  Crown,
  Settings,
  CreditCard,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="hidden w-72 border-r border-white/10 bg-zinc-950 lg:flex lg:flex-col">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-6">
        <Link href="/" className="block">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Chat<span className="text-[#00ff9c]">CV</span>
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            AI Resume Builder
          </p>
        </Link>
      </div>

      {/* New Resume */}
      <div className="p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00ff9c] px-4 py-3 font-semibold text-black transition hover:scale-[1.02]">
          <Plus size={18} />
          New Resume
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-white"
        >
          <FileText size={18} />
          My Resumes
        </Link>

        <Link
          href="/dashboard/chats"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <MessageSquare size={18} />
          AI Chats
        </Link>

        <Link
          href="/dashboard/billing"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <CreditCard size={18} />
          Billing
        </Link>

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <Settings size={18} />
          Settings
        </Link>
      </nav>

      {/* Upgrade Card */}
      <div className="p-4">
        <div className="rounded-2xl border border-[#00ff9c]/20 bg-[#00ff9c]/5 p-4">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-[#00ff9c]" />

            <p className="font-semibold text-white">
              Free Plan
            </p>
          </div>

          <p className="mt-2 text-sm text-gray-400">
            Unlock unlimited AI chats, exports,
            and premium templates.
          </p>

          <button className="mt-4 w-full rounded-xl bg-[#00ff9c] px-4 py-2 font-semibold text-black transition hover:opacity-90">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}