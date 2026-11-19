"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicIslandProps {
  isOpen?: boolean;
  openingTime?: string;
  closingTime?: string;
  statusText?: string;
  className?: string;
}

export function DynamicIsland({
  isOpen = true,
  openingTime = "09:00",
  closingTime = "20:00",
  statusText,
  className,
}: DynamicIslandProps) {
  return (
    <div className={cn("fixed top-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none", className)}>
      <motion.div
        initial={{ y: -30, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="pointer-events-auto flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/85 border border-white/15 backdrop-blur-2xl shadow-2xl text-xs font-medium text-white/90"
      >
        <span className="relative flex h-2 w-2">
          {isOpen ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          )}
        </span>

        {statusText ? (
          <span>{statusText}</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className={isOpen ? "text-emerald-400" : "text-amber-400"}>
              {isOpen ? "Aberto agora" : "Fechado"}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-white/60">
              {isOpen ? `Fecha às ${closingTime}` : `Abre às ${openingTime}`}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
