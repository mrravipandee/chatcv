'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  type CurrentUser,
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
  education: [],
  achievements: [],
};

// ── Greeting message ──────────────────────────────────────────────────────────
const GREETING: Message = {
  role: 'assistant',
  message:
    "Hello! I'm ChatCV AI 👋\n\nI'll help you build an ATS-friendly LaTeX resume through conversation — no forms, just chat.\n\nTo get started, what's your full name?",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; plan: string; chatTokensUsed: number; chatTokensLimit: number }>({
    name: 'User',
    email: '',
    plan: 'Free Plan',
    chatTokensUsed: 0,
    chatTokensLimit: 5,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeId, setResumeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [selectingResume, setSelectingResume] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

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
    fetch(`${API_BASE}/health`).catch(() => {});
    const keepAlive = setInterval(() => {
      fetch(`${API_BASE}/health`).catch(() => {});
    }, 14 * 60 * 1000);
    return () => clearInterval(keepAlive);
  }, []);

  const saveMessages = useCallback((msgs: Message[], idOverride?: string) => {
    const id = idOverride ?? resumeIdRef.current;
    if (id) {
      localStorage.setItem(`messages_${id}`, JSON.stringify(msgs));
    } else {
      localStorage.setItem('messages_temp', JSON.stringify(msgs));
    }
    setMessages(msgs);
  }, []);

  const loadMessagesForResume = (id: string): Message[] | null => {
    const saved = localStorage.getItem(`messages_${id}`);
    return saved ? (JSON.parse(saved) as Message[]) : null;
  };

  const loadResumes = useCallback(async (token: string): Promise<Resume[]> => {
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
  }, []);

  // Initialize dashboard
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.replace('/login');
        return;
      }

      const userRes = await getCurrentUser(token);

      if (!userRes.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('resumeId');
        router.replace('/login');
        return;
      }

      const userData = userRes.data as CurrentUser;

      setUser({
        name: userData.name || 'User',
        email: userData.email || '',
        plan: userData.membership === 'premium' ? 'Premium Plan' : 'Free Plan',
        chatTokensUsed: userData.chatTokensUsed ?? 0,
        chatTokensLimit: userData.chatTokensLimit ?? 5,
      });

      const loadedResumes = await loadResumes(token);

      // Restore last used resume
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
                message: `📄 Welcome back${userData.name ? `, ${userData.name}` : ''}! Continuing your resume "${found.title}". What would you like to update?`,
              },
            ]
          );
          setAuthChecking(false);
          return;
        }
      }

      // Fresh start
      updateResumeId('');
      setResumeData(null);
      const tempMessages = localStorage.getItem('messages_temp');
      setMessages(tempMessages ? (JSON.parse(tempMessages) as Message[]) : [GREETING]);
      setAuthChecking(false);
    };

    init();
  }, [router, loadResumes]);

  // ── Handle resume upload success ─────────────────────────────────────────────
  // NOTE: useCallback MUST be declared here (before the early return) to obey Rules of Hooks
  const handleUploadSuccess = useCallback(
    async (newResumeId: string, newResumeData: unknown) => {
      const token = localStorage.getItem('token');
      if (!token) return;

      updateResumeId(newResumeId);
      setResumeData(newResumeData as ResumeData);

      const successMsg: Message = {
        role: 'assistant',
        message:
          "Great! I've extracted your resume data from the uploaded file 📄\n\nYour resume preview is now populated. What would you like to update or improve? I can help you:\n• Enhance your professional summary\n• Add more bullet points to your experience\n• Add missing sections\n• Make it more ATS-friendly",
      };

      saveMessages([successMsg], newResumeId);
      localStorage.removeItem('messages_temp');
      await loadResumes(token);
    },
    [loadResumes, saveMessages]
  );

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

  // ── Send chat message ────────────────────────────────────────────────────────
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
        const { reply, resumeId: newResumeId, resumeData: newResumeData, tokensUsed, tokensLimit } = res.data;
        const aiMessage: Message = { role: 'assistant', message: reply };

        // Update token counts
        setUser((prev) => ({ ...prev, chatTokensUsed: tokensUsed ?? prev.chatTokensUsed, chatTokensLimit: tokensLimit ?? prev.chatTokensLimit }));

        if (newResumeId && newResumeId !== resumeIdRef.current) {
          updateResumeId(newResumeId);
          const finalMessages = [...updatedMessages, aiMessage];
          saveMessages(finalMessages, newResumeId);
          localStorage.removeItem('messages_temp');
          await loadResumes(token);
        } else {
          saveMessages([...updatedMessages, aiMessage]);
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
        let errorMsg = apiErr.message || 'Something went wrong. Please try again.';

        // Handle token limit error
        if (typeof apiErr.message === 'string' && apiErr.message.startsWith('CHAT_LIMIT_REACHED')) {
          const limit = apiErr.message.split(':')[1];
          errorMsg = `You've used all ${limit} free chats. Please upgrade to continue building your resume! 🚀`;
          setUser((prev) => ({ ...prev, chatTokensUsed: prev.chatTokensLimit }));
        } else if (apiErr.code === 'TIMEOUT') {
          errorMsg = '⏳ Server is waking up. Please send your message again!';
        }

        saveMessages([...updatedMessages, { role: 'assistant', message: errorMsg }]);
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

  // handleUploadSuccess is now declared before the early return above (Rules of Hooks)

  // ── Create new resume ────────────────────────────────────────────────────────
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
          [{ role: 'assistant', message: '✨ New resume started! What\'s your full name?' }],
          res.data._id
        );
      }
    } catch (error) {
      console.error('Error creating resume', error);
    } finally {
      setLoadingResumes(false);
    }
  };

  // ── Select resume from sidebar ───────────────────────────────────────────────
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
      <div className="grid h-[calc(100vh-73px)] min-w-0 overflow-hidden grid-cols-1 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)]">
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
          <ChatPanel
            messages={messages}
            loading={loading}
            onSend={handleSendMessage}
            onUploadSuccess={handleUploadSuccess}
            tokensUsed={user.chatTokensUsed}
            tokensLimit={user.chatTokensLimit}
            userName={user.name !== 'User' ? user.name : undefined}
            isPremium={user.plan === 'Premium Plan'}
          />
        </div>
        <div className="min-w-0 overflow-hidden">
          <ResumePreview resumeData={resumeData} resumeId={resumeId} />
        </div>
      </div>
    </>
  );
}