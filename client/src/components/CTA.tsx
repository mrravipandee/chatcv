"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";

export default function CTA() {
  return (
    <section id="cta" className="relative py-28 px-4 sm:px-6 bg-[#030712] text-white overflow-hidden">
      {/* Background Central Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-emerald-500/15 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 sm:p-14 text-center backdrop-blur-2xl shadow-2xl overflow-hidden"
        >
          {/* Top Edge Specular Shimmer */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/50 to-transparent" />

          {/* Badge */}
          <div className="inline-block mb-6">
            <Badge variant="glow" withDot>
              Limited Early Access
            </Badge>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-2xl mx-auto">
            Ready to build your <br />
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              career-defining resume?
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Stop losing job applications to unformatted Word templates. Join 40,000+ candidates landing top tech interviews with ChatCV.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/subscribe" className="w-full sm:w-auto">
              <Button
                variant="glow"
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Join Waitlist Free (Get 10 Credits)
              </Button>
            </Link>

            <Link href="/demo" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-zinc-300">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-10 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>99.4% First-Pass ATS Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Encrypted & Never Sold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Instant Download</span>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}