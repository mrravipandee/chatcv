"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import {
  getCurrentUser,
  getResumes,
  updateProfile,
  changePassword,
  type CurrentUser,
  type Resume,
} from "@/lib/api";
import {
  Loader2,
  User,
  Lock,
  CheckCircle,
  XCircle,
  Shield,
  CreditCard,
  MessageSquare,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  
  // ── Core Dashboard State ──────────────────────────────────────────────────────
  const [user, setUser] = useState<{
    name: string;
    email: string;
    plan: string;
    chatTokensUsed: number;
    chatTokensLimit: number;
  }>({
    name: "User",
    email: "",
    plan: "Free Plan",
    chatTokensUsed: 0,
    chatTokensLimit: 5,
  });
  
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // ── Form State ────────────────────────────────────────────────────────────────
  const [profileName, setProfileName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ── Initialization Hook ──────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      setLoadingResumes(true);
      try {
        const [userRes, resumesRes] = await Promise.all([
          getCurrentUser(token),
          getResumes(token),
        ]);

        if (!userRes.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("resumeId");
          router.replace("/login");
          return;
        }

        const userData = userRes.data as CurrentUser;
        setUser({
          name: userData.name || "User",
          email: userData.email || "",
          plan: userData.membership === "premium" ? "Premium Plan" : "Free Plan",
          chatTokensUsed: userData.chatTokensUsed ?? 0,
          chatTokensLimit: userData.chatTokensLimit ?? 5,
        });
        setProfileName(userData.name || "");

        if (resumesRes.success && resumesRes.data) {
          setResumes(resumesRes.data);
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
      } finally {
        setAuthChecking(false);
        setLoadingResumes(false);
      }
    };

    init();
  }, [router]);

  // ── Profile Submit Handler ───────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    if (!profileName.trim()) {
      setProfileError("Name cannot be empty");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    setSavingProfile(true);
    try {
      const res = await updateProfile(profileName.trim(), token);
      if (res.success && res.data) {
        setProfileSuccess("Profile name updated successfully!");
        setUser((prev) => ({
          ...prev,
          name: res.data!.name || profileName.trim(),
        }));
      } else {
        setProfileError(res.message || "Failed to update profile");
      }
    } catch (err: any) {
      setProfileError(err.message || "An unexpected error occurred");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Password Submit Handler ──────────────────────────────────────────────────
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!newPassword || newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    setSavingPassword(true);
    try {
      const res = await changePassword(
        {
          currentPassword,
          newPassword,
        },
        token
      );
      
      if (res.success) {
        setPasswordSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(res.message || "Failed to update password");
      }
    } catch (err: any) {
      setPasswordError(err.message || "An unexpected error occurred");
    } finally {
      setSavingPassword(false);
    }
  };

  if (authChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-[#00ff9c]" />
          <p className="text-sm text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  const isPremium = user.plan === "Premium Plan";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Topbar user={user} />
      <div className="grid h-[calc(100vh-64px)] min-w-0 overflow-hidden grid-cols-1 lg:grid-cols-[auto_1fr]">
        
        {/* Navigation Sidebar */}
        <div className="hidden min-w-0 overflow-hidden lg:block">
          <Sidebar
            user={user}
            resumes={resumes}
            isLoadingResumes={loadingResumes}
          />
        </div>

        {/* Settings Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#09090b] p-6 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                Account Settings
              </h2>
              <p className="text-gray-400 text-sm mt-1.5">
                Manage your profile information, password security, and view subscription details.
              </p>
            </div>

            {/* Grid Layout: Profile & Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Account Details / Stats Card */}
              <div className="md:col-span-1 space-y-6">
                
                {/* Profile Overview Card */}
                <div className="rounded-2xl border border-white/5 bg-white/5 p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00ff9c]/20 to-[#00cc7a]/5 border border-[#00ff9c]/30 text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/5 pt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Shield size={14} className="text-gray-400" /> Account Plan:
                      </span>
                      <span className={`font-bold ${isPremium ? "text-[#00ff9c]" : "text-gray-300"}`}>
                        {user.plan}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <MessageSquare size={14} /> AI Chat Usage:
                      </span>
                      <span className="font-semibold text-white">
                        {user.chatTokensUsed} / {user.chatTokensLimit} chats
                      </span>
                    </div>

                    {!isPremium && (
                      <button
                        onClick={() => router.push("/dashboard/billing")}
                        className="w-full mt-2 rounded-xl bg-white/5 border border-white/10 py-2 text-xs font-semibold text-white hover:bg-white/10 transition flex items-center justify-center gap-2"
                      >
                        <CreditCard size={14} /> Upgrade Plan
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable forms */}
              <div className="md:col-span-2 space-y-8">
                
                {/* Edit Profile Form */}
                <form
                  onSubmit={handleSaveProfile}
                  className="rounded-2xl border border-white/5 bg-white/5 p-6 space-y-4"
                >
                  <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                    <User size={18} className="text-[#00ff9c]" />
                    <h3 className="font-bold text-white text-md">Profile Information</h3>
                  </div>

                  {profileSuccess && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400">
                      <CheckCircle size={16} className="shrink-0" />
                      <span>{profileSuccess}</span>
                    </div>
                  )}

                  {profileError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                      <XCircle size={16} className="shrink-0" />
                      <span>{profileError}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Read-only Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                      />
                      <span className="text-[10px] text-gray-500">Email address cannot be changed.</span>
                    </div>

                    {/* Editable Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Enter your name"
                        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#00ff9c] focus:outline-none focus:ring-2 focus:ring-[#00ff9c]/10 transition-all placeholder-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="rounded-xl bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] px-5 py-2.5 font-bold text-black text-xs hover:shadow-lg hover:shadow-[#00ff9c]/10 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {savingProfile && <Loader2 size={14} className="animate-spin" />}
                      Save Profile Name
                    </button>
                  </div>
                </form>

                {/* Change Password Form */}
                <form
                  onSubmit={handleSavePassword}
                  className="rounded-2xl border border-white/5 bg-white/5 p-6 space-y-4"
                >
                  <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                    <Lock size={18} className="text-[#00ff9c]" />
                    <h3 className="font-bold text-white text-md">Account Security</h3>
                  </div>

                  {passwordSuccess && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400">
                      <CheckCircle size={16} className="shrink-0" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                      <XCircle size={16} className="shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Current Password */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#00ff9c] focus:outline-none focus:ring-2 focus:ring-[#00ff9c]/10 transition-all placeholder-gray-600"
                      />
                    </div>

                    {/* New Password */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#00ff9c] focus:outline-none focus:ring-2 focus:ring-[#00ff9c]/10 transition-all placeholder-gray-600"
                        required
                      />
                    </div>

                    {/* Confirm New Password */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#00ff9c] focus:outline-none focus:ring-2 focus:ring-[#00ff9c]/10 transition-all placeholder-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="rounded-xl bg-gradient-to-r from-[#00ff9c] to-[#00cc7a] px-5 py-2.5 font-bold text-black text-xs hover:shadow-lg hover:shadow-[#00ff9c]/10 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {savingPassword && <Loader2 size={14} className="animate-spin" />}
                      Update Password
                    </button>
                  </div>
                </form>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}