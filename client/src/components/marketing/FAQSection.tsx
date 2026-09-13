"use client";

import React from "react";
import { motion } from "framer-motion";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function FAQSection() {
  const faqItems = [
    {
      id: "what-is-chatcv",
      question: "What makes Chat CV different from other AI resume builders?",
      answer: (
        <p>
          Most AI resume tools either offer generic ChatGPT rewrites or force you into rigid, multi-column HTML templates that break in applicant tracking systems (ATS). Chat CV conducts a structured conversation to extract your actual achievements, converts them into quantified Google XYZ format, and compiles them using a deterministic, single-column LaTeX engine. You get mathematically clean typesetting with zero formatting headaches.
        </p>
      ),
    },
    {
      id: "how-latex-works",
      question: "Do I need to know LaTeX to use Chat CV?",
      answer: (
        <p>
          No. You simply converse in plain English. Chat CV handles all LaTeX preamble setup, margin configurations, package imports, and character escaping behind the scenes. However, if you are a developer or academic who loves LaTeX, you can inspect and copy the complete raw <code className="text-[#00ff9c] font-mono text-xs bg-white/[0.05] px-1.5 py-0.5 rounded">.tex</code> code anytime to compile inside Overleaf.
        </p>
      ),
    },
    {
      id: "ats-compliance",
      question: "Why is LaTeX better for ATS compliance?",
      answer: (
        <p>
          Applicant Tracking Systems (like Workday, Greenhouse, and Lever) fail when resumes use multi-column text boxes, icon graphics, or non-standard tables. Chat CV generates clean, linear, single-column documents using standard vector fonts and clear semantic headings, ensuring that parsers extract your contact info, role titles, and dates without corruption.
        </p>
      ),
    },
    {
      id: "import-resume",
      question: "Can I import an existing resume instead of starting from scratch?",
      answer: (
        <p>
          Yes. You can upload an existing PDF or plain text resume using the paperclip button in the chat panel. Chat CV extracts your past work experience, education, skills, and contact details into the workspace, so you can immediately begin improving and updating it.
        </p>
      ),
    },
    {
      id: "free-tier",
      question: "How does the free tier work?",
      answer: (
        <p>
          Every new account receives 5 free AI chat messages upon email verification. This is plenty of usage to generate your initial resume, live-preview it, and download your finished PDF and LaTeX source code. If you need further revisions down the road, you can purchase one-time chat top-ups without any subscription lock-in.
        </p>
      ),
    },
    {
      id: "multiple-resumes",
      question: "Can I manage multiple resumes for different jobs?",
      answer: (
        <p>
          Yes. Chat CV supports multiple resumes in your workspace. You can create specialized drafts for different positions (e.g., Frontend vs. Fullstack), and each resume maintains its own conversation thread and compiled PDF state.
        </p>
      ),
    },
    {
      id: "data-privacy",
      question: "Is my personal career data private and secure?",
      answer: (
        <p>
          Yes. Your career data is stored securely in encrypted databases and is used strictly to compile your resumes. We do not sell user career data to third-party advertisers or recruitment agencies.
        </p>
      ),
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#05070a] text-white border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          badgeText="Frequently Asked Questions"
          title="Everything you need to know about"
          gradientText="Chat CV."
          description="Clear answers about our conversational builder, LaTeX compilation, ATS compliance, and privacy."
        />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-3xl border border-white/[0.08] bg-[#0b1016] p-6 sm:p-10 shadow-xl"
        >
          <Accordion items={faqItems} />
        </motion.div>
      </div>
    </section>
  );
}
