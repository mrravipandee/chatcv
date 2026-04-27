"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import ChatPanel from "@/components/dashboard/ChatPanel";
import ResumePreview from "@/components/dashboard/ResumePreview";
import {
    getCurrentUser,
    sendChatMessage,
    getResumes,
    createResume,
    type Resume,
    type ResumeData,
} from "@/lib/api";

interface Message {
    role: "user" | "assistant";
    message: string;
}

function mergeResumeData(
  existing: ResumeData | null,
  update: Partial<ResumeData>
): ResumeData {
  const existingData = existing || {};

  // Normalize skills to always be string[]
  const normalizeSkills = (
    skills?: (string | { name: string })[]
  ): string[] =>
    (skills || []).map((s) => (typeof s === "string" ? s : s.name)).filter(Boolean);

  return {
    ...existingData,
    ...update,
    skills:
      update.skills && update.skills.length > 0
        ? normalizeSkills(update.skills)
        : normalizeSkills(existingData.skills),
    experience:
      update.experience && update.experience.length > 0
        ? update.experience
        : existingData.experience || [],
    projects:
      update.projects && update.projects.length > 0
        ? update.projects
        : existingData.projects || [],
  };
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState({ name: "User", plan: "Free Plan" });
    const [messages, setMessages] = useState<Message[]>([]);
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [resumeId, setResumeId] = useState("");
    const [loading, setLoading] = useState(false);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);
    const [selectingResume, setSelectingResume] = useState(false);

    // Helper to load messages for a specific resume
    const loadMessagesForResume = (id: string): Message[] | null => {
        const saved = localStorage.getItem(`messages_${id}`);
        return saved ? (JSON.parse(saved) as Message[]) : null;
    };

    // Helper to save messages for current resume
    const saveMessages = (msgs: Message[]) => {
        if (resumeId) {
            localStorage.setItem(`messages_${resumeId}`, JSON.stringify(msgs));
        } else {
            localStorage.setItem("messages_temp", JSON.stringify(msgs));
        }
        setMessages(msgs);
    };

    // Load resumes from API
    const loadResumes = async (token: string) => {
        setLoadingResumes(true);
        try {
            const res = await getResumes(token);
            if (res.success && res.data) {
                setResumes(res.data);
                return res.data;
            }
            return [];
        } catch (error) {
            console.error("Error loading resumes:", error);
            return [];
        } finally {
            setLoadingResumes(false);
        }
    };

    // Initialize dashboard
    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            // Get user info
            const userRes = await getCurrentUser(token);
            if (userRes.success && userRes.data) {
                setUser({
                    name: userRes.data.name || "User",
                    plan: userRes.data.membership === "premium" ? "Premium Plan" : "Free Plan",
                });
            }

            // Load all resumes
            const loadedResumes = await loadResumes(token);

            // Check if there's a selected resume in localStorage
            const savedResumeId = localStorage.getItem("resumeId");
            if (savedResumeId) {
                const found = loadedResumes.find((r) => r._id === savedResumeId);
                if (found) {
                    setResumeId(savedResumeId);
                    setResumeData(found.data);
                    const msgs = loadMessagesForResume(savedResumeId);
                    setMessages(
                        msgs || [
                            {
                                role: "assistant",
                                message: `📄 Welcome back to "${found.title}". What would you like to update?`,
                            },
                        ]
                    );
                    return;
                }
            }

            // No resume selected – start fresh
            localStorage.removeItem("resumeId");
            setResumeId("");
            setResumeData(null);
            const tempMessages = localStorage.getItem("messages_temp");
            if (tempMessages) {
                setMessages(JSON.parse(tempMessages));
            } else {
                setMessages([
                    {
                        role: "assistant",
                        message: `👋 Hi ${user.name}, tell me about yourself.`,
                    },
                ]);
            }
        };

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only once

    // Send chat message
    const handleSendMessage = async (text: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const userMessage: Message = { role: "user", message: text };
        const updatedMessages = [...messages, userMessage];
        saveMessages(updatedMessages);
        setLoading(true);

        try {
            const res = await sendChatMessage(
                { message: text, resumeId: resumeId || undefined },
                token
            );

            if (res.success && res.data) {
                const { reply, resumeId: newResumeId, resumeData: newResumeData } = res.data;

                // AI reply
                const aiMessage: Message = { role: "assistant", message: reply };
                const finalMessages = [...updatedMessages, aiMessage];
                saveMessages(finalMessages);

                // ✅ Merge resume data (preserve old fields, override only provided ones)
                if (newResumeData) {
                    setResumeData((prev) => {
                        const merged = mergeResumeData(prev, newResumeData);
                        localStorage.setItem("resumeData", JSON.stringify(merged));
                        return merged;
                    });
                }

                // Handle new resume ID (first message creates a resume)
                if (newResumeId && newResumeId !== resumeId) {
                    setResumeId(newResumeId);
                    localStorage.setItem("resumeId", newResumeId);
                    // Refresh resume list to include the new one
                    await loadResumes(token);
                    // Move temporary messages to the new resume ID
                    const temp = localStorage.getItem("messages_temp");
                    if (temp && newResumeId) {
                        localStorage.setItem(`messages_${newResumeId}`, temp);
                        localStorage.removeItem("messages_temp");
                    }
                }
            } else {
                const errorMsg: Message = {
                    role: "assistant",
                    message: res.success === false && (res as { code?: string }).code === "TIMEOUT"
                        ? "⏳ Server is waking up (cold start). Please send your message again in a moment!"
                        : "Sorry, something went wrong. Please try again.",
                };
                saveMessages([...updatedMessages, errorMsg]);
            }
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                role: "assistant",
                message: "Network error. Please check your connection.",
            };
            saveMessages([...updatedMessages, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    // Create new resume
    const handleCreateResume = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoadingResumes(true);
        try {
            const res = await createResume(token);
            if (res.success && res.data) {
                setResumes([res.data, ...resumes]);
                setResumeId(res.data._id);
                localStorage.setItem("resumeId", res.data._id);
                setResumeData(null);
                const freshMessages: Message[] = [
                    {
                        role: "assistant",
                        message: `✨ New resume created! Tell me what you'd like to add.`,
                    },
                ];
                saveMessages(freshMessages);
                localStorage.removeItem("resumeData");
                localStorage.removeItem(`messages_${res.data._id}`);
            }
        } catch (error) {
            console.error("Error creating resume:", error);
        } finally {
            setLoadingResumes(false);
        }
    };

    // Select existing resume
    const handleSelectResume = async (selectedId: string) => {
        if (selectingResume) return;
        setSelectingResume(true);

        const selected = resumes.find((r) => r._id === selectedId);
        if (selected) {
            setResumeId(selectedId);
            localStorage.setItem("resumeId", selectedId);
            setResumeData(selected.data);
            localStorage.setItem("resumeData", JSON.stringify(selected.data));

            const msgs = loadMessagesForResume(selectedId);
            setMessages(
                msgs || [
                    {
                        role: "assistant",
                        message: `📄 Resuming "${selected.title}". What would you like to edit?`,
                    },
                ]
            );
        }
        setSelectingResume(false);
    };

    return (
        <>
            <Topbar user={user} />
            <div className="grid h-[calc(100vh-73px)] min-w-0 overflow-hidden grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_minmax(0,1fr)]">
                <div className="hidden min-w-0 overflow-hidden lg:block">
                    <Sidebar
                        user={user}
                        resumes={resumes}
                        currentResumeId={resumeId}
                        onCreateResume={handleCreateResume}
                        onSelectResume={handleSelectResume}
                        isLoadingResumes={loadingResumes || selectingResume}
                    />
                </div>
                <div className="min-w-0 overflow-hidden">
                    <ChatPanel messages={messages} loading={loading} onSend={handleSendMessage} />
                </div>
                <div className="min-w-0 overflow-hidden">
                    <ResumePreview resumeData={resumeData} />
                </div>
            </div>
        </>
    );
}