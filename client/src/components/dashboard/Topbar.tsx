"use client";

import { Bell } from "lucide-react";

interface TopbarProps {
  user: { name: string; plan: string };
}

export default function Topbar({ user }: TopbarProps) {
  const isPremium = user?.plan === "Premium Plan";

  return (
    <header className="h-16 border-b border-white/10 px-4 lg:px-6 flex items-center bg-black/40 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Resume Workspace</h2>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-white/10 transition">
            <Bell size={20} className="text-gray-400 hover:text-white" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-[#00ff9c] rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 transition">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ff9c] to-[#00cc7a] font-semibold text-black text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold ${
                    isPremium ? "text-[#00ff9c]" : "text-gray-400"
                  }`}
                >
                  {user?.plan || "Free Plan"}
                </span>
                {isPremium && (
                  <span className="text-xs bg-[#00ff9c]/20 text-[#00ff9c] px-2 py-0.5 rounded-full font-semibold">
                    ⭐
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}