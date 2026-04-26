"use client";

import { useEffect, useState } from "react";

import Topbar from "@/components/dashboard/Topbar";
import ChatPanel from "@/components/dashboard/ChatPanel";
import ResumePreview from "@/components/dashboard/ResumePreview";

import { getCurrentUser } from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState({
    name: "User",
    plan: "Free Plan",
  });

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      message:
        "👋 Hi, I’ll help build your resume. Tell me about yourself.",
    },
  ]);

  const [resumeData, setResumeData] = useState(null);
  const [resumeId, setResumeId] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Fetch Logged User
  // ==========================================
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await getCurrentUser(token);

      if (res.success) {
        const fullName =
          res.data?.name ||
          res.data?.email?.split("@")[0] ||
          "User";

        const plan =
          res.data?.membership === "premium"
            ? "Premium Plan"
            : "Free Plan";

        setUser({
          name: fullName,
          plan,
        });

        setMessages([
          {
            role: "assistant",
            message: `👋 Hi ${fullName}, I’ll help build your resume. Tell me about yourself.`,
          },
        ]);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Topbar user={user} />

      <div className="grid h-[calc(100vh-81px)] grid-cols-1 xl:grid-cols-2">
        <ChatPanel
        //   messages={messages}
        //   setMessages={setMessages}
        //   loading={loading}
        //   user={user}
        />

        <ResumePreview 
        // resumeData={resumeData} 
        />
      </div>
    </>
  );
}