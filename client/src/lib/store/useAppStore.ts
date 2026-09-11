"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface DemoResumeProfile {
  id: string;
  role: string;
  company: string;
  name: string;
  atsScore: number;
  highlightSkill: string;
  summary: string;
  experienceBullets: string[];
  latexSnippet: string;
}

export const PRESET_PROFILES: DemoResumeProfile[] = [
  {
    id: "frontend",
    role: "Senior Frontend Engineer",
    company: "Stripe & Vercel Alum",
    name: "Alex Rivera",
    atsScore: 99,
    highlightSkill: "React 19 • Next.js • TypeScript • Web Vitals",
    summary:
      "Frontend Architect with 7+ years of experience leading UI systems, cutting Largest Contentful Paint by 42% and scaling design systems across 12 product lines.",
    experienceBullets: [
      "Engineered high-frequency checkout micro-frontends handling $14M daily volume with 99.99% uptime.",
      "Spearheaded company-wide migration to Next.js App Router, trimming client bundle size by 38% and boosting Core Web Vitals to 98/100.",
      "Mentored 6 junior engineers and instituted rigorous TypeScript & automated accessibility (WCAG AA) standards.",
    ],
    latexSnippet: `\\textbf{Alex Rivera} \\\\
\\small (415) 890-2311 \\ $|$ \\ alex.rivera@dev.io \\ $|$ \\ San Francisco, CA \\\\
\\vspace{4pt}
\\textbf{PROFESSIONAL EXPERIENCE} \\\\
\\textbf{Stripe} \\hfill San Francisco, CA \\\\
\\textit{Senior Frontend Engineer} \\hfill 2022 -- Present \\\\
\\begin{itemize}
  \\item Engineered high-frequency checkout micro-frontends handling \\$14M daily.
  \\item Trimmed client bundle size by 38\\%, boosting Web Vitals to 98/100.
\\end{itemize}`,
  },
  {
    id: "product",
    role: "Lead Product Manager",
    company: "Series B FinTech",
    name: "Sarah Chen",
    atsScore: 97,
    highlightSkill: "Product Strategy • PLG • SQL • A/B Testing",
    summary:
      "Data-driven Product Leader with track record of taking 0-to-1 B2B SaaS products to $8M ARR. Expert in user onboarding retention and pricing experimentation.",
    experienceBullets: [
      "Designed and launched self-serve subscription tier, driving a 34% surge in free-to-paid conversion in Q3.",
      "Conducted 80+ customer discovery interviews and prioritized 12-month engineering roadmap aligned with OKRs.",
      "Optimized product analytics funnels reducing new-user onboarding drop-off by 26%.",
    ],
    latexSnippet: `\\textbf{Sarah Chen} \\\\
\\small (212) 745-9012 \\ $|$ \\ sarah.chen@product.com \\ $|$ \\ New York, NY \\\\
\\vspace{4pt}
\\textbf{PROFESSIONAL EXPERIENCE} \\\\
\\textbf{Apex Financial} \\hfill New York, NY \\\\
\\textit{Lead Product Manager} \\hfill 2021 -- Present \\\\
\\begin{itemize}
  \\item Launched self-serve subscription tier, lifting free-to-paid conversion by 34\\%.
  \\item Reduced new-user onboarding drop-off by 26\\% through data-driven funnel redesign.
\\end{itemize}`,
  },
  {
    id: "ai-engineer",
    role: "AI / ML Systems Engineer",
    company: "DeepTech Labs",
    name: "David K.",
    atsScore: 98,
    highlightSkill: "PyTorch • vLLM • RAG Pipelines • CUDA",
    summary:
      "Applied AI Engineer specializing in LLM inference acceleration, fine-tuning Llama/DeepSeek architectures, and deploying sub-50ms RAG pipelines in production.",
    experienceBullets: [
      "Architected enterprise retrieval-augmented generation (RAG) system with hybrid vector-BM25 search, boosting precision@5 to 94.2%.",
      "Optimized GPU memory footprint with vLLM PagedAttention and FP8 quantization, slashing inference cost by 62%.",
      "Built resilient semantic cache layer serving 45% of frequent user queries in under 12ms.",
    ],
    latexSnippet: `\\textbf{David K.} \\\\
\\small (650) 412-8823 \\ $|$ \\ david.k@ailabs.org \\ $|$ \\ Palo Alto, CA \\\\
\\vspace{4pt}
\\textbf{PROFESSIONAL EXPERIENCE} \\\\
\\textbf{DeepTech Labs} \\hfill Palo Alto, CA \\\\
\\textit{Staff AI Systems Engineer} \\hfill 2023 -- Present \\\\
\\begin{itemize}
  \\item Architected enterprise hybrid RAG pipeline achieving 94.2\\% precision@5.
  \\item Slashed LLM serving expenditure by 62\\% using vLLM FP8 quantization.
\\end{itemize}`,
  },
];

export interface AppCacheState {
  // Demo Interactive State
  selectedProfileId: string;
  activeTab: "preview" | "latex" | "ats-audit";
  setSelectedProfileId: (id: string) => void;
  setActiveTab: (tab: "preview" | "latex" | "ats-audit") => void;
  getCurrentProfile: () => DemoResumeProfile;

  // Waitlist / Subscription Cache
  isWaitlistJoined: boolean;
  userEmail: string;
  setWaitlistJoined: (email: string) => void;

  // Cash / Credits Store State
  userCredits: number;
  isStoreModalOpen: boolean;
  selectedPlan: "starter" | "pro" | "lifetime";
  setStoreModalOpen: (open: boolean) => void;
  setSelectedPlan: (plan: "starter" | "pro" | "lifetime") => void;
  addCredits: (amount: number) => void;

  // Performance Telemetry / UI Preferences
  soundEffectsEnabled: boolean;
  toggleSoundEffects: () => void;
}

export const useAppStore = create<AppCacheState>()(
  persist(
    (set, get) => ({
      selectedProfileId: "frontend",
      activeTab: "preview",
      setSelectedProfileId: (id: string) => set({ selectedProfileId: id }),
      setActiveTab: (tab: "preview" | "latex" | "ats-audit") => set({ activeTab: tab }),
      getCurrentProfile: () => {
        const id = get().selectedProfileId;
        return PRESET_PROFILES.find((p) => p.id === id) || PRESET_PROFILES[0];
      },

      isWaitlistJoined: false,
      userEmail: "",
      setWaitlistJoined: (email: string) =>
        set({ isWaitlistJoined: true, userEmail: email }),

      userCredits: 3, // 3 free instant generation credits by default
      isStoreModalOpen: false,
      selectedPlan: "pro",
      setStoreModalOpen: (open: boolean) => set({ isStoreModalOpen: open }),
      setSelectedPlan: (plan: "starter" | "pro" | "lifetime") => set({ selectedPlan: plan }),
      addCredits: (amount: number) =>
        set((state) => ({ userCredits: state.userCredits + amount })),

      soundEffectsEnabled: false,
      toggleSoundEffects: () =>
        set((state) => ({ soundEffectsEnabled: !state.soundEffectsEnabled })),
    }),
    {
      name: "chatcv_app_cache_v1",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
