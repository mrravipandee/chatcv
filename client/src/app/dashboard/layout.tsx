"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await getCurrentUser(token);
      if (!res.success) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      setChecking(false);
    };

    validateSession();
  }, [router]);

  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* ✅ children always rendered — state is never destroyed */}
      {children}

      {/* ✅ Overlay spinner on top while checking, then disappears */}
      {checking && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#00ff9c] border-t-transparent" />
            <p className="text-sm text-gray-400">Checking session...</p>
          </div>
        </div>
      )}
    </main>
  );
}