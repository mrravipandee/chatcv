"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  MessageSquare,
  Plus,
  Crown,
  Settings,
  CreditCard,
  Loader2,
  LogOut,
} from "lucide-react";

interface Resume {
  _id: string;
  title: string;
}

interface SidebarProps {
  user?: { name: string; plan: string };
  resumes?: Resume[];
  currentResumeId?: string;
  onCreateResume?: () => void;
  onSelectResume?: (resumeId: string) => void;
  isLoadingResumes?: boolean;
}

export default function Sidebar({
  user,
  resumes = [],
  currentResumeId,
  onCreateResume,
  onSelectResume,
  isLoadingResumes = false,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isPremium = user?.plan === "Premium Plan";

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleUpgrade = () => {
    router.push("/dashboard/billing");
  };

  return (
    <aside className="w-64 border-r border-white/10 bg-gradient-to-b from-zinc-950 to-black flex flex-col h-full">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-6">
        <Link href="/" className="block group">
          <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#00ff9c] transition">
            Chat<span className="text-[#00ff9c]">CV</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500 group-hover:text-gray-400 transition">
            AI Resume Builder
          </p>
        </Link>
      </div>

      {/* New Resume Button */}
      <div className="p-4">
        <button
          onClick={onCreateResume}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] px-4 py-3 font-semibold text-black transition hover:scale-105 hover:shadow-lg hover:shadow-[#00ff9c]/30 disabled:opacity-50 shadow-lg shadow-[#00ff9c]/20"
        >
          <Plus size={18} />
          New Resume
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
            pathname === "/dashboard"
              ? "bg-white/10 text-[#00ff9c]"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <FileText size={18} />
          My Resumes
        </Link>

        <Link
          href="/dashboard/chats"
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
            pathname === "/dashboard/chats"
              ? "bg-white/10 text-[#00ff9c]"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <MessageSquare size={18} />
          AI Chats
        </Link>

        {/* Recent Resumes Section */}
        {resumes.length > 0 && (
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="mb-3 px-2 text-xs font-semibold uppercase text-gray-600 tracking-wider">
              Recent Resumes
            </p>
            {isLoadingResumes ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={16} className="animate-spin text-[#00ff9c]" />
              </div>
            ) : (
              <div className="space-y-1">
                {resumes.slice(0, 5).map((resume) => (
                  <button
                    key={resume._id}
                    onClick={() => onSelectResume?.(resume._id)}
                    className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
                      currentResumeId === resume._id
                        ? "bg-[#00ff9c]/20 text-[#00ff9c] font-medium"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                    title={resume.title}
                  >
                    📄 {resume.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-4 border-t border-white/10 pt-4 space-y-1">
          <Link
            href="/dashboard/billing"
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
              pathname === "/dashboard/billing"
                ? "bg-white/10 text-[#00ff9c]"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <CreditCard size={18} />
            Billing
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
              pathname === "/dashboard/settings"
                ? "bg-white/10 text-[#00ff9c]"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </nav>

      {/* User Plan Card */}
      <div className="p-4">
        <div
          className={`rounded-lg border p-4 transition ${
            isPremium
              ? "border-[#00ff9c]/40 bg-[#00ff9c]/5"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isPremium ? "bg-[#00ff9c]/20" : "bg-white/10"
              }`}
            >
              <Crown size={18} className={isPremium ? "text-[#00ff9c]" : "text-gray-500"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{user?.name || "User"}</p>
              <p
                className={`text-xs font-medium ${
                  isPremium ? "text-[#00ff9c]" : "text-gray-500"
                }`}
              >
                {user?.plan || "Free Plan"}
              </p>
            </div>
          </div>
          {!isPremium && (
            <>
              <p className="mt-3 text-xs text-gray-400">Unlock unlimited AI chats, exports, and more.</p>
              <button
                onClick={handleUpgrade}
                className="mt-3 w-full rounded-lg bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] px-4 py-2 font-semibold text-black text-sm transition hover:shadow-lg hover:shadow-[#00ff9c]/30"
              >
                Upgrade Now
              </button>
            </>
          )}
          {isPremium && <p className="mt-3 text-xs text-gray-400">🎉 You have unlimited access to all features!</p>}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}