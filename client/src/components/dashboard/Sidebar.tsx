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
    <aside className="w-20 hover:w-64 transition-all duration-300 ease-in-out border-r border-white/10 bg-gradient-to-b from-zinc-950 to-black flex flex-col h-full group/sidebar z-30 min-w-[5rem] hover:min-w-[16rem]">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-6 h-20 flex items-center overflow-hidden shrink-0">
        <Link href="/" className="block group flex items-center min-w-max gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#00ff9c] transition">
            C<span className="text-[#00ff9c] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">hatCV</span>
          </h1>
        </Link>
      </div>

      {/* New Resume Button */}
      <div className="p-4 overflow-hidden shrink-0">
        <button
          onClick={onCreateResume}
          className="flex w-full items-center justify-start gap-3 rounded-lg bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] p-3 font-semibold text-black transition hover:scale-105 hover:shadow-lg hover:shadow-[#00ff9c]/30 disabled:opacity-50 shadow-lg shadow-[#00ff9c]/20 min-w-max"
        >
          <Plus size={18} className="shrink-0" />
          <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-bold whitespace-nowrap">
            New Resume
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition min-w-max ${
            pathname === "/dashboard"
              ? "bg-white/10 text-[#00ff9c]"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <FileText size={18} className="shrink-0" />
          <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            My Resumes
          </span>
        </Link>

        <Link
          href="/dashboard/chats"
          className={`flex items-center gap-3 rounded-lg p-3 text-sm transition min-w-max ${
            pathname === "/dashboard/chats"
              ? "bg-white/10 text-[#00ff9c]"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <MessageSquare size={18} className="shrink-0" />
          <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            AI Chats
          </span>
        </Link>

        {/* Recent Resumes Section */}
        {resumes.length > 0 && (
          <div className="mt-4 border-t border-white/10 pt-4 overflow-hidden">
            <p className="mb-3 px-3 text-xs font-semibold uppercase text-gray-600 tracking-wider opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
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
                    className={`w-full truncate rounded-lg p-3 text-left text-sm transition flex items-center gap-3 min-w-max ${
                      currentResumeId === resume._id
                        ? "bg-[#00ff9c]/20 text-[#00ff9c] font-medium"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                    title={resume.title}
                  >
                    <span className="shrink-0">📄</span>
                    <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 truncate whitespace-nowrap">
                      {resume.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-4 border-t border-white/10 pt-4 space-y-1 overflow-hidden">
          <Link
            href="/dashboard/billing"
            className={`flex items-center gap-3 rounded-lg p-3 text-sm transition min-w-max ${
              pathname === "/dashboard/billing"
                ? "bg-white/10 text-[#00ff9c]"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <CreditCard size={18} className="shrink-0" />
            <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Billing
            </span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 rounded-lg p-3 text-sm transition min-w-max ${
              pathname === "/dashboard/settings"
                ? "bg-white/10 text-[#00ff9c]"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings size={18} className="shrink-0" />
            <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Settings
            </span>
          </Link>
        </div>
      </nav>

      {/* User Plan Card */}
      <div className="p-4 overflow-hidden shrink-0">
        <div
          className={`rounded-lg border p-4 transition min-w-max ${
            isPremium
              ? "border-[#00ff9c]/40 bg-[#00ff9c]/5"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg shrink-0 ${
                isPremium ? "bg-[#00ff9c]/20" : "bg-white/10"
              }`}
            >
              <Crown size={18} className={isPremium ? "text-[#00ff9c]" : "text-gray-500"} />
            </div>
            <div className="flex-1 min-w-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
              <p className="font-semibold text-white text-sm truncate">
                {user?.name || "User"}
              </p>
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
            <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
              <p className="mt-3 text-xs text-gray-400 max-w-[180px]">
                Unlock unlimited AI chats, exports, and more.
              </p>
              <button
                onClick={handleUpgrade}
                className="mt-3 w-full rounded-lg bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] px-4 py-2 font-semibold text-black text-sm transition hover:shadow-lg hover:shadow-[#00ff9c]/30"
              >
                Upgrade Now
              </button>
            </div>
          )}
          {isPremium && (
            <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
              <p className="mt-3 text-xs text-gray-400">
                🎉 You have unlimited access!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10 shrink-0 overflow-hidden">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-start gap-3 rounded-lg p-3 text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white transition min-w-max"
        >
          <LogOut size={16} className="shrink-0" />
          <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}