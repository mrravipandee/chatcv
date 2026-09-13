"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Product Preview", href: "#showcase" },
    { label: "Pricing & Plans", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const resourceLinks = [
    { label: "Engineering Blog", href: "/blog" },
    { label: "Resume Examples Directory", href: "/resume-examples" },
    { label: "Interactive Demo", href: "/demo" },
    { label: "RSS Feed", href: "/feed.xml" },
  ];

  const workspaceLinks = [
    { label: "Start Building Free", href: "/register" },
    { label: "Sign In", href: "/login" },
    { label: "Workspace Dashboard", href: "/dashboard" },
    { label: "Early Access Updates", href: "/subscribe" },
  ];

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#05070a] px-4 sm:px-6 lg:px-8 py-16 text-zinc-400">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/chatcv.svg"
                alt="ChatCV Logo"
                width={100}
                height={26}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed font-normal">
              The conversational AI resume builder. Engineered with deterministic LaTeX typesetting to deliver clean, ATS-compliant resumes in seconds.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#00ff9c] font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-[#00ff9c]" />
              <span>Standard single-column vector output • Overleaf compatible</span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Product */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Product
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Resources
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Workspace */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Workspace
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {workspaceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {currentYear} ChatCV. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Deterministic pdflatex engine</span>
            <span>Zero table traps</span>
          </div>
        </div>
      </div>
    </footer>
  );
}