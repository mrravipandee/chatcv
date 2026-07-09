"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Copy, Check, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ResumeSummaryGeneratorProps {
  initialRole?: string;
  initialSkills?: string;
}

export default function ResumeSummaryGenerator({
  initialRole = "Software Engineer",
  initialSkills = "React, TypeScript, Node.js"
}: ResumeSummaryGeneratorProps) {
  const [role, setRole] = useState(initialRole);
  const [skills, setSkills] = useState(initialSkills);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);

  const simulateGeneration = () => {
    if (!role || !skills) return;
    setIsGenerating(true);
    setGeneratedText("");

    // Mock generated results based on inputs
    const mockSummaries = [
      `Results-driven ${role} with expertise in ${skills}. Proven track record of developing scalable applications, optimizing front-end performance, and writing clean, maintainable code. Adept at working in collaborative, Agile teams to deliver high-quality solutions that improve user experience and support business growth.`,
      `Detail-oriented ${role} specializing in ${skills}. Over 4 years of experience building secure web services and implementing responsive UI dashboards. Committed to leverage industry-standard development patterns and collaborating across functional teams to deliver robust software features.`,
      `Innovative and collaborative ${role} with strong capabilities in ${skills}. Experienced in system design, database management, and automating testing environments. Adept at translating user feedback and feature requests into optimized, scalable code configurations.`
    ];

    const randomIndex = Math.floor(Math.random() * mockSummaries.length);
    const selectedText = mockSummaries[randomIndex];

    // Simulate typing effect after a brief loading state
    setTimeout(() => {
      setIsGenerating(false);
      
      let i = 0;
      const interval = setInterval(() => {
        setGeneratedText((prev) => prev + selectedText.charAt(i));
        i++;
        if (i >= selectedText.length) {
          clearInterval(interval);
        }
      }, 15);
    }, 1500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy summary: ", err);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 my-8 relative overflow-hidden shadow-2xl">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#00ff9c] opacity-5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#00ff9c] opacity-5 blur-3xl pointer-events-none rounded-full" />

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-[#00ff9c]" />
        <h4 className="text-base font-extrabold text-white">
          AI Resume Summary Generator
        </h4>
        <span className="text-[9px] bg-[#00ff9c]/10 text-[#00ff9c] border border-[#00ff9c]/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Interactive Lead Magnet
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* INPUT PANEL */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Target Job Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00ff9c]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Core Skills / Keywords
            </label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, SQL"
              rows={2}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00ff9c]/50 transition-colors resize-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={simulateGeneration}
            disabled={isGenerating || !role || !skills}
            className="w-full bg-[#00ff9c] text-black font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,255,156,0.15)] disabled:opacity-50 disabled:pointer-events-none hover:shadow-[0_4px_25px_rgba(0,255,156,0.35)] transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI is writing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Generate Resume Summary</span>
              </>
            )}
          </motion.button>
        </div>

        {/* OUTPUT PANEL */}
        <div className="flex flex-col h-full min-h-[195px] bg-black/50 border border-white/5 rounded-2xl p-5 relative overflow-hidden justify-between">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center flex-grow"
              >
                {/* Simulated typing animation dots */}
                <div className="flex space-x-1.5 mb-3">
                  <div className="w-2.5 h-2.5 bg-[#00ff9c] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2.5 h-2.5 bg-[#00ff9c] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2.5 h-2.5 bg-[#00ff9c] rounded-full animate-bounce"></div>
                </div>
                <p className="text-xs text-zinc-400 font-medium">
                  Analyzing skills & crafting summary sentences...
                </p>
              </motion.div>
            ) : generatedText ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col justify-between flex-grow"
              >
                <div className="relative group">
                  <p className="text-xs text-zinc-300 leading-relaxed pr-8 font-serif italic">
                    &ldquo;{generatedText}&rdquo;
                  </p>
                  
                  <button
                    onClick={handleCopy}
                    className="absolute top-0 right-0 p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Copy to Clipboard"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-[#00ff9c]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* CALL TO ACTION EMBED */}
                <div className="mt-5 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[10px] text-zinc-500 font-medium">
                    Satisfied? Save and compile details in your CV
                  </span>
                  
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <button className="w-full bg-zinc-900 border border-white/10 hover:border-[#00ff9c]/30 text-[10px] font-bold py-2 px-3 rounded-lg text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-1">
                      <span>Import into ChatCV</span>
                      <ArrowRight className="w-3 h-3 text-[#00ff9c]" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center flex-grow"
              >
                <Sparkles className="w-8 h-8 text-zinc-700 mb-2" />
                <p className="text-xs text-zinc-500 max-w-[200px]">
                  Fill in your target role and skills and click generate.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
