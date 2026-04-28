'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import ChatPanel from '@/components/dashboard/ChatPanel';
import ResumePreview from '@/components/dashboard/ResumePreview';
import {
    getCurrentUser,
    sendChatMessage,
    getResumes,
    createResume,
    type Resume,
    type ResumeData,
} from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    message: string;
}

const EMPTY_RESUME: ResumeData = {
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    links: [],
};

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState({ name: 'User', plan: 'Free Plan' });
    const [messages, setMessages] = useState<Message[]>([]);
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [resumeId, setResumeId] = useState('');
    const [loading, setLoading] = useState(false);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);
    const [selectingResume, setSelectingResume] = useState(false);
    const [authChecking, setAuthChecking] = useState(true); // ← prevent flash redirects

    const resumeIdRef = useRef('');

    const updateResumeId = (id: string) => {
        setResumeId(id);
        resumeIdRef.current = id;
        if (id) localStorage.setItem('resumeId', id);
        else localStorage.removeItem('resumeId');
    };

    // Keep-alive ping
    useEffect(() => {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        fetch(`${API_BASE}/health`).catch(() => { });
        const keepAlive = setInterval(() => {
            fetch(`${API_BASE}/health`).catch(() => { });
        }, 14 * 60 * 1000);
        return () => clearInterval(keepAlive);
    }, []);

    const saveMessages = (msgs: Message[], idOverride?: string) => {
        const id = idOverride ?? resumeIdRef.current;
        if (id) {
            localStorage.setItem(`messages_${id}`, JSON.stringify(msgs));
        } else {
            localStorage.setItem('messages_temp', JSON.stringify(msgs));
        }
        setMessages(msgs);
    };

    const loadMessagesForResume = (id: string): Message[] | null => {
        const saved = localStorage.getItem(`messages_${id}`);
        return saved ? JSON.parse(saved) : null;
    };

    const loadResumes = async (token: string) => {
        setLoadingResumes(true);
        try {
            const res = await getResumes(token);
            if (res.success && res.data) {
                setResumes(res.data);
                return res.data;
            }
            return [];
        } catch {
            return [];
        } finally {
            setLoadingResumes(false);
        }
    };

    // Initialize dashboard with robust auth
    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('token');
            console.log('[Dashboard] Token found:', !!token);

            if (!token) {
                console.log('[Dashboard] No token, redirecting to login');
                router.replace('/login');
                return;
            }

            // Verify token with backend
            const userRes = await getCurrentUser(token);
            console.log('[Dashboard] getCurrentUser response:', userRes);

            if (!userRes.success) {
                console.error('[Dashboard] Auth failed:', userRes.message);
                localStorage.removeItem('token');
                localStorage.removeItem('resumeId');
                router.replace('/login');
                return;
            }

            // Token is valid
            setUser({
                name: userRes.data?.name || 'User',
                plan: userRes.data?.membership === 'premium' ? 'Premium Plan' : 'Free Plan',
            });

            // Load resumes
            const loadedResumes = await loadResumes(token);

            // Restore last used resume or start fresh
            const savedResumeId = localStorage.getItem('resumeId');
            if (savedResumeId) {
                const found = loadedResumes.find((r) => r._id === savedResumeId);
                if (found) {
                    updateResumeId(savedResumeId);
                    setResumeData(found.data);
                    const msgs = loadMessagesForResume(savedResumeId);
                    setMessages(
                        msgs || [
                            {
                                role: 'assistant',
                                message: `📄 Welcome back to "${found.title}". What would you like to update?`,
                            },
                        ]
                    );
                    setAuthChecking(false);
                    return;
                }
            }

            // No valid resume – start fresh
            updateResumeId('');
            setResumeData(null);
            const tempMessages = localStorage.getItem('messages_temp');
            setMessages(
                tempMessages
                    ? JSON.parse(tempMessages)
                    : [{ role: 'assistant', message: '👋 Hi, tell me about yourself to get started.' }]
            );
            setAuthChecking(false);
        };

        init();
    }, [router]);

    // Show a loading spinner while checking auth
    if (authChecking) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#00ff9c] border-t-transparent" />
                    <p className="text-sm text-gray-400">Authenticating...</p>
                </div>
            </div>
        );
    }

    // Send chat message
    const handleSendMessage = async (text: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const userMessage: Message = { role: 'user', message: text };
        const updatedMessages = [...messages, userMessage];
        saveMessages(updatedMessages);
        setLoading(true);

        try {
            const res = await sendChatMessage(
                { message: text, resumeId: resumeIdRef.current || undefined },
                token
            );

            if (res.success && res.data) {
                const { reply, resumeId: newResumeId, resumeData: newResumeData } = res.data;
                const aiMessage: Message = { role: 'assistant', message: reply };

                if (newResumeId && newResumeId !== resumeIdRef.current) {
                    updateResumeId(newResumeId);
                    const finalMessages = [...updatedMessages, aiMessage];
                    saveMessages(finalMessages, newResumeId);
                    localStorage.removeItem('messages_temp');
                    await loadResumes(token);
                } else {
                    const finalMessages = [...updatedMessages, aiMessage];
                    saveMessages(finalMessages);
                }

                if (newResumeData) {
                    setResumeData(newResumeData);
                    setResumes((prev) => {
                        const index = prev.findIndex((r) => r._id === newResumeId);
                        if (index !== -1) {
                            const updated = [...prev];
                            updated[index] = { ...updated[index], data: newResumeData };
                            return updated;
                        }
                        return prev;
                    });
                }
            } else {
                const apiErr = res as { code?: string; message?: string };
                const errorMsg: Message = {
                    role: 'assistant',
                    message:
                        apiErr.code === 'TIMEOUT'
                            ? '⏳ Server is waking up. Please send your message again!'
                            : apiErr.message || 'Something went wrong. Please try again.',
                };
                saveMessages([...updatedMessages, errorMsg]);
            }
        } catch (err) {
            console.error(err);
            saveMessages([
                ...updatedMessages,
                { role: 'assistant', message: 'Network error. Please check your connection.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateResume = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoadingResumes(true);
        try {
            const res = await createResume(token);
            if (res.success && res.data) {
                setResumes((prev) => [res.data!, ...prev]);
                updateResumeId(res.data._id);
                setResumeData(EMPTY_RESUME);
                saveMessages(
                    [{ role: 'assistant', message: '✨ New resume created! Tell me what you would like to add.' }],
                    res.data._id
                );
            }
        } catch (error) {
            console.error('Error creating resume', error);
        } finally {
            setLoadingResumes(false);
        }
    };

    const handleSelectResume = (selectedId: string) => {
        if (selectingResume) return;
        setSelectingResume(true);

        const selected = resumes.find((r) => r._id === selectedId);
        if (selected) {
            updateResumeId(selectedId);
            setResumeData(selected.data);
            const msgs = loadMessagesForResume(selectedId);
            setMessages(
                msgs || [
                    {
                        role: 'assistant',
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
                    <ResumePreview resumeData={resumeData} resumeId={resumeId} />
                </div>
            </div>
        </>
    );
}