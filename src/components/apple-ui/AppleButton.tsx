"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AppleButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "gold" | "secondary" | "whatsapp" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  loading?: boolean;
}

export function AppleButton({
  children,
  variant = "primary",
  size = "md",
  className,
  loading = false,
  disabled,
  ...props
}: AppleButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer overflow-hidden";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5 font-medium",
    md: "px-5 py-3 text-sm gap-2 font-semibold",
    lg: "px-7 py-4 text-base gap-2.5 font-semibold",
  };

  const variants = {
    primary:
      "bg-white text-black hover:bg-neutral-200 active:bg-neutral-300 shadow-md",
    gold:
      "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black hover:brightness-105 active:brightness-95 shadow-apple-glow font-bold",
    secondary:
      "bg-[#2c2c30] text-white hover:bg-[#383840] border border-white/10 active:bg-[#252528]",
    whatsapp:
      "bg-[#25D366] text-white hover:bg-[#20ba5a] active:bg-[#1da851] shadow-lg shadow-emerald-950/40",
    outline:
      "bg-transparent text-white border border-white/20 hover:bg-white/10 active:bg-white/15",
    danger:
      "bg-[#FF453A]/15 text-[#FF453A] border border-[#FF453A]/30 hover:bg-[#FF453A]/25",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      disabled={disabled || loading}
      className={cn(baseStyles, sizeStyles[size], variants[variant], className)}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Carregando...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
