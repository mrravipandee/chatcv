"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function AnimatedGradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient font-extrabold",
        className
      )}
    >
      {children}
    </span>
  );
}
