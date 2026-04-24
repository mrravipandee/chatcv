"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Rocket, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
// Ensure this path matches your project structure
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
        
        // Auto-reset after 5 seconds to allow for UX recovery
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
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] text-white overflow-hidden p-6 pt-36 pb-20 font-sans">
      
      {/* Dynamic Animated Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: isLoading ? [1, 1.05, 1] : [1, 1.2, 1],
            opacity: isLoading ? 0.4 : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: isLoading ? 2 : 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00ff9c]/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: isLoading ? [1.05, 1, 1.05] : [1.2, 1, 1.2],
            opacity: isLoading ? 0.3 : [0.2, 0.4, 0.2],
          }}
          transition={{ duration: isLoading ? 2 : 10, repeat: Infinity, ease: "easeInOut" }}
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
        <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
          
          {/* Subtle Inner Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00ff9c]/20 to-transparent" />

          <AnimatePresence mode="wait">
            {submissionState === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-6"
              >
                <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-[#00ff9c] to-[#c1ff23] p-px shadow-[0_0_30px_rgba(0,255,156,0.2)]">
                  <div className="w-full h-full bg-[#050505] rounded-[23px] flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-[#00ff9c]" />
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
                  You&apos;re on the list!
                </h2>

                <p className="text-zinc-400 text-lg mb-8 leading-relaxed max-w-xs mx-auto">
                  {successMessage || "We've reserved your spot in the future of career building."}
                </p>

                <button 
                  onClick={() => setSubmissionState("idle")}
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#00ff9c] transition-colors"
                >
                  <ArrowLeft size={14} /> Back to form
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="form" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
              >
                {/* Branding Icon */}
                <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-[#00ff9c] to-[#c1ff23] p-px">
                  <div className="w-full h-full bg-[#050505] rounded-[15px] flex items-center justify-center group">
                    <MessageSquare className="w-6 h-6 text-white group-hover:text-[#00ff9c] transition-colors" />
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent leading-tight">
                  Build Your Resume <br /> by Chatting
                </h1>

                <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                  Join early users and get exclusive access <br className="hidden md:block" /> to ChatCV when we launch.
                </p>

                {/* Error Logic */}
                <AnimatePresence>
                  {errorState && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-start gap-3 text-left">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-200 text-sm font-semibold">{errorState.message}</p>
                          {errorState.code === "RATE_LIMIT_EXCEEDED" && (
                            <p className="text-red-400/60 text-[11px] mt-1">
                              Security limit: 5 attempts per 24 hours.
                            </p>
                          )}
                        </div>
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
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-4 outline-none transition-all duration-300 focus:border-[#00ff9c] focus:ring-1 focus:ring-[#00ff9c]/50 placeholder:text-zinc-700 disabled:opacity-50"
                    />
                  </div>

                  <motion.button
                    whileHover={isLoading ? {} : { scale: 1.02, boxShadow: "0 0 30px rgba(0, 255, 156, 0.2)" }}
                    whileTap={isLoading ? {} : { scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl font-black text-black bg-linear-to-r from-[#00ff9c] to-[#c1ff23] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Reserving Spot...</span>
                      </>
                    ) : (
                      <>
                        <span>Join Waitlist</span>
                        <Rocket className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="mt-8 text-zinc-600 text-xs font-medium tracking-wide">
                  NO SPAM • EARLY BIRD ACCESS • ZERO STRESS
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 z-10">
        <div className="h-px w-12 bg-zinc-800 mb-2" />
        <p className="text-zinc-600 text-[10px] tracking-[0.2em] uppercase font-bold">
          Powered by ChatCV Engine
        </p>
      </div>
    </main>
  );
}