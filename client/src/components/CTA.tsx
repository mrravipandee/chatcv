"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function CTA() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-[#050505] px-6 py-32 text-white"
    >
      {/* Intense Background Glow for Final Section */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full bg-[#00ff9c]/10 blur-[150px] opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-5xl group"
      >
        {/* Animated Border Gradient Holder */}
        <div className="absolute -inset-px rounded-[2.5rem] bg-linear-to-r from-[#00ff9c] via-[#c1ff23] to-[#00ff9c] opacity-20 group-hover:opacity-100 transition-opacity duration-700 blur-[2px]" />
        
        <div className="relative rounded-[2.5rem] bg-zinc-900/90 border border-white/5 px-8 py-20 text-center backdrop-blur-3xl overflow-hidden">
          
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          {/* Badge */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 mb-8 inline-flex items-center gap-2 rounded-full border border-[#00ff9c]/20 bg-[#00ff9c]/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#00ff9c]"
          >
            <Zap size={14} className="fill-[#00ff9c]" />
            Limited Early Access Slots
          </motion.div>

          {/* Heading */}
          <h2 className="relative z-10 text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight leading-[1.1]">
            Ready to build your <br />
            <span className="bg-linear-to-r from-[#00ff9c] to-[#c1ff23] bg-clip-text text-transparent">
              resume smarter?
            </span>
          </h2>

          {/* Description */}
          <p className="relative z-10 mx-auto mt-6 max-w-xl text-lg text-zinc-400 leading-relaxed">
            Stop wasting hours on formatting. Join the future of job hunting and let AI craft your path to success.
          </p>

          {/* Buttons */}
          <div className="relative z-10 mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link
              href="/subscribe"
              className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-[#00ff9c] px-10 py-4 font-bold text-black transition-all hover:shadow-[0_0_40px_rgba(0,255,156,0.4)] active:scale-95"
            >
              Join Waitlist
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="#features"
              className="rounded-2xl border border-white/10 bg-white/5 px-10 py-4 font-bold text-white transition-all hover:bg-white/10 hover:border-white/20"
            >
              How it Works
            </Link>
          </div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 mt-12 flex flex-col items-center gap-4"
          >
            <p className="text-sm text-zinc-500">
              Join <span className="text-white font-semibold">200+</span> others already on the list.
            </p>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="h-8 w-8 rounded-full border-2 border-zinc-900 bg-zinc-800" 
                  style={{ backgroundImage: `url('https://i.pravatar.cc/100?img=${i+10}')`, backgroundSize: 'cover' }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative side blobs */}
      <div className="absolute left-0 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-[#00ff9c]/5 blur-[100px]" />
      <div className="absolute right-0 top-1/2 h-64 w-64 translate-x-1/2 -translate-y-1/2 bg-[#c1ff23]/5 blur-[100px]" />
    </section>
  );
}