"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "./Badge";

export interface SectionHeaderProps {
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  gradientText?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  badgeText,
  badgeIcon,
  title,
  gradientText,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`max-w-3xl ${isCenter ? "mx-auto text-center" : "text-left"} mb-14 md:mb-20 ${className}`}
    >
      {badgeText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-block"
        >
          <Badge variant="glow" icon={badgeIcon} withDot>
            {badgeText}
          </Badge>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
      >
        {title}{" "}
        {gradientText && (
          <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            {gradientText}
          </span>
        )}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className={`mt-5 text-base sm:text-lg text-zinc-400 leading-relaxed ${
            isCenter ? "mx-auto max-w-2xl" : "max-w-xl"
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
