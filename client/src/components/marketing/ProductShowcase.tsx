"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  FileText,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Terminal,
  Download,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Scenario {
  id: string;
  role: string;
  userInputs: string[];
  assistantReplies: string[];
  preview: {
    name: string;
    role: string;
    contact: string;
    summary: string;
    experience: {
      title: string;
      company: string;
      dates: string;
      bullets: string[];
    };
    skills: string[];
  };
  latexSnippet: string;
  atsChecks: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "swe",
    role: "Software Engineer",
    userInputs: [
      "I'm Alex Morgan. I've been a Backend Engineer at Vercel for 3 years.",
      "I rebuilt our edge routing engine in Go & Rust, which cut latency by 35% across 2M daily requests.",
    ],
    assistantReplies: [
      "Great to meet you, Alex! I've set up your profile for Backend Engineer. Tell me about a key project you led and its quantifiable outcome.",
      "Excellent. I've quantified that into an impactful Google XYZ bullet point and added Go, Rust, and Edge Architecture to your Technical Skills section.",
    ],
    preview: {
      name: "Alex Morgan",
      role: "Backend Systems Engineer",
      contact: "alex.morgan@dev.io • (415) 890-2134 • San Francisco, CA • github.com/alexmorgan",
      summary:
        "Systems Engineer with 3+ years architecting distributed microservices and low-latency edge gateways handling millions of production requests daily.",
      experience: {
        title: "Senior Backend Engineer",
        company: "Vercel Inc.",
        dates: "2023 – Present",
        bullets: [
          "Re-architected distributed edge routing layer in Go & Rust, cutting P99 request latency by 35% across 2.4M daily requests.",
          "Implemented semantic caching and resilient failover logic, ensuring 99.99% system availability during traffic spikes.",
          "Partnered with infrastructure teams to optimize CI/CD test suites, reducing deployment pipeline duration by 40%.",
        ],
      },
      skills: ["Go", "Rust", "TypeScript", "Distributed Systems", "Docker", "Kubernetes", "PostgreSQL", "Redis"],
    },
    latexSnippet: `\\documentclass[letterpaper,11pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries}{}{0em}{}[\\titlerule \\vspace{-5pt}]
\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}
\\begin{center}
  {\\Huge \\scshape Alex Morgan} \\\\ \\vspace{4pt}
  \\small (415) 890-2134 $|$ alex.morgan@dev.io $|$ San Francisco, CA
\\end{center}

\\section{Experience}
\\resumeSubHeadingListStart
  \\resumeSubheading
    {Vercel Inc.}{2023 -- Present}
    {Senior Backend Systems Engineer}{San Francisco, CA}
    \\resumeItemListStart
      \\resumeItem{Re-architected distributed edge routing in Go \\& Rust, cutting P99 latency by 35\\% across 2.4M daily calls.}
      \\resumeItem{Built resilient failover logic and semantic caching, sustaining 99.99\\% uptime.}
    \\resumeItemListEnd
\\resumeSubHeadingListEnd

\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{\\textbf{Languages}{: Go, Rust, TypeScript, SQL} \\\\
  \\textbf{Cloud \\& Infra}{: Docker, Kubernetes, PostgreSQL, Redis, Edge Computing}}}
\\end{itemize}
\\end{document}`,
    atsChecks: [
      "Standard single-column tabular layout (100% parseable by Workday, Lever & Greenhouse)",
      "Quantified metrics detected in every bullet point ($ or % impact statements)",
      "Zero unreadable graphics, multi-column tables, or hidden icon fonts",
      "Exact technical keyword matching for modern cloud and backend roles",
    ],
  },
  {
    id: "pm",
    role: "Product Manager",
    userInputs: [
      "I'm Priya Sharma, a Senior Product Manager at Stripe working on checkout conversion.",
      "I redesigned the merchant onboarding funnel, which increased free-to-paid conversion by 28% in Q2.",
    ],
    assistantReplies: [
      "Welcome, Priya! I've initialized your product management resume. What were the key growth metrics and stakeholder strategies for that initiative?",
      "Terrific. I've structured this into a verified outcome statement highlighting data-driven experimentation, A/B testing, and direct revenue impact.",
    ],
    preview: {
      name: "Priya Sharma",
      role: "Senior Product Manager",
      contact: "priya.sharma@pm.io • (212) 555-0198 • New York, NY • linkedin.com/in/priyasharma",
      summary:
        "Data-driven Product Leader with 6+ years driving self-serve SaaS adoption, payment conversion funnels, and enterprise platform retention.",
      experience: {
        title: "Staff Product Manager — Checkout",
        company: "Stripe",
        dates: "2022 – Present",
        bullets: [
          "Redesigned self-serve merchant onboarding experience, driving a 28% increase in free-to-paid conversion in Q2.",
          "Conducted 45+ customer discovery interviews and prioritized 4-quarter roadmap aligning engineering with business OKRs.",
          "Instituted weekly multivariate experimentation framework that lifted mobile checkout completion by 14%.",
        ],
      },
      skills: ["Product Strategy", "PLG", "SQL", "A/B Testing", "Figma", "User Research", "Mixpanel", "Jira"],
    },
    latexSnippet: `\\documentclass[letterpaper,11pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries}{}{0em}{}[\\titlerule \\vspace{-5pt}]
\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}
\\begin{center}
  {\\Huge \\scshape Priya Sharma} \\\\ \\vspace{4pt}
  \\small (212) 555-0198 $|$ priya.sharma@pm.io $|$ New York, NY
\\end{center}

\\section{Experience}
\\resumeSubHeadingListStart
  \\resumeSubheading
    {Stripe}{2022 -- Present}
    {Staff Product Manager -- Checkout}{New York, NY}
    \\resumeItemListStart
      \\resumeItem{Redesigned self-serve onboarding, lifting free-to-paid conversion by 28\\% in Q2.}
      \\resumeItem{Instituted multivariate A/B testing framework boosting mobile checkout completion by 14\\%.}
    \\resumeItemListEnd
\\resumeSubHeadingListEnd

\\section{Core Competencies}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{\\textbf{Strategy}{: Product Strategy, PLG, A/B Testing, Discovery} \\\\
  \\textbf{Analytics \\& Tools}{: SQL, Mixpanel, Figma, Jira, User Research}}}
\\end{itemize}
\\end{document}`,
    atsChecks: [
      "Clean hierarchy: Role title, company name, location, and dates clearly separated",
      "Executive summary calibrated with core product strategy and analytics keywords",
      "Deterministic margin boundaries (0.75in) ensuring single-page alignment",
      "Clean LaTeX font family: readable across legacy PDF parsers",
    ],
  },
];

