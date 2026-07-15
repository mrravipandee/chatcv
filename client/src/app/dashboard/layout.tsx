import type { Metadata } from "next";
import DashboardAuthGuard from "@/components/dashboard/DashboardAuthGuard";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <DashboardAuthGuard>{children}</DashboardAuthGuard>
    </main>
  );
}