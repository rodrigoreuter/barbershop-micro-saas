"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Scissors,
  Smartphone,
  MessageCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Calendar,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/apple-ui/GlassCard";
import { AppleButton } from "@/components/apple-ui/AppleButton";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-amber-500/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-5 max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-apple-glow">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white">BarberSaaS</h1>
            <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">Apple Experience</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin">
            <AppleButton variant="secondary" size="sm">
              Painel Admin
            </AppleButton>
          </Link>
          <Link href="/royal-barber">
            <AppleButton variant="gold" size="sm">
              Ver Demo App
            </AppleButton>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-5 pt-8 sm:pt-16 pb-20 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-xs font-medium text-amber-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Micro SaaS MVP Especial para Barbearias Modernas</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            A Experiência <span className="apple-gold-text">Apple</span> para o Agendamento da sua Barbearia.
          </h2>

          <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-xl mx-auto">
            Design refinado estilo iOS para mobile, integração instantânea com WhatsApp, catálogo dinâmico de serviços/produtos e comprovante em formato de cartão Apple Wallet.
          </p>

          {/* Quick CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/royal-barber" className="w-full sm:w-auto">
              <AppleButton variant="gold" size="lg" className="w-full sm:w-auto">
                <Smartphone className="w-5 h-5" />
                <span>Testar App do Cliente (Mobile)</span>
                <ArrowRight className="w-4 h-4" />
              </AppleButton>
            </Link>

            <Link href="/admin" className="w-full sm:w-auto">
              <AppleButton variant="secondary" size="lg" className="w-full sm:w-auto">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <span>Acessar Painel do Barbeiro</span>
              </AppleButton>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid (Apple Glassmorphism) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <GlassCard variant="glow" className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">WhatsApp Integrado</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Confirmações de agendamento automáticas e lembrete em 1 clique pelo WhatsApp sem custo adicional de APIs.
            </p>
          </GlassCard>

          <GlassCard className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Apple Wallet Pass</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Comprovante elegante no formato de ticket digital com código exclusivo, horário e detalhes do corte.
            </p>
          </GlassCard>

          <GlassCard className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Catálogo & Produtos</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Apresente serviços com fotos, duração e vitrine de pomadas, óleos e produtos para aumentar o ticket médio.
            </p>
          </GlassCard>
        </div>

        {/* Live Preview Showcase */}
        <div className="pt-8">
          <GlassCard variant="gold" className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Pronto para uso imediato
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Barbearia Demonstrativa: The Royal Barber Club
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  Ambiente completo pré-carregado com 3 barbeiros, 5 serviços, 3 produtos e agenda integrada.
                </p>
              </div>

              <div className="flex gap-2">
                <Link href="/royal-barber">
                  <AppleButton variant="primary" size="md">
                    Experimentar Agendamento
                  </AppleButton>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Next.js 15 + Prisma</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Design System iOS</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Notificação WhatsApp</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>n8n Webhook Ready</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
