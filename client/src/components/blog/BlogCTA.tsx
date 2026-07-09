"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, ArrowRight } from "lucide-react";

interface BlogCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  type?: 'banner' | 'card' | 'sidebar' | 'interactive';
}

export default function BlogCTA({
  title = "Build an ATS-Friendly Resume in 5 Minutes",
  description = "Stop wrestling with formats. Chat with ChatCV's AI assistant and create a professional, recruiter-ready LaTeX resume instantly.",
  buttonText = "Build Your Resume for Free",
  buttonLink = "/dashboard",
  type = "card"
}: BlogCTAProps) {

  if (type === "sidebar") {
    return (
      <div className="w-full bg-gradient-to-b from-[#00ff9c]/10 to-zinc-900/40 backdrop-blur-md border border-[#00ff9c]/20 rounded-2xl p-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#00ff9c] opacity-20 blur-2xl rounded-full" />
        
        <div className="relative z-10 flex flex-col">
          <div className="bg-[#00ff9c]/10 border border-[#00ff9c]/30 w-fit p-2 rounded-xl mb-4 text-[#00ff9c]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2 leading-tight">
            {title}
          </h4>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            {description}
          </p>
          <Link href={buttonLink}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#00ff9c] text-black font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(0,255,156,0.25)] hover:shadow-[0_4px_30px_rgba(0,255,156,0.4)] transition-all"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  if (type === "banner") {
    return (
      <div className="w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl my-10">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-[#00ff9c]/[0.02] mix-blend-color-dodge pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#00ff9c] opacity-5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#00ff9c] font-bold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              ChatCV Resume Maker
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-zinc-400">
              {description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href={buttonLink}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#00ff9c] text-black font-bold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-[0_4px_20px_rgba(0,255,156,0.3)]"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT CARD (Centered Card suitable for insertion in-between paragraphs)
  return (
    <div className="w-full bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 my-8 relative overflow-hidden flex flex-col items-center text-center">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#00ff9c]/50 to-transparent" />
      <div className="absolute -bottom-24 w-80 h-80 bg-[#00ff9c]/5 blur-[80px] rounded-full" />

      <div className="bg-[#00ff9c]/10 border border-[#00ff9c]/20 p-3 rounded-2xl mb-4 text-[#00ff9c]">
        <MessageSquare className="w-6 h-6" />
      </div>

      <h3 className="text-xl md:text-2xl font-black text-white mb-3 max-w-lg">
        {title}
      </h3>
      
      <p className="text-sm text-zinc-400 mb-6 max-w-xl leading-relaxed">
        {description}
      </p>

      <Link href={buttonLink}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#00ff9c] text-black font-bold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-[0_4px_25px_rgba(0,255,156,0.2)] hover:shadow-[0_4px_30px_rgba(0,255,156,0.4)] transition-all"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </Link>
    </div>
  );
}
