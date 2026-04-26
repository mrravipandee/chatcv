"use client";

import { PanelLeft, Bell } from "lucide-react";

export default function Topbar({
  user,
}: {
  user: {
    name: string;
    plan: string;
  };
}) {
  return (
    <header className="border-b border-white/10 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Resume Workspace
          </h2>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00ff9c] font-semibold text-black">
            {user.name.charAt(0)}
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">
              {user.name}
            </p>

            <p className="text-xs text-gray-500">
              {user.plan}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}