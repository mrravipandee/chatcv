export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle, HelpCircle, Shield, Sparkles, Terminal, XCircle, Zap } from "lucide-react";
import DemoVideoPlayer from "@/components/demo/DemoVideoPlayer";
import ClientMotionDiv from "@/components/features/ClientMotionDiv";

export const metadata: Metadata = {
  title: "Product Demo & Walkthrough | ChatCV AI Resume Builder",
  description: "Watch ChatCV in action. See how our conversational AI and pristine LaTeX engine build 100% ATS-compliant, professional resumes in under 5 minutes.",
  alternates: {
    canonical: "/demo",
  },
  openGraph: {
    title: "ChatCV AI Resume Builder - Product Demo",
    description: "Watch how you can build an ATS-optimized professional resume in minutes just by chatting with an AI.",
    url: "https://resumebuilder-chatcv.vercel.app/demo",
    type: "website",
  },
};

export default function DemoPage() {
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "ChatCV AI Resume Builder Walkthrough & Product Demo",
    "description": "A full video demonstration of the ChatCV conversational AI resume builder, highlighting LaTeX typesetting, ATS optimization, and instant PDF download.",
    "thumbnailUrl": [
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop"
    ],
    "uploadDate": "2026-08-05T12:00:00Z",
    "duration": "PT1M30S",
    "contentUrl": "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34285-large.mp4",
    "embedUrl": "https://resumebuilder-chatcv.vercel.app/demo"
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChatCV AI Resume Builder",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Create professional, ATS-friendly resumes in minutes with ChatCV, the best free AI resume builder."
  };

  const problemsSolved = [
    {
      title: "Clunky & Rigid UI Editors",
      problem: "Traditional resume makers use complicated drag-and-drop builders or multi-step forms that wrap lines awkwardly, leading to alignment bugs and hour-long formatting battles.",
      solution: "ChatCV uses a natural conversational AI. You write plain details like 'I built a React site' and it formats the experience automatically based on recruiter-approved standards.",
      icon: <Bot className="w-5 h-5" />
    },
    {
      title: "ATS (Applicant Tracking System) Rejection",
      problem: "Standard templates exported as rich Word files or multi-column PDFs fail parsing scans due to hidden tables, text columns, or bad characters.",
      solution: "ChatCV compiles your text directly using LaTeX—the world's most precise document compiler. Spacing, fonts, and tags are 100% readable by top-tier ATS parsers.",
      icon: <Terminal className="w-5 h-5" />
    },
    {
      title: "Missing Key Job Keywords",
      problem: "Submitting a generic resume to dozens of jobs leads to silent rejections because your CV lacks the specific phrasing and skill keywords listed in the job description.",
      solution: "Our real-time ATS matcher audits your resume against target job posts, identifying critical missing skills (e.g. AWS, CI/CD, React) and suggesting seamless optimizations.",
      icon: <Zap className="w-5 h-5" />
    }
  ];

  return (
    <main className="bg-black min-h-screen text-white pt-32 pb-24 relative overflow-hidden">
      {/* Schema Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* Background Decorative Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(0,255,156,0.05),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Geometric background accents */}
      <div className="absolute top-[15%] right-[-100px] w-80 h-80 bg-gradient-to-br from-[#c1ff23]/5 to-transparent border border-[#c1ff23]/10 rotate-45 rounded-[30px] blur-[1px] pointer-events-none hidden xl:block" />
      <div className="absolute bottom-[20%] left-[-100px] w-96 h-96 bg-gradient-to-tr from-[#00ff9c]/5 to-transparent border border-[#00ff9c]/10 rotate-45 rounded-[40px] blur-[2px] pointer-events-none hidden xl:block" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ClientMotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#00ff9c]/10 border border-[#00ff9c]/25 text-[#00ff9c] text-[10px] font-bold px-3.5 py-1.5 rounded-md uppercase tracking-wider mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#00ff9c] rotate-45 shrink-0" />
            Watch Product Demo
          </ClientMotionDiv>

          <ClientMotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight"
          >
            See ChatCV in Action
          </ClientMotionDiv>

          <ClientMotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed"
          >
            Struggling with resume formatting or applicant trackers? Watch how ChatCV translates conversations into professional, ATS-optimized LaTeX resumes in minutes.
          </ClientMotionDiv>
        </div>

        {/* DEMO VIDEO CONTAINER */}
        <ClientMotionDiv
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto mb-28"
        >
          <DemoVideoPlayer />
        </ClientMotionDiv>

        {/* COMPARATIVE PROBLEM VS SOLUTION SECTION */}
        <div className="mt-28 border-t border-white/5 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              What Does ChatCV Solve?
            </h2>
            <p className="mt-4 text-sm text-zinc-400">
              We redesigned the resume building workflow from the ground up to solve the three biggest problems job seekers face today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {problemsSolved.map((item, idx) => (
              <ClientMotionDiv
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative bg-zinc-950/40 border border-white/5 hover:border-[#00ff9c]/20 rounded-3xl p-6 flex flex-col justify-between group transition-all duration-500 shadow-xl"
              >
                <div>
                  {/* Badge Icon */}
                  <div className="w-10 h-10 bg-[#00ff9c]/10 border border-[#00ff9c]/20 text-[#00ff9c] flex items-center justify-center rounded-2xl mb-6 relative">
                    <div className="absolute inset-0 bg-[#00ff9c]/5 blur-md rounded-2xl group-hover:bg-[#00ff9c]/15 transition-all" />
                    {item.icon}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-5 group-hover:text-[#00ff9c] transition-colors">
                    {item.title}
                  </h3>

                  {/* Problem Card */}
                  <div className="mb-4 bg-red-950/15 border border-red-500/10 rounded-2xl p-4 flex gap-3">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-red-500 font-mono">The Pain</span>
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.problem}</p>
                    </div>
                  </div>

                  {/* Solution Card */}
                  <div className="bg-[#00ff9c]/5 border border-[#00ff9c]/10 rounded-2xl p-4 flex gap-3">
                    <CheckCircle className="w-4 h-4 text-[#00ff9c] shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#00ff9c] font-mono">The Fix</span>
                      <p className="text-xs text-zinc-300 leading-relaxed">{item.solution}</p>
                    </div>
                  </div>
                </div>

                {/* Sub-decorative accent */}
                <div className="absolute right-4 top-4 w-3 h-3 border border-[#00ff9c]/5 rotate-45 group-hover:border-[#00ff9c]/25 transition-all pointer-events-none" />
              </ClientMotionDiv>
            ))}
          </div>
        </div>

        {/* FAQs QUICK LOOK */}
        <div className="mt-32 border-t border-white/5 pt-20">
          <div className="max-w-4xl mx-auto bg-zinc-950/30 border border-white/5 rounded-3xl p-8 sm:p-12">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#00ff9c]" /> Quick Demo FAQ
            </h3>

            <div className="space-y-6 divide-y divide-white/5">
              <div className="pt-6 first:pt-0">
                <h4 className="text-sm font-semibold text-white mb-2">How exactly does the AI make the resume?</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  You interact with the ChatCV assistant in plain English, chatting about your responsibilities or achievements. The AI structures and refines your text on-the-fly, compiling it into beautiful, print-ready LaTeX templates.
                </p>
              </div>
              <div className="pt-6">
                <h4 className="text-sm font-semibold text-white mb-2">Is ChatCV really free?</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Yes, you can build and export your resume for free. We also offer premium features such as real-time job-tailoring checks, multiple layout templates, and deep resume audits.
                </p>
              </div>
              <div className="pt-6">
                <h4 className="text-sm font-semibold text-white mb-2">Why is LaTeX better than PDF builders?</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Standard PDF builders draw absolute coordinate boundaries, making fonts and layouts unparseable to Applicant Tracking Systems (ATS). LaTeX writes clean, semantic document structures that guarantee ATS parsers scan 100% of your experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA BANNER */}
        <div className="mt-32 text-center max-w-4xl mx-auto">
          <div className="w-10 h-10 bg-[#00ff9c]/10 border border-[#00ff9c]/25 text-[#00ff9c] flex items-center justify-center rounded-xl mx-auto rotate-45 mb-8 shadow-[0_0_12px_rgba(0,255,156,0.3)]">
            <Sparkles className="w-5 h-5 -rotate-45" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
            Ready to Try ChatCV Yourself?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Create an elegant, ATS-compliant LaTeX resume in minutes. No credit cards required, generous free tier included.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <button className="relative group bg-[#00ff9c] text-black px-8 py-3.5 rounded-xl font-bold text-sm shadow-[0_4px_20px_rgba(0,255,156,0.2)] overflow-hidden transition-transform active:scale-95 inline-flex items-center gap-2 cursor-pointer">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-1.5">
                  Build My Resume For Free <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </Link>

            <Link href="/features" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 font-semibold text-zinc-300 hover:text-white transition-all hover:bg-white/10 hover:border-white/20 text-sm">
              Explore All Features
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
