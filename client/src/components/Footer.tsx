"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#050505] px-6 py-16 text-white overflow-hidden">
      {/* Subtle Top Divider Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-5xl bg-linear-to-r from-transparent via-[#00ff9c]/30 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-7xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div>
                <Image src="./chatcv.svg" alt="ChatCV logo" width={100} height={24} className="h-12 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-sm text-zinc-500 max-w-xs">
              AI-powered resume builder designed for the modern job market.
            </p>
          </div>

          {/* Direct Navigation */}
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {['Features', 'How it Works', 'Waitlist'].map((item) => (
              <Link 
                key={item}
                href={item === 'Waitlist' ? "/subscribe" : `#${item.toLowerCase().replace(/\s+/g, '')}`} 
                className="text-sm text-zinc-400 hover:text-[#00ff9c] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/5 pt-8 md:flex-row gap-4">
          <p className="text-xs text-zinc-600">
            © 2026 ChatCV AI. All rights reserved.
          </p>
          
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <span>Built with</span>
            <Heart size={12} className="text-[#00ff9c] fill-[#00ff9c]/20" />
            <span>in Bengaluru, India</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}