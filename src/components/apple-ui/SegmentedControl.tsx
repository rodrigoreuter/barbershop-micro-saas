"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SegmentOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  selectedId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  selectedId,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "relative flex items-center p-1 rounded-full bg-[#1c1c20]/80 border border-white/10 backdrop-blur-lg",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium rounded-full transition-colors z-10",
              isSelected ? "text-white font-semibold" : "text-white/60 hover:text-white"
            )}
          >
            {option.icon && <span className="text-current">{option.icon}</span>}
            <span>{option.label}</span>
            {typeof option.count === "number" && (
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.5 rounded-full text-[10px]",
                  isSelected ? "bg-white/20 text-white" : "bg-white/10 text-white/60"
                )}
              >
                {option.count}
              </span>
            )}
            {isSelected && (
              <motion.div
                layoutId="segmented-active"
                className="absolute inset-0 bg-[#2c2c30] rounded-full -z-10 shadow-md border border-white/15"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
