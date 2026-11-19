"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  MessageCircle,
  Calendar,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Scissors,
} from "lucide-react";
import { PassCard } from "@/components/apple-ui/PassCard";
import { AppleButton } from "@/components/apple-ui/AppleButton";
import { GlassCard } from "@/components/apple-ui/GlassCard";
import {
  buildBookingWhatsAppMessage,
  createWhatsAppLink,
} from "@/lib/whatsapp";

interface BookingTicketViewProps {
  booking: any;
  barbershopSlug: string;
}

export function BookingTicketView({
  booking,
  barbershopSlug,
}: BookingTicketViewProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Efeito de confetes festivo estilo iOS
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#D4AF37", "#FFFFFF", "#30D158"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#D4AF37", "#FFFFFF", "#30D158"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const messageText = buildBookingWhatsAppMessage({
    barbershopName: booking.barbershop.name,
    barbershopPhone: booking.barbershop.phone,
    clientName: booking.clientName,
    clientPhone: booking.clientPhone,
    bookingCode: booking.code,
    dateTime: booking.dateTime,
    services: booking.items.map((i: any) => i.service.name),
    totalAmount: booking.totalAmount,
    barberName: booking.barber?.name,
    address: booking.barbershop.address,
    pixKey: booking.barbershop.pixKey,
  });

  // Link para o cliente mandar para o WhatsApp da barbearia ou para seu próprio número
  const targetPhone = booking.barbershop.phone || booking.clientPhone;
  const whatsappUrl = createWhatsAppLink(targetPhone, messageText);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-lg mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${barbershopSlug}`}
          className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Barbearia</span>
        </Link>
        <span className="text-xs font-semibold text-amber-400">Passe Apple Wallet</span>
      </div>

      {/* Success Title */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-1">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Agendamento Confirmado!
        </h1>
        <p className="text-xs text-white/60">
          Seu horário foi reservado com sucesso na {booking.barbershop.name}.
        </p>
      </div>

      {/* Apple Pass Card */}
      <PassCard
        code={booking.code}
        barbershopName={booking.barbershop.name}
        barberName={booking.barber?.name}
        clientName={booking.clientName}
        clientPhone={booking.clientPhone}
        dateTime={booking.dateTime}
        services={booking.items.map((i: any) => ({
          name: i.service.name,
          price: i.price,
        }))}
        totalAmount={booking.totalAmount}
        address={booking.barbershop.address}
        status={booking.status}
      />

      {/* WhatsApp Action Buttons */}
      <div className="space-y-3 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <AppleButton variant="whatsapp" size="lg" className="w-full">
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Abrir no WhatsApp</span>
          </AppleButton>
        </a>

        <div className="grid grid-cols-2 gap-2.5">
          <AppleButton
            variant="secondary"
            size="md"
            onClick={copyToClipboard}
            className="w-full text-xs"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Resumo</span>
              </>
            )}
          </AppleButton>

          <Link href={`/${barbershopSlug}`} className="w-full">
            <AppleButton variant="outline" size="md" className="w-full text-xs">
              <Scissors className="w-4 h-4" />
              <span>Novo Horário</span>
            </AppleButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