export default function ProductShowcase() {
  const [activeScenarioId, setActiveScenarioId] = useState("swe");
  const [activeTab, setActiveTab] = useState<"preview" | "latex" | "ats">("preview");
  const [copied, setCopied] = useState(false);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(scenario.latexSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="showcase" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#05070a] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00ff9c]/30 bg-[#00ff9c]/10 px-3 py-1 text-xs font-semibold text-[#00ff9c] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Product Demonstration</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white leading-tight">
            See the conversion live.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Watch how unstructured conversation instantly transforms into structured data, deterministic LaTeX, and an ATS-proof resume.
          </p>

          {/* Role Switcher */}
          <div className="mt-8 inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#0b1016] border border-white/[0.08]">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveScenarioId(s.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeScenarioId === s.id
                    ? "bg-white/[0.1] text-white shadow-xs border border-white/10"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {s.role}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Showcase Application Window */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0b1016] shadow-2xl overflow-hidden specular-border"
        >
          {/* Mock Browser Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#080c10]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#00ff9c]/80" />
              </div>
              <span className="text-xs font-mono text-zinc-400 pl-2 border-l border-white/10 hidden sm:inline-flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#00ff9c]" />
                chatcv-workspace.preview
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#00ff9c] bg-[#00ff9c]/10 border border-[#00ff9c]/20 px-2.5 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff9c] animate-pulse" />
                Compiler Ready (pdflatex)
              </span>
            </div>
          </div>

          {/* Dual Panel Grid: Left = Chat AI, Right = Synced Resume Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
            
            {/* LEFT PANEL: Conversation Flow (col-span-5) */}
            <div className="lg:col-span-5 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#070b10] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#00ff9c]/10 border border-[#00ff9c]/20">
                      <Bot className="w-4 h-4 text-[#00ff9c]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        ChatCV AI Assistant
                      </h3>
                      <p className="text-[11px] text-zinc-500">Real-time structured extraction</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-white/[0.04] px-2 py-0.5 rounded text-zinc-400 border border-white/[0.05]">
                    Interactive
                  </span>
                </div>

                {/* Chat Message Stream */}
                <div className="space-y-4">
                  {/* Step 1 User */}
                  <motion.div
                    key={`u1-${scenario.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-white/[0.06] border border-white/10 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-200">
                      {scenario.userInputs[0]}
                    </div>
                  </motion.div>

                  {/* Step 1 Assistant */}
                  <motion.div
                    key={`a1-${scenario.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-2.5 items-start"
                  >
                    <div className="h-6 w-6 rounded-full bg-[#00ff9c]/10 border border-[#00ff9c]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-[#00ff9c]" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-[#0c1219] border border-white/[0.08] p-3 text-xs sm:text-sm text-zinc-300">
                      {scenario.assistantReplies[0]}
                    </div>
                  </motion.div>

                  {/* Step 2 User */}
                  <motion.div
                    key={`u2-${scenario.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#00ff9c]/10 border border-[#00ff9c]/30 px-3.5 py-2.5 text-xs sm:text-sm text-[#00ff9c]">
                      {scenario.userInputs[1]}
                    </div>
                  </motion.div>

                  {/* Step 2 Assistant */}
                  <motion.div
                    key={`a2-${scenario.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-2.5 items-start"
                  >
                    <div className="h-6 w-6 rounded-full bg-[#00ff9c]/10 border border-[#00ff9c]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-[#00ff9c]" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-[#0c1219] border border-white/[0.08] p-3 text-xs sm:text-sm text-zinc-300">
                      {scenario.assistantReplies[1]}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Zap className="w-3 h-3 text-[#00ff9c]" /> Live extraction to LaTeX
                </span>
                <Link href="/register" className="text-[#00ff9c] font-semibold hover:underline">
                  Try it yourself →
                </Link>
              </div>
            </div>

            {/* RIGHT PANEL: Synced Output Tabs (col-span-7) */}
            <div className="lg:col-span-7 p-5 sm:p-6 bg-[#0b1016] flex flex-col justify-between">
              <div>
                {/* Tabs Bar */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setActiveTab("preview")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        activeTab === "preview"
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-[#00ff9c]" />
                      Live Resume Preview
                    </button>

                    <button
                      onClick={() => setActiveTab("latex")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        activeTab === "latex"
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5 text-teal-400" />
                      LaTeX Source (.tex)
                    </button>

                    <button
                      onClick={() => setActiveTab("ats")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        activeTab === "ats"
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      ATS Verification
                    </button>
                  </div>

                  {activeTab === "latex" && (
                    <button
                      onClick={handleCopy}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#00ff9c]" />
                          <span className="text-[#00ff9c]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Tab Content Display */}
                <AnimatePresence mode="wait">
                  {activeTab === "preview" && (
                    <motion.div
                      key={`preview-${scenario.id}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl border border-white/[0.08] bg-[#070b10] p-4 sm:p-5 font-sans space-y-4 shadow-inner"
                    >
                      {/* Document Header */}
                      <div className="text-center border-b border-white/[0.08] pb-3">
                        <h4 className="text-lg font-bold tracking-tight text-white">
                          {scenario.preview.name}
                        </h4>
                        <p className="text-xs text-[#00ff9c] font-medium mt-0.5">
                          {scenario.preview.role}
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                          {scenario.preview.contact}
                        </p>
                      </div>

                      {/* Summary */}
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                          Professional Summary
                        </span>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {scenario.preview.summary}
                        </p>
                      </div>

                      {/* Experience */}
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                          Work Experience
                        </span>
                        <div className="flex justify-between items-baseline text-xs font-semibold text-white">
                          <span>{scenario.preview.experience.title} — {scenario.preview.experience.company}</span>
                          <span className="text-[11px] text-zinc-400 font-mono">{scenario.preview.experience.dates}</span>
                        </div>
                        <ul className="mt-2 space-y-1.5">
                          {scenario.preview.experience.bullets.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                              <span className="text-[#00ff9c] mt-1">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Skills */}
                      <div className="pt-2 border-t border-white/[0.06]">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                          Technical Skills
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {scenario.preview.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[11px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "latex" && (
                    <motion.div
                      key={`latex-${scenario.id}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                        <span>resume.tex (Strict standard LaTeX template)</span>
                        <span className="text-[#00ff9c]">Overleaf Ready</span>
                      </div>
                      <pre className="p-4 rounded-xl bg-[#070b10] border border-white/[0.08] text-xs font-mono text-zinc-300 overflow-x-auto max-h-[360px] leading-relaxed select-all">
                        {scenario.latexSnippet}
                      </pre>
                    </motion.div>
                  )}

                  {activeTab === "ats" && (
                    <motion.div
                      key={`ats-${scenario.id}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3.5"
                    >
                      <div className="p-3.5 rounded-xl bg-[#00ff9c]/10 border border-[#00ff9c]/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#00ff9c]" />
                          <span className="text-xs font-bold text-white">Parser Architecture Verified</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#00ff9c]">Single-Column Layout</span>
                      </div>

                      <div className="space-y-2">
                        {scenario.atsChecks.map((check, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-zinc-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#00ff9c] shrink-0 mt-0.5" />
                            <span>{check}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Banner */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-zinc-400 text-center sm:text-left">
                  Output compiles to standard PDF in under 10 seconds.
                </p>
                <Link href="/register">
                  <Button variant="glow" size="sm" rightIcon={<Download className="w-3.5 h-3.5" />}>
                    Build Yours Free
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
