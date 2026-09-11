"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, ArrowRight, ShieldCheck, RotateCcw } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { useAppStore } from "@/lib/store/useAppStore";

export const STORE_PLANS = [
  {
    id: "starter" as const,
    name: "Free Explorer",
    tagline: "Test your resume draft with zero risk",
    price: "$0",
    period: "forever",
    credits: 3,
    popular: false,
    features: [
      "3 AI Resume Generations",
      "Full ATS Keyword Scanner",
      "Standard PDF Download",
      "Google XYZ Bullet Generator",
    ],
  },
  {
    id: "pro" as const,
    name: "Career Accelerator",
    tagline: "For active job seekers targeting offers",
    price: "$19",
    period: "one-time",
    credits: 50,
    popular: true,
    features: [
      "50 AI Resume Generations & Rewrites",
      "Mathematical LaTeX Source Export",
      "Unlimited Job Description Keyword Scans",
      "Role-Specific Keyword Injection",
      "Cover Letter Tailoring Assistant",
    ],
  },
  {
    id: "lifetime" as const,
    name: "Executive Lifetime",
    tagline: "Unlimited career moves & updates",
    price: "$49",
    period: "lifetime",
    credits: 999,
    popular: false,
    features: [
      "Unlimited AI Generations & Updates",
      "All Premium LaTeX Themes Included",
      "AI LinkedIn Profile Optimizer",
      "Human ATS Audit Review Guarantee",
      "Early Access to Future AI Models",
    ],
  },
];

export function PricingStore() {
  const { userCredits, selectedPlan, setSelectedPlan, addCredits } = useAppStore();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSelectPlan = (plan: (typeof STORE_PLANS)[number]) => {
    setSelectedPlan(plan.id);
    if (plan.id === "starter") return;

    addCredits(plan.credits);
    setSuccessToast(`Unlocked ${plan.name}! ${plan.credits} credits added.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <section id="pricing" className="relative py-28 px-4 sm:px-6 bg-[#030712] text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-3">
            <Badge variant="glow" withDot>
              Pricing & Credit Store
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Pay once. No recurring subscription traps.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Choose what fits your job hunt timeline. Free credits included with every account.
          </p>

          {/* Current Cached Balance */}
          <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Your Balance:</span>
            <span className="font-bold text-emerald-400">{userCredits} Credits Available</span>
          </div>
        </div>

        {/* Success Feedback Toast */}
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 max-w-sm mx-auto p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center text-xs text-emerald-300 font-semibold"
          >
            🎉 {successToast}
          </motion.div>
        )}

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STORE_PLANS.map((plan) => {
            const isPopular = plan.popular;

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col justify-between ${
                  isPopular
                    ? "border-emerald-500/50 bg-zinc-900/80 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                    : "border-zinc-800/80 bg-zinc-900/40"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center justify-between mb-1">
                    <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                    <Badge variant="secondary" className="text-[11px]">
                      {plan.credits} Credits
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{plan.tagline}</CardDescription>

                  <div className="flex items-baseline gap-1 mt-5 pb-5 border-b border-zinc-800">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 mt-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardHeader>

                <CardFooter className="pt-0">
                  <Button
                    variant={isPopular ? "glow" : "outline"}
                    className="w-full text-xs"
                    onClick={() => handleSelectPlan(plan)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {plan.id === "starter" ? "Use Free Credits" : `Get ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Guarantees */}
        <div className="mt-14 pt-8 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-center text-xs text-zinc-400">
          <div className="flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>30-Day Unconditional Refund Policy</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Workday & Greenhouse ATS Guarantee</span>
          </div>
        </div>

      </div>
    </section>
  );
}
