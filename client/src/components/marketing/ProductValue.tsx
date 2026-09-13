"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileCode, Shield, Zap, RefreshCw } from "lucide-react";

export default function ProductValue() {
  const values = [
    {
      icon: <FileCode className="w-5 h-5 text-[#00ff9c]" />,
      title: "Deterministic LaTeX Typesetting",
      description:
        "Standard pdflatex templates ensure your margins, fonts, and headings never shift, wrap awkwardly, or break across pages.",
    },
    {
      icon: <Shield className="w-5 h-5 text-[#00ff9c]" />,
      title: "Parser-First Single Column Architecture",
      description:
        "Designed without complex HTML tables, multi-column blocks, or embedded images that choke applicant tracking systems.",
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-[#00ff9c]" />,
      title: "Full .tex Code Portability",
      description:
        "Never get locked into a proprietary builder. Copy and modify your raw LaTeX code inside Overleaf anytime you want.",
    },
    {
      icon: <Zap className="w-5 h-5 text-[#00ff9c]" />,
      title: "Live WebSocket Compilation",
      description:
        "Watch your updates compile into high-resolution vector PDF in real time via live streaming server updates.",
    },
  ];

  return (
    <section className="py-12 border-y border-white/[0.06] bg-[#070b10] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {values.map((v, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col space-y-2.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-[#00ff9c]/20 hover:bg-white/[0.04] transition-colors duration-300"
            >
              <div className="p-2 w-fit rounded-xl bg-[#00ff9c]/10 border border-[#00ff9c]/20 mb-1">
                {v.icon}
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {v.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {v.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
