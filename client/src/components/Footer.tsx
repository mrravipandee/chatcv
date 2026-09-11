"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  const links = [
    { label: "Features", href: "/features" },
    { label: "How It Works", href: "/#how" },
    { label: "Demo", href: "/demo" },
    { label: "Pricing & Credits", href: "/#pricing" },
    { label: "Resume Examples", href: "/resume-examples" },
    { label: "Blog", href: "/blog" },
    { label: "Join Waitlist", href: "/subscribe" },
  ];

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#05070a] px-6 py-16 text-zinc-400 overflow-hidden">
      {/* Top subtle line glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-4xl bg-linear-to-r from-transparent via-emerald-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/chatcv.svg"
                alt="ChatCV logo"
                width={100}
                height={26}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              The modern conversational AI resume builder. Engineered with mathematical LaTeX typesetting to guarantee 100% ATS parser compliance.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Client-side persistent caching & privacy protection</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-7 flex flex-wrap gap-x-8 gap-y-3.5 items-center md:justify-end">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} ChatCV AI. All rights reserved.</p>

          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
            <span>for job seekers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}