"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Check if user is already authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) setHasToken(true);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Product Preview", href: "#showcase" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      {/* Scroll Progress Indicator Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#00ff9c] via-teal-300 to-[#00ff9c] origin-left z-[60] shadow-[0_0_10px_rgba(0,255,156,0.8)]"
        style={{ scaleX }}
      />

      <header className="fixed top-0 inset-x-0 z-50 flex justify-center p-3 sm:p-4">
      <nav
        aria-label="Main Navigation"
        className="w-full max-w-5xl rounded-2xl border border-white/[0.08] bg-[#0b1016]/85 px-4 py-2.5 backdrop-blur-xl shadow-2xl transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff9c]/50 rounded-lg p-0.5"
          >
            <Image
              src="/chatcv.svg"
              alt="ChatCV Logo"
              width={90}
              height={24}
              className="h-7 w-auto object-contain transition-opacity group-hover:opacity-85"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff9c]/50 rounded py-1 px-1"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {hasToken ? (
              <Link href="/dashboard">
                <Button
                  variant="glow"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Go to Workspace
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-block">
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>

                <Link href="/register">
                  <Button
                    variant="glow"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Start Building Free
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff9c]/50"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden pt-4 pb-2 border-t border-white/[0.08] mt-3 space-y-1"
            >
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                {!hasToken && (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg transition-colors border border-white/10"
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  href={hasToken ? "/dashboard" : "/register"}
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <Button variant="glow" size="sm" className="w-full justify-center">
                    {hasToken ? "Go to Workspace" : "Start Building Free"}
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
    </>
  );
}