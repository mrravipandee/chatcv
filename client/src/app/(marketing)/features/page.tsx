export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import { Bot, FileCode, Search, Layout, Shield, Zap, Sparkles, ArrowRight, Check } from "lucide-react";
import ClientMotionDiv from "@/components/features/ClientMotionDiv";

export const metadata: Metadata = {
  title: "AI Resume Builder Features & ATS Optimizer | ChatCV",
  description: "Discover ChatCV's premium features: conversational AI CV maker, typeset LaTeX engines, real-time ATS keyword optimization, and print-ready PDF downloads.",
  alternates: {
    canonical: "/features",
  },
  openGraph: {
    title: "ChatCV AI Resume Builder - Premium Features",
    description: "Build ATS-compliant resumes with conversational AI, professional LaTeX templates, and real-time keyword optimization.",
    url: "https://resumebuilder-chatcv.vercel.app/features",
    type: "website",
  },
};

export default function FeaturesPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChatCV",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Conversational AI resume builder utilizing LaTeX typesetting to output 100% ATS-compliant professional resumes.",
    "featureList": [
      "Conversational AI Chat Assistant",
      "Pristine LaTeX Typesetting",
      "Real-time ATS Keyword Optimization",
      "Instant High-Resolution PDF Export",
      "Secure Data & Privacy Protection"
    ]
  };

  const coreFeatures = [
    {
      id: "chat-editor",
      icon: <Bot className="w-6 h-6" />,
      title: "Conversational AI Chat Editor",
      badge: "Intelligent Writing",
      desc: "Staring at a blank page is a thing of the past. ChatCV replaces rigid forms and drag-and-drop handles with an interactive chat interface. You simply tell the AI about your projects, internships, or achievements in plain text, and it structures them into professional, result-oriented statements.",
      bullets: [
        "Uses Google's XYZ formula (Accomplished [X], as measured by [Y], by doing [Z]).",
        "Translates technical jargon into clear, recruiter-friendly descriptions.",
        "Generates summaries, project statements, and experience bullet points in real-time."
      ],
      color: "from-emerald-500/20 to-teal-500/20",
      glowColor: "rgba(0, 255, 156, 0.15)"
    },
    {
      id: "latex-compiler",
      icon: <FileCode className="w-6 h-6" />,
      title: "Pristine LaTeX Typesetting Engine",
      badge: "Developer Grade",
      desc: "Unlike standard editors that generate messy HTML or heavy Word structures, ChatCV uses LaTeX to render your CV. Loved by scientists and developers worldwide, LaTeX programmatically ensures mathematical layout precision, proper alignment, and perfect page formatting.",
      bullets: [
        "100% parseable by applicant tracking systems (no column wrapping issues).",
        "Consistent spacing, margin structures, and professional font heights.",
        "Provides clean raw LaTeX code outputs for developer customization."
      ],
      color: "from-[#00ff9c]/20 to-emerald-600/20",
      glowColor: "rgba(16, 185, 129, 0.15)"
    },
    {
      id: "ats-optimizer",
      icon: <Search className="w-6 h-6" />,
      title: "Real-Time ATS Keyword Optimizer",
      badge: "Job Matcher",
      desc: "Pass the initial applicant scan with confidence. Simply paste the job description you are targeting, and our real-time natural language parser checks your resume for missing certifications, keywords, or hard skills.",
      bullets: [
        "Flags critical role-specific keywords (e.g. AWS, React, Product Roadmaps).",
        "Offers suggestions to seamlessly integrate keywords without keyword stuffing.",
        "Increases your ATS matching score and overall callback rates."
      ],
      color: "from-teal-600/20 to-[#00ff9c]/20",
      glowColor: "rgba(0, 255, 156, 0.15)"
    },
    {
      id: "theme-engine",
      icon: <Layout className="w-6 h-6" />,
      title: "Multi-Theme Layout Swapping",
      badge: "Typeset Presets",
      desc: "Switch styles in seconds. Whether you want a classical academic look, a clean corporate format, or a minimalist engineering design, ChatCV renders your compiled LaTeX across themes without losing text positioning.",
      bullets: [
        "Optimized layout presets tailored for tech, management, and medicine roles.",
        "Automatic page budget fitting to avoid awkward blank spaces.",
        "Download print-ready, high-resolution PDF copies instantly."
      ],
      color: "from-zinc-900 to-zinc-950",
      glowColor: "rgba(255, 255, 255, 0.05)"
    }
  ];

  return (
    <main className="bg-black min-h-screen text-white pt-32 pb-24 relative overflow-hidden">
      {/* SCHEMA INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(0,255,156,0.06),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* GEOMETRIC RHOMBUS BACKGROUND SHAPES */}
      <div className="absolute top-[10%] left-[-150px] w-96 h-96 bg-gradient-to-br from-[#00ff9c]/5 to-transparent border border-[#00ff9c]/10 rotate-45 rounded-[40px] blur-[1px] pointer-events-none hidden xl:block" />
      <div className="absolute top-[40%] right-[-150px] w-[500px] h-[500px] bg-gradient-to-tl from-emerald-500/5 to-transparent border border-emerald-500/10 rotate-45 rounded-[64px] blur-[2px] pointer-events-none hidden xl:block" />
      <div className="absolute bottom-[10%] left-[5%] w-80 h-80 bg-gradient-to-tr from-teal-500/5 to-transparent border border-teal-500/5 rotate-45 rounded-[36px] blur-[1px] pointer-events-none hidden xl:block" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-28">
          <ClientMotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#00ff9c]/10 border border-[#00ff9c]/25 text-[#00ff9c] text-[10px] font-bold px-3.5 py-1.5 rounded-md uppercase tracking-wider mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#00ff9c] rotate-45 shrink-0 animate-pulse" />
            Product Features
          </ClientMotionDiv>

          <ClientMotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight"
          >
            Built to Land You <br />
            <span className="bg-gradient-to-r from-[#00ff9c] via-emerald-400 to-[#00ff9c] bg-clip-text text-transparent bg-[size:200%_auto] animate-pulse">
              Top-Tier Interviews
            </span>
          </ClientMotionDiv>

          <ClientMotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed"
          >
            Explore our state-of-the-art resume building tools designed to bypass automated filters and present your professional experience programmatically.
          </ClientMotionDiv>
        </div>

        {/* DETAILED FEATURES SECTIONS */}
        <div className="space-y-32">
          {coreFeatures.map((feat, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={feat.id}
                id={feat.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`}
              >
                {/* Visual Showcase Block */}
                <ClientMotionDiv
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  <div className="relative w-full min-h-[260px] sm:min-h-[280px] bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 border border-white/10 rounded-3xl p-6 sm:p-8 py-8 sm:py-10 flex flex-col justify-center overflow-hidden shadow-2xl group hover:border-[#00ff9c]/35 transition-all duration-500">
                    {/* Glowing Accent */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle_at_center, ${feat.glowColor} 0%, transparent 60%)`
                      }}
                    />

                    {/* Rhombus Icon */}
                    <div className="w-12 h-12 bg-[#00ff9c]/10 border border-[#00ff9c]/25 rounded-2xl flex items-center justify-center text-[#00ff9c] mb-6 relative">
                      <div className="absolute inset-0 bg-[#00ff9c] opacity-0 group-hover:opacity-20 blur-md rounded-2xl transition-opacity" />
                      {feat.icon}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00ff9c] transition-colors">{feat.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                      {feat.desc.split(".")[0]}. Engineered to optimize formatting and compatibility standard.
                    </p>

                    {/* Tiny Rhombus accents */}
                    <div className="absolute right-4 bottom-4 w-4 h-4 border border-[#00ff9c]/10 rotate-45 group-hover:border-[#00ff9c]/30 transition-colors" />
                    <div className="absolute right-5 bottom-2 w-2 h-2 bg-[#00ff9c]/5 rotate-45 group-hover:bg-[#00ff9c]/20 transition-colors animate-pulse" />
                  </div>
                </ClientMotionDiv>

                {/* Content Block */}
                <ClientMotionDiv
                  initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-6 flex flex-col justify-center ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <span className="text-[9px] uppercase tracking-widest text-[#00ff9c] font-black mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#00ff9c] rotate-45" />
                    {feat.badge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                    {feat.title}
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
                    {feat.desc}
                  </p>

                  <ul className="space-y-3">
                    {feat.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <span className="w-1.5 h-1.5 bg-[#00ff9c] rotate-45 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(0,255,156,0.8)]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </ClientMotionDiv>
              </div>
            );
          })}
        </div>

        {/* ACCORDION SPEED / ZAP CHARACTERISTICS */}
        <div className="mt-40 bg-zinc-950/40 border border-white/5 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff9c]/5 rotate-45 translate-x-12 -translate-y-12 border border-[#00ff9c]/10 rounded-[30px]" />
          
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-extrabold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00ff9c] rotate-45 shrink-0" />
              Product Performance
            </h3>
            <h4 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Why chat-based resume creation beats templates
            </h4>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
              Traditional templates require hours of aligning bullet points, centering titles, and testing formats against basic scanners. With ChatCV, you skip the manual overhead. Our engine converts your casual description into precise document specifications programmatically.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                <span className="text-xl sm:text-2xl font-black text-[#00ff9c]">100%</span>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">ATS Scan Pass Rate</p>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                <span className="text-xl sm:text-2xl font-black text-[#00ff9c]">5 Mins</span>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">Average Build Time</p>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                <span className="text-xl sm:text-2xl font-black text-[#00ff9c]">3.5x</span>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">Interview Callback Lift</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA BANNER */}
        <div className="mt-40 text-center max-w-4xl mx-auto">
          <div className="w-10 h-10 bg-[#00ff9c]/10 border border-[#00ff9c]/25 text-[#00ff9c] flex items-center justify-center rounded-xl mx-auto rotate-45 mb-8 shadow-[0_0_12px_rgba(0,255,156,0.3)]">
            <Zap className="w-5 h-5 -rotate-45" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
            Stop Wrestling with Templates.<br />
            Start Chatting Instead.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Create an elegant, ATS-compliant LaTeX resume in minutes. No credit cards required, generous free tier included.
          </p>

          <Link href="/dashboard">
            <button className="relative group bg-[#00ff9c] text-black px-8 py-3.5 rounded-xl font-bold text-sm shadow-[0_4px_20px_rgba(0,255,156,0.2)] overflow-hidden transition-transform active:scale-95 inline-flex items-center gap-2">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-1.5">
                Build My Resume For Free <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}
