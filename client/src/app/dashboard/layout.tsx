"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checking, setChecking] =
    useState(true);

  // Protect Route
  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setChecking(false);
  }, [router]);

  // Loading Screen
  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#00ff9c] border-t-transparent" />

          <p className="text-sm text-gray-400">
            Checking session...
          </p>
        </div>
      </main>
    );
  }

  // Protected Layout
  return (
    <main className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <section className="flex-1 overflow-hidden">
        {children}
      </section>
    </main>
  );
}