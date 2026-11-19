"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "subtle" | "glow" | "gold";
  clickable?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = "default",
  clickable = false,
  ...props
}: GlassCardProps) {
  const variants = {
    default: "bg-[#16161a]/80 border-white/10 backdrop-blur-xl shadow-apple",
    subtle: "bg-[#1c1c20]/50 border-white/5 backdrop-blur-md",
    glow: "bg-[#16161a]/90 border-amber-500/20 backdrop-blur-2xl shadow-apple-glow",
    gold: "bg-gradient-to-b from-[#221e14]/90 to-[#16161a]/90 border-amber-500/30 backdrop-blur-2xl shadow-apple-glow",
  };

  return (
    <motion.div
      whileTap={clickable ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "rounded-apple-md border p-4 text-white transition-colors",
        variants[variant],
        clickable && "cursor-pointer hover:border-white/20 active:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
