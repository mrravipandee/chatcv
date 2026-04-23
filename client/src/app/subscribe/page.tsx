"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, PartyPopper, Rocket, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/api";

type SubmissionState = "idle" | "loading" | "success" | "error";

interface ErrorState {
  message: string;
  code?: string;
}

export default function ChatCVWaitlist() {
  const [email, setEmail] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorState({ message: "Please enter your email address" });
      return;
    }

    setSubmissionState("loading");
    setErrorState(null);

    try {
      const response = await subscribeToNewsletter(email);

      if (response.success) {
        setSubmissionState("success");
        setSuccessMessage(response.message);
        setEmail("");
        // Reset form after 5 seconds
        setTimeout(() => {
          setSubmissionState("idle");
          setSuccessMessage("");
        }, 5000);
      } else {
        setSubmissionState("error");
        setErrorState({
          message: response.message,
          code: response.code,
        });
      }
    } catch (error) {
      setSubmissionState("error");
      setErrorState({
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
      });
    }
  };

  const isLoading = submissionState === "loading";

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] text-white overflow-hidden p-6 play-font">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00ff9c]/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#c1ff23]/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center">
          <AnimatePresence mode="wait">
            {submissionState === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-8"
              >
                <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00ff9c] to-[#c1ff23] p-px">
                  <div className="w-full h-full bg-[#050505] rounded-[15px] flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#00ff9c]" />
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
                  You&apos;re on the list! 🎉
                </h2>

                <p className="text-zinc-400 text-lg mb-6 leading-relaxed">
                  {successMessage}
                </p>

                <p className="text-zinc-500 text-sm">
                  We&apos;ll send you updates when ChatCV launches. Stay tuned!
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Branding / Icon */}
                <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00ff9c] to-[#c1ff23] p-px">
                  <div className="w-full h-full bg-[#050505] rounded-[15px] flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                  Build Your Resume by Chatting
                </h1>

                <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                  Join early users and get access to ChatCV <br className="hidden md:block" /> when we launch.
                </p>

                {/* Error Message */}
                <AnimatePresence>
                  {errorState && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-800/50 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-red-200 text-sm font-medium">{errorState.message}</p>
                        {errorState.code === "RATE_LIMIT_EXCEEDED" && (
                          <p className="text-red-300/70 text-xs mt-1">
                            You can subscribe 5 times per 24 hours from this device.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <input
                      required
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorState(null);
                      }}
                      disabled={isLoading}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 outline-none transition-all duration-300 focus:border-[#00ff9c] focus:ring-1 focus:ring-[#00ff9c]/50 placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: isLoading ? 1 : 1.02, boxShadow: isLoading ? "none" : "0 0 25px rgba(0, 255, 156, 0.3)" }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl font-bold text-black bg-gradient-to-r from-[#00ff9c] to-[#c1ff23] transition-all duration-300 shadow-[0_0_15px_rgba(0,255,156,0.1)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        <span>Join Waitlist</span>
                        <Rocket className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="mt-6 text-zinc-500 text-sm">No spam. Only important updates.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Subtle Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-zinc-700 text-xs tracking-widest uppercase font-medium">
          Powered by ChatCV AI
        </p>
      </div>
    </main>
  );
}