"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "glow";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles = {
  default:
    "bg-white text-black hover:bg-zinc-200 shadow-md font-medium border border-transparent",
  destructive:
    "bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30",
  outline:
    "border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-200 hover:text-white hover:border-zinc-700",
  secondary:
    "bg-zinc-800/80 text-zinc-100 hover:bg-zinc-700/80 border border-zinc-700/50",
  ghost:
    "hover:bg-zinc-800/50 text-zinc-300 hover:text-white border border-transparent",
  link: "text-emerald-400 underline-offset-4 hover:underline border-none p-0 h-auto",
  glow: "relative bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] border border-emerald-300/40",
};

const sizeStyles = {
  default: "h-10 px-4 py-2 text-sm rounded-xl gap-2",
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5",
  icon: "h-9 w-9 p-0 rounded-xl justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? {} : { scale: 1.02 }}
        whileTap={isDisabled ? {} : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
