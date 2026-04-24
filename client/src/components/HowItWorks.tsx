"use client";

import { motion } from "framer-motion";
import { MessageSquareText, Sparkles, Download, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <MessageSquareText size={24} />,
      title: "Tell Your Story",
      desc: "Share your skills, experience, and career goals through a natural, intuitive chat interface.",
      accent: "#00ff9c"
    },
    {
      icon: <Sparkles size={24} />,
      title: "AI Builds Resume",
      desc: "ChatCV intelligently transforms your conversation into a polished, ATS-optimized masterpiece.",
      accent: "#c1ff23"
    },
    {
      icon: <Download size={24} />,
      title: "Download & Apply",
      desc: "Export your professional resume as a PDF and start landing interviews with confidence.",
      accent: "#00ff9c"
    },
  ];

  return (
    <section
      id="how"
      className="relative overflow-hidden bg-[#050505] px-6 py-32 text-white"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-[10%] top-[20%] h-96 w-96 rounded-full bg-[#00ff9c]/5 blur-[120px]" />
        <div className="absolute right-[10%] bottom-[20%] h-96 w-96 rounded-full bg-[#c1ff23]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff9c]/20 bg-[#00ff9c]/5 text-[#00ff9c] text-xs font-bold uppercase tracking-widest mb-6">
            <CheckCircle2 size={14} />
            The Process
          </div>

          <h2 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight">
            Resume creation, <br />
            <span className="bg-linear-to-r from-[#00ff9c] to-[#c1ff23] bg-clip-text text-transparent">
              reinvented.
            </span>
          </h2>

          <p className="mt-6 text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
            Forget complex builders. Experience the simplest way to create a career-defining resume.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="group relative rounded-[2.5rem] border border-white/5 bg-zinc-900/20 p-10 backdrop-blur-3xl transition-all duration-500 hover:border-[#00ff9c]/30 hover:bg-zinc-900/40"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                <div className="absolute inset-0 translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/5 to-transparent" />
              </div>

              {/* Icon Container */}
              <div 
                className="relative mb-8 flex h-16 w-16 items-center justify-center rounded-2xl text-black shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                style={{ background: `linear-gradient(135deg, #00ff9c, #c1ff23)` }}
              >
                {step.icon}
                {/* Number Badge */}
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black border border-white/10 text-[#00ff9c] text-[10px] font-bold flex items-center justify-center">
                  0{index + 1}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4 group-hover:text-[#00ff9c] transition-colors">
                {step.title}
              </h3>

              <p className="text-zinc-500 leading-relaxed group-hover:text-zinc-300 transition-colors">
                {step.desc}
              </p>

              {/* Bottom Glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-linear-to-r from-transparent via-[#00ff9c]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}