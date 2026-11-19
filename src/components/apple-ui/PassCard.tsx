"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scissors, Calendar, Clock, MapPin, CheckCircle2, User, QrCode, Share2 } from "lucide-react";
import { formatCurrency, formatPhoneNumber } from "@/lib/utils";

interface PassCardProps {
  code: string;
  barbershopName: string;
  barberName?: string | null;
  clientName: string;
  clientPhone: string;
  dateTime: Date | string;
  services: { name: string; price: number }[];
  totalAmount: number;
  address?: string | null;
  status?: string;
}

export function PassCard({
  code,
  barbershopName,
  barberName,
  clientName,
  clientPhone,
  dateTime,
  services,
  totalAmount,
  address,
  status = "CONFIRMED",
}: PassCardProps) {
  const dateObj = typeof dateTime === "string" ? new Date(dateTime) : dateTime;

  const dateFormatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(dateObj);

  const timeFormatted = dateObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="relative w-full max-w-sm mx-auto overflow-hidden rounded-[28px] bg-gradient-to-b from-[#1f1e24] via-[#16161a] to-[#121215] border border-amber-500/30 shadow-2xl text-white"
    >
      {/* Top Header Glow */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600" />

      {/* Pass Header */}
      <div className="p-5 pb-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Passe de Atendimento</h4>
            <h3 className="text-sm font-semibold text-white truncate">{barbershopName}</h3>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Confirmado</span>
        </div>
      </div>

      {/* Pass Body */}
      <div className="p-5 space-y-4">
        {/* Date & Time Big Display */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/5">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/50 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400" /> Data
            </span>
            <p className="text-base font-bold text-white capitalize mt-0.5">{dateFormatted}</p>
          </div>
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/50 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> Horário
            </span>
            <p className="text-base font-bold text-amber-300 mt-0.5">{timeFormatted}</p>
          </div>
        </div>

        {/* Client & Barber */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-white/40 uppercase tracking-wider text-[10px]">Cliente</span>
            <p className="font-medium text-white truncate mt-0.5">{clientName}</p>
            <p className="text-[11px] text-white/60">{formatPhoneNumber(clientPhone)}</p>
          </div>
          <div>
            <span className="text-white/40 uppercase tracking-wider text-[10px]">Profissional</span>
            <p className="font-medium text-white truncate mt-0.5">{barberName || "Qualquer Barbeiro"}</p>
          </div>
        </div>

        {/* Services List */}
        <div className="pt-2 border-t border-white/10">
          <span className="text-white/40 uppercase tracking-wider text-[10px] block mb-2">Serviços Selecionados</span>
          <div className="space-y-1.5">
            {services.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-white/90">{item.name}</span>
                <span className="font-semibold text-white/80">{formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <span className="text-xs font-semibold text-white/70">Total a pagar no local</span>
          <span className="text-lg font-extrabold text-amber-400">{formatCurrency(totalAmount)}</span>
        </div>

        {address && (
          <div className="flex items-start gap-2 pt-1 text-[11px] text-white/50">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{address}</span>
          </div>
        )}
      </div>

      {/* Perforated Apple Pass Tear Line */}
      <div className="relative flex items-center justify-between px-2">
        <div className="w-4 h-8 rounded-r-full bg-[#0a0a0c] -ml-2 border-r border-y border-white/10" />
        <div className="w-full border-t-2 border-dashed border-white/15 mx-2" />
        <div className="w-4 h-8 rounded-l-full bg-[#0a0a0c] -mr-2 border-l border-y border-white/10" />
      </div>

      {/* Pass Footer with Code & Barcode Look */}
      <div className="p-5 pt-3 bg-black/40 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Código:</span>
          <span className="text-xs font-bold text-amber-400 font-mono tracking-wider">{code}</span>
        </div>

        {/* Simulated Barcode Graphic */}
        <div className="flex justify-center items-center gap-[2px] h-9 py-1 opacity-70 px-6">
          {[3, 1, 4, 1, 5, 2, 1, 3, 2, 4, 1, 2, 5, 3, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4].map((w, i) => (
            <div
              key={i}
              className="h-full bg-white rounded-xs"
              style={{ width: `${w * 1.5}px` }}
            />
          ))}
        </div>
        <p className="text-[10px] text-white/40">Apresente este passe no momento do atendimento</p>
      </div>
    </motion.div>
  );
}
