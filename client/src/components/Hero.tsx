"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white flex items-center">
      {/* Background Polish */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 left-[10%] h-100 w-100 rounded-full bg-[#00ff9c] blur-[120px]" 
        />
        <motion.div 
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-20 right-[10%] h-100 w-100 rounded-full bg-[#c1ff23] blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-6 py-24 lg:flex-row lg:gap-14">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full text-center lg:w-1/2 lg:text-left"
        >
          {/* Badge */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[#00ff9c] backdrop-blur-xl"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Next-Gen AI Resume Builder</span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Build Your Resume <br />
            <span className="bg-linear-to-r from-[#00ff9c] via-[#c1ff23] to-[#00ff9c] bg-clip-text text-transparent bg-size-[200%_auto] animate-gradient">
              By Chatting
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl mx-auto lg:mx-0">
            Stop struggling with templates. Just describe your work history to our AI and get a professional, ATS-optimized resume in minutes.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row lg:items-start">
            <Link
              href="/subscribe"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-[#00ff9c] px-8 py-4 font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(0,255,156,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Join Waitlist <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20"
            >
              Explore Features
            </Link>
          </div>
        </motion.div>

        {/* Right Side - Interactive Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mt-16 w-full lg:mt-0 lg:w-1/2 perspective-1000"
        >
          <div className="relative group rounded-3xl border border-white/10 bg-zinc-900/40 p-6 shadow-2xl backdrop-blur-3xl transform-gpu transition-transform hover:rotate-1 hover:-translate-y-2">
            
            {/* Mockup Header */}
            <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-[#00ff9c]/50" />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono flex items-center gap-2">
                <Terminal size={12} /> AI Session Active
              </div>
            </div>

            {/* Chat Flow */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#00ff9c] px-4 py-3 text-sm font-semibold text-black shadow-lg"
              >
                Write a resume for a Full Stack Dev role with Node.js and React.
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-800/80 px-4 py-3 text-sm text-zinc-200 border border-white/5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#00ff9c]" />
                  <span className="font-bold text-[11px] uppercase text-[#00ff9c]">ChatCV AI</span>
                </div>
                Perfect. I&apos;ve optimized your experience for ATS. Here is your preview!
              </motion.div>

              {/* Floating Resume Preview Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-4 rounded-xl bg-white p-5 shadow-2xl overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="h-4 w-32 bg-zinc-200 rounded-md mb-2" />
                    <div className="h-2 w-48 bg-zinc-100 rounded-sm" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-[#00ff9c]/20 flex items-center justify-center">
                    <CheckCircleIcon />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-zinc-100 rounded" />
                  <div className="h-1.5 w-[90%] bg-zinc-100 rounded" />
                  <div className="h-1.5 w-[40%] bg-[#00ff9c]/30 rounded" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Simple internal icon for the resume preview
function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff9c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}