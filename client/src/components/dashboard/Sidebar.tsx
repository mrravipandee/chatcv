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
import Image from "next/image";

interface Resume {
  _id: string;
  title: string;
}

interface SidebarProps {
  user?: {
    name: string;
    plan: string;
    email?: string;
    chatTokensUsed?: number;
    chatTokensLimit?: number;
  };
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

  const getFirstName = (fullName?: string, email?: string) => {
    if (fullName && fullName !== "User" && fullName.trim() !== "") {
      return fullName.trim().split(" ")[0];
    }
    if (email) {
      const prefix = email.split("@")[0];
      const namePart = prefix.split(/[._-]/)[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return "User";
  };
  const displayName = getFirstName(user?.name, user?.email);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleUpgrade = () => {
    router.push("/dashboard/billing");
  };

  return (
    <aside className="w-20 hover:w-64 transition-all duration-300 ease-in-out border-r border-white/5 bg-[#09090b] flex flex-col h-full group/sidebar z-30 overflow-hidden select-none">
      {/* Logo */}
      <div className="border-b border-white/5 h-20 flex items-center px-5 overflow-hidden shrink-0">
        <Link href="/" className="flex items-center gap-3 w-full">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff9c]/20 to-[#00cc7a]/5 border border-[#00ff9c]/30 shrink-0 shadow-lg shadow-[#00ff9c]/5">
            <Image src="/ChatResumeBuilder.svg" alt="logo" width={30} height={20} />
          </div>
          <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 flex flex-col justify-center min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">
              Chat<span className="text-[#00ff9c]">CV</span>
            </h1>
            <span className="text-[10px] text-gray-500 font-semibold mt-1 whitespace-nowrap">
              AI Resume Builder
            </span>
          </div>
        </Link>
      </div>

      {/* New Resume Button */}
      <div className="p-4 shrink-0 overflow-hidden">
        <button
          onClick={onCreateResume}
          className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] p-3 font-semibold text-black transition hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00ff9c]/10 disabled:opacity-50 w-full overflow-hidden"
        >
          <div className="flex items-center justify-center w-6 h-6 shrink-0">
            <Plus size={20} className="stroke-[2.5]" />
          </div>
          <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-extrabold text-xs tracking-wider uppercase whitespace-nowrap">
            New Resume
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
        <Link
          href="/dashboard"
          className={`flex items-center gap-4 rounded-xl p-3 text-sm font-medium transition-colors w-full overflow-hidden ${pathname === "/dashboard"
            ? "bg-white/5 text-[#00ff9c] border border-white/5"
            : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
        >
          <div className="flex items-center justify-center w-6 h-6 shrink-0">
            <FileText size={20} />
          </div>
          <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-semibold whitespace-nowrap">
            My Resumes
          </span>
        </Link>

        <Link
          href="/dashboard/chats"
          className={`flex items-center gap-4 rounded-xl p-3 text-sm font-medium transition-colors w-full overflow-hidden ${pathname === "/dashboard/chats"
            ? "bg-white/5 text-[#00ff9c] border border-white/5"
            : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
        >
          <div className="flex items-center justify-center w-6 h-6 shrink-0">
            <MessageSquare size={20} />
          </div>
          <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-semibold whitespace-nowrap">
            AI Chats
          </span>
        </Link>

        {/* Recent Resumes Section */}
        {resumes.length > 0 && (
          <div className="mt-5 border-t border-white/5 pt-5 overflow-hidden">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase text-gray-500 tracking-wider opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Recent Resumes
            </p>
            {isLoadingResumes ? (
              <div className="flex items-center justify-center py-4 w-full">
                <Loader2 size={18} className="animate-spin text-[#00ff9c]" />
              </div>
            ) : (
              <div className="space-y-1">
                {resumes.slice(0, 5).map((resume) => (
                  <button
                    key={resume._id}
                    onClick={() => onSelectResume?.(resume._id)}
                    className={`w-full rounded-xl p-3 text-left text-sm transition-colors flex items-center gap-4 overflow-hidden ${currentResumeId === resume._id
                      ? "bg-[#00ff9c]/10 text-[#00ff9c] font-semibold border border-[#00ff9c]/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                      }`}
                    title={resume.title}
                  >
                    <span className="shrink-0 text-lg w-6 h-6 flex items-center justify-center">
                      📄
                    </span>
                    <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 truncate whitespace-nowrap font-medium">
                      {resume.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-5 border-t border-white/5 pt-5 space-y-1 overflow-hidden">
          <Link
            href="/dashboard/billing"
            className={`flex items-center gap-4 rounded-xl p-3 text-sm font-medium transition-colors w-full overflow-hidden ${pathname === "/dashboard/billing"
              ? "bg-white/5 text-[#00ff9c] border border-white/5"
              : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
              }`}
          >
            <div className="flex items-center justify-center w-6 h-6 shrink-0">
              <CreditCard size={20} />
            </div>
            <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-semibold whitespace-nowrap">
              Billing
            </span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-4 rounded-xl p-3 text-sm font-medium transition-colors w-full overflow-hidden ${pathname === "/dashboard/settings"
              ? "bg-white/5 text-[#00ff9c] border border-white/5"
              : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
              }`}
          >
            <div className="flex items-center justify-center w-6 h-6 shrink-0">
              <Settings size={20} />
            </div>
            <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-semibold whitespace-nowrap">
              Settings
            </span>
          </Link>
        </div>
      </nav>

      {/* User Plan Card */}
      <div className="shrink-0 overflow-hidden max-h-0 opacity-0 group-hover/sidebar:max-h-56 group-hover/sidebar:opacity-100 group-hover/sidebar:p-4 transition-all duration-300">
        <div
          className={`rounded-xl border p-3.5 transition-all w-full overflow-hidden ${isPremium
            ? "border-[#00ff9c]/20 bg-[#00ff9c]/5"
            : "border-white/5 bg-white/5"
            }`}
        >
          <div className="flex items-center gap-4 w-full">
            <div
              className={`p-2 rounded-xl shrink-0 flex items-center justify-center w-10 h-10 ${isPremium ? "bg-[#00ff9c]/15" : "bg-white/5"
                }`}
            >
              <Crown size={20} className={isPremium ? "text-[#00ff9c]" : "text-gray-500"} />
            </div>
            <div className="flex-1 min-w-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
              <p className="font-bold text-white text-sm truncate">
                {displayName}
              </p>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${isPremium ? "text-[#00ff9c]" : "text-gray-500"
                  }`}
              >
                {user?.plan || "Free Plan"}
              </p>
            </div>
          </div>

          <div className="max-h-0 group-hover/sidebar:max-h-40 transition-all duration-300 overflow-hidden opacity-0 group-hover/sidebar:opacity-100">
            {!isPremium ? (
              (() => {
                const chatLimit = user?.chatTokensLimit ?? 5;
                const chatUsed = user?.chatTokensUsed ?? 0;
                const remainingChats = chatLimit - chatUsed;
                const showUpgrade = remainingChats < 5;

                return showUpgrade ? (
                  <>
                    <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                      Unlock unlimited AI chats and templates.
                    </p>
                    <button
                      onClick={handleUpgrade}
                      className="mt-3.5 w-full rounded-xl bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] py-2 font-bold text-black text-xs transition hover:shadow-lg hover:shadow-[#00ff9c]/20"
                    >
                      Upgrade Now
                    </button>
                  </>
                ) : (
                  <div className="mt-3.5 space-y-2">
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>Chats Used</span>
                      <span className="font-bold text-white">{chatUsed} / {chatLimit}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(100, (chatUsed / chatLimit) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {remainingChats} chats remaining
                    </p>
                  </div>
                );
              })()
            ) : (
              <p className="mt-3 text-xs text-[#00ff9c] font-medium flex items-center gap-1.5">
                <span>🎉</span> Unlimited Access
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/5 shrink-0 overflow-hidden">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 rounded-xl p-3 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full overflow-hidden"
        >
          <div className="flex items-center justify-center w-6 h-6 shrink-0">
            <LogOut size={20} />
          </div>
          <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-semibold whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}