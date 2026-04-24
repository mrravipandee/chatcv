"use client";

import { motion } from "framer-motion";
import {
  Bot,
  FileCheck,
  Download,
  PenSquare,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Bot size={24} />,
      title: "AI Resume Writing",
      desc: "Our LLM-powered engine generates industry-specific content that highlights your unique strengths.",
    },
    {
      icon: <PenSquare size={24} />,
      title: "Chat-Based Editing",
      desc: "Forget dragging blocks. Simply say 'Add my React internship' and watch ChatCV update in real-time.",
    },
    {
      icon: <FileCheck size={24} />,
      title: "ATS Optimization",
      desc: "Every resume is structured to pass through Applicant Tracking Systems, ensuring you get seen by humans.",
    },
    {
      icon: <Download size={24} />,
      title: "Instant PDF Export",
      desc: "Download high-resolution, print-ready PDFs in seconds. Multiple professional themes included.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Secure Data",
      desc: "Your data is encrypted and private. We never sell your personal information to third parties.",
    },
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      desc: "Go from blank page to a finished, professional resume in under 5 minutes. No kidding.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#050505] px-6 py-32 text-white"
    >
      {/* Background Polish */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-[-10%] top-[10%] h-125 w-125 rounded-full bg-[#00ff9c]/5 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[10%] h-125 w-125 rounded-full bg-[#c1ff23]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00ff9c]/20 bg-[#00ff9c]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#00ff9c]"
          >
            <Sparkles size={14} />
            Supercharged Features
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight"
          >
            Built for the{" "}
            <span className="bg-linear-to-r from-[#00ff9c] to-[#c1ff23] bg-clip-text text-transparent">
              Modern Job Seeker
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-zinc-400 text-lg leading-relaxed"
          >
            Powerful tools designed to make resume building faster, smarter, and
            completely stress-free.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-4xl border border-white/5 bg-zinc-900/20 p-8 transition-all hover:border-[#00ff9c]/30 hover:bg-zinc-900/40"
            >
              {/* Subtle Gradient Hover background */}
              <div className="absolute -inset-px bg-linear-to-br from-[#00ff9c]/10 via-transparent to-[#c1ff23]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Icon Container */}
              <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-[#00ff9c] transition-colors group-hover:bg-[#00ff9c] group-hover:text-black">
                {item.icon}
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold transition-colors group-hover:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-300">
                  {item.desc}
                </p>
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-[#00ff9c]/5 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}