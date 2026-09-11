"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { subscribeToNewsletter } from "@/lib/api";
import { useAppStore } from "@/lib/store/useAppStore";
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";

type SubmissionState = "idle" | "loading" | "success" | "error";

interface ErrorState {
  message: string;
  code?: string;
}

export default function ChatCVWaitlist() {
  const { isWaitlistJoined, userEmail, setWaitlistJoined, addCredits } = useAppStore();
  const [email, setEmail] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>(
    isWaitlistJoined ? "success" : "idle"
  );
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [successMessage, setSuccessMessage] = useState(
    isWaitlistJoined ? `Spot confirmed for ${userEmail}!` : ""
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorState({ message: "Please enter a valid email address" });
      return;
    }

    setSubmissionState("loading");
    setErrorState(null);

    try {
      const response = await subscribeToNewsletter(email);

      if (response.success) {
        setSubmissionState("success");
        setSuccessMessage(response.message || "Your early access spot is reserved!");
        setWaitlistJoined(email);
        addCredits(10);
        setEmail("");
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
        message: error instanceof Error ? error.message : "An unexpected network error occurred",
        code: "UNKNOWN_ERROR",
      });
    }
  };

  const isLoading = submissionState === "loading";

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#030712] text-white overflow-hidden p-4 pt-32 pb-20">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-md">
        <Card className="border-zinc-800/80 bg-zinc-950/80 backdrop-blur-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
          
          {/* Shimmer line */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/50 to-transparent" />

          <AnimatePresence mode="wait">
            {submissionState === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-6"
              >
                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2">
                  You&apos;re on the VIP list!
                </h2>

                <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
                  {successMessage || "We've reserved your early access pass plus 10 free AI generation credits."}
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold mb-6">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+10 Free Credits Credited</span>
                </div>

                <div>
                  <button
                    onClick={() => setSubmissionState("idle")}
                    className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Submit another email
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-4 inline-block">
                  <Badge variant="glow" withDot>
                    Early Access Allocation
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight mb-2">
                  Build Your Resume <br />
                  <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    By Chatting
                  </span>
                </h1>

                <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
                  Join candidates preparing for 2026 hiring rounds. Get 10 free generation credits upon launch.
                </p>

                {errorState && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2 text-left">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-200 text-xs font-medium">{errorState.message}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 placeholder:text-zinc-600 disabled:opacity-50"
                  />

                  <Button
                    type="submit"
                    variant="glow"
                    size="lg"
                    className="w-full text-sm"
                    isLoading={isLoading}
                  >
                    Reserve Free Spot
                  </Button>
                </form>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Zero Spam Guarantee
                  </span>
                  <span>Free • No Card Needed</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </Card>
      </div>
    </main>
  );
}
