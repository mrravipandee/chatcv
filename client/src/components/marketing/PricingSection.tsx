"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function PricingSection() {
  const freeFeatures = [
    "5 free AI chat iterations included",
    "Real-time LaTeX document compilation",
    "High-resolution vector PDF export",
    "Raw .tex source code download",
    "Existing resume import (PDF & TXT)",
    "Standard ATS-compliant single-column layout",
  ];

  const paidFeatures = [
    "Flexible chat message top-up packs",
    "Unlimited resume revisions & tweaks",
    "Multiple tailored resume profiles",
    "Prioritized compilation queue",
    "Secure checkout powered by Dodo Payments",
    "No recurring subscription traps or auto-renewals",
  ];

  return (
    <section id="pricing" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#05070a] text-white">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          badgeText="Simple & Transparent"
          title="Build your first resume"
          gradientText="completely free."
          description="Start building your resume without entering a credit card. Upgrade with pay-as-you-go chat packs only if you need more iterations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Free Starter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#0b1016] p-7 sm:p-8 shadow-xl hover:border-white/20 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Free Starter
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/[0.06] text-zinc-300 border border-white/10">
                  Included on signup
                </span>
              </div>

              <div className="flex items-baseline gap-1 mt-2 mb-4">
                <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">$0</span>
                <span className="text-sm text-zinc-400">/ free forever</span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Everything you need to create, typeset, and download a professional ATS resume today.
              </p>

              <ul className="mt-6 space-y-3 pt-6 border-t border-white/[0.08]">
                {freeFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[#00ff9c] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link href="/register">
                <Button variant="glow" size="lg" className="w-full justify-center text-sm font-bold">
                  Start Building Free
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Pay-As-You-Go Packs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col justify-between rounded-3xl border border-[#00ff9c]/30 bg-gradient-to-b from-[#0b1016] to-[#0d161d] p-7 sm:p-8 shadow-2xl relative specular-border"
          >
            <div className="absolute -top-3.5 right-6 bg-[#00ff9c] text-black text-[11px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider shadow-md">
              No Subscriptions
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#00ff9c] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Chat Top-Up Packs
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2 mb-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Pay-As-You-Go</span>
                <span className="text-xs text-zinc-400">INR / Global Cards</span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Need more revisions or multiple role-specific resumes? Purchase additional chat packs directly from your dashboard whenever you need them.
              </p>

              <ul className="mt-6 space-y-3 pt-6 border-t border-white/[0.08]">
                {paidFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[#00ff9c] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-center text-sm font-semibold border-white/20 hover:border-white/40"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign In to View Billing Options
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Guarantees */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00ff9c]" /> No hidden recurring billing
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00ff9c]" /> Full data privacy protection
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00ff9c]" /> Export anytime
          </span>
        </div>
      </div>
    </section>
  );
}
