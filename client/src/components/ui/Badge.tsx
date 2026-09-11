"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "glow";
  withDot?: boolean;
  icon?: React.ReactNode;
}

function Badge({
  className,
  variant = "default",
  withDot = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-white text-black font-semibold",
    secondary: "border-zinc-800 bg-zinc-900 text-zinc-300",
    destructive: "border-red-500/30 bg-red-500/10 text-red-400",
    outline: "border-zinc-800 text-zinc-300 bg-zinc-950/40",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    glow: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {withDot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge };
