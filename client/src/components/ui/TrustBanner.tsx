"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, Award, Zap, Users } from "lucide-react";

export function TrustBanner() {
  const trustMetrics = [
    {
      icon: <Award className="w-4 h-4 text-emerald-400" />,
      label: "ATS Pass Rate",
      value: "99.4%",
      detail: "Tested across Workday & Greenhouse",
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      label: "Privacy First",
      value: "256-Bit",
      detail: "Encrypted & zero data sharing",
    },
    {
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      label: "Job Seekers",
      value: "42,000+",
      detail: "Resumes compiled & downloaded",
    },
    {
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      label: "Generation Speed",
      value: "< 3 mins",
      detail: "From blank page to LaTeX PDF",
    },
  ];

  const companies = [
    "Google",
    "Microsoft",
    "Stripe",
    "Amazon",
    "Meta",
    "Airbnb",
    "Uber",
  ];

  return (
    <div className="w-full py-10 border-y border-white/[0.06] bg-[#070a0f]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-10">
          {trustMetrics.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg md:text-xl font-extrabold text-white tracking-tight">
                    {item.value}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Company Placement Logos Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-widest text-center md:text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ChatCV users have landed interviews at leading companies</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-70">
            {companies.map((company) => (
              <span
                key={company}
                className="text-sm md:text-base font-bold text-zinc-300 tracking-tight hover:text-white transition-colors select-none"
              >
                {company}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
