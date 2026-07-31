"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";

export default function DashboardAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const didCheckSession = useRef(false);

  useEffect(() => {
    if (didCheckSession.current) return;
    didCheckSession.current = true;

    let cancelled = false;

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

      if (!cancelled) {
        setChecking(false);
      }
    };

    validateSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <>
      {checking ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#00ff9c] border-t-transparent" />
            <p className="text-sm text-gray-400">Checking session...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
}
