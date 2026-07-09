"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, FileText, CheckCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ResumePreviewWidgetProps {
  roleName: string;
  latexCode: string;
  skills: string[];
}

export default function ResumePreviewWidget({
  roleName,
  latexCode,
  skills,
}: ResumePreviewWidgetProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "latex">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopyLatex = async () => {
    try {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy LaTeX code: ", err);
    }
  };

  return (
    <div className="w-full bg-zinc-950/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl my-8">
      {/* HEADER CONTROLS */}
      <div className="bg-zinc-900/80 px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#00ff9c]/10 border border-[#00ff9c]/20 p-2 rounded-lg text-[#00ff9c]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {roleName} Resume Template
            </h4>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
              LaTeX Format & Preview
            </p>
          </div>
        </div>

        {/* TAB TOGGLES */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("preview")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "preview"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab("latex")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "latex"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            LaTeX Source
          </button>
        </div>
      </div>

      {/* CONTENT TAB BODY */}
      <div className="p-6 bg-zinc-950">
        {activeTab === "preview" ? (
          <div className="border border-white/5 rounded-xl bg-zinc-900/30 p-6 flex flex-col gap-6 relative overflow-hidden">
            {/* Background watermarks */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#00ff9c]/[0.01] blur-2xl rounded-full pointer-events-none" />

            {/* MOCK RESUME DOCUMENT */}
            <div className="flex flex-col text-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white tracking-wide">
                ALEX MORGAN
              </h3>
              <p className="text-[10px] text-zinc-400 mt-1">
                New York, NY | (555) 019-2834 | alex.morgan@example.com
              </p>
            </div>

            {/* SUMMARY */}
            <div>
              <h5 className="text-[10px] uppercase font-bold text-[#00ff9c] tracking-widest mb-1.5">
                Professional Summary
              </h5>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Highly motivated {roleName} with a proven record of optimizing workflows, executing data-driven solutions, and driving user adoption across web services.
              </p>
            </div>

            {/* SKILLS CHIPS */}
            <div>
              <h5 className="text-[10px] uppercase font-bold text-[#00ff9c] tracking-widest mb-2">
                Core Competencies
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 8).map((skill, index) => (
                  <span
                    key={index}
                    className="text-[10px] font-medium bg-zinc-900 border border-white/5 px-2 py-1 rounded text-zinc-300 flex items-center gap-1"
                  >
                    <CheckCircle className="w-2.5 h-2.5 text-[#00ff9c]" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* EXPERIENCE SUMMARY SECTION */}
            <div>
              <h5 className="text-[10px] uppercase font-bold text-[#00ff9c] tracking-widest mb-2">
                Selected Accomplishments
              </h5>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-zinc-400 leading-relaxed">
                <li>Designed workflow components using React & TypeScript, boosting site loading metrics by 30%.</li>
                <li>Collaborated with design and analytics teams to implement A/B tests that enhanced signup rates by 12%.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="relative">
            <pre className="text-[11px] text-zinc-400 font-mono bg-zinc-900/60 border border-white/5 p-4 rounded-xl max-h-60 overflow-y-auto overflow-x-auto whitespace-pre leading-relaxed scrollbar-thin">
              <code>{latexCode}</code>
            </pre>
            <button
              onClick={handleCopyLatex}
              className="absolute top-3 right-3 bg-black/60 backdrop-blur border border-white/10 hover:border-white/20 hover:bg-black p-2 rounded-lg text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00ff9c]" />
                  <span className="text-[10px] text-[#00ff9c]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Copy Code</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* FOOTER CTA BAR */}
      <div className="bg-zinc-900/60 border-t border-white/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-400 text-center sm:text-left">
          Want this template formatted as an ATS-compliant PDF?
        </p>
        <Link href="/dashboard" className="w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-[#00ff9c] text-black font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(0,255,156,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customize Resume with AI</span>
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
