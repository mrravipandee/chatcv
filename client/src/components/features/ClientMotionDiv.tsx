"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface ClientMotionDivProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export default function ClientMotionDiv({
  children,
  ...props
}: ClientMotionDivProps) {
  return (
    <motion.div {...props}>
      {children}
    </motion.div>
  );
}
