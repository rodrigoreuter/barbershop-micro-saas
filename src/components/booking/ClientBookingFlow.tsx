"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  ShoppingBag,
  Info,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Star,
  Check,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { GlassCard } from "@/components/apple-ui/GlassCard";
import { SegmentedControl } from "@/components/apple-ui/SegmentedControl";
import { AppleButton } from "@/components/apple-ui/AppleButton";
import { DynamicIsland } from "@/components/apple-ui/DynamicIsland";
import { formatCurrency, formatPhoneNumber } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  category: string;
  image: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  stock: number;
}

interface Barber {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  rating: number;
}

interface Barbershop {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  address: string | null;
  phone: string | null;
  instagram: string | null;
  openingTime: string;
  closingTime: string;
  slotInterval: number;
  services: Service[];
  products: Product[];
  barbers: Barber[];
}

export function ClientBookingFlow({ barbershop }: { barbershop: Barbershop }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("services");
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [currentStep, setCurrentStep] = useState<"catalog" | "datetime" | "checkout">("catalog");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("Todos");

  // Categorias de serviços
  const categories = useMemo(() => {
    const cats = Array.from(new Set(barbershop.services.map((s) => s.category)));
    return ["Todos", ...cats];
  }, [barbershop.services]);

  // Filtro de serviços
  const filteredServices = useMemo(() => {
    if (serviceCategoryFilter === "Todos") return barbershop.services;
    return barbershop.services.filter((s) => s.category === serviceCategoryFilter);
  }, [barbershop.services, serviceCategoryFilter]);

  // Totais
  const totalAmount = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.durationMin, 0);
  }, [selectedServices]);

  // Gerar os próximos 7 dias para o seletor estilo Apple
  const nextDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  // Gerar slots de horário com base no horário de funcionamento
  const timeSlots = useMemo(() => {
    const slots = [];
    const [startH] = (barbershop.openingTime || "09:00").split(":").map(Number);
    const [endH] = (barbershop.closingTime || "20:00").split(":").map(Number);

    for (let hour = startH; hour < endH; hour++) {
      slots.push(`${String(hour).padStart(2, "0")}:00`);
      slots.push(`${String(hour).padStart(2, "0")}:30`);
    }
    return slots;
  }, [barbershop.openingTime, barbershop.closingTime]);

  const toggleService = (service: Service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !selectedTime) {
      alert("Por favor, preencha seu nome, WhatsApp e horário desejado.");
      return;
    }

    setIsSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(hours, minutes, 0, 0);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barbershopId: barbershop.id,
          barberId: selectedBarber?.id || null,
          clientName,
          clientPhone,
          clientNotes,
          dateTime: bookingDateTime.toISOString(),
          serviceIds: selectedServices.map((s) => s.id),
        }),
      });

      if (!res.ok) {
        throw new Error("Falha ao criar agendamento");
      }

      const booking = await res.json();
      router.push(`/${barbershop.slug}/booking/${booking.id}`);
    } catch (err) {
      console.error(err);
      alert("Erro ao confirmar agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#0a0a0c] text-white">
      <DynamicIsland
        openingTime={barbershop.openingTime}
        closingTime={barbershop.closingTime}
      />

      {/* Hero Cover Header */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden">
        {barbershop.coverImage ? (
          <Image
            src={barbershop.coverImage}
            alt={barbershop.name}
            fill
            priority
            className="object-cover brightness-50"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-amber-950/40 to-[#0a0a0c]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />

        {/* Barbershop Info Floating on Cover */}
        <div className="absolute bottom-4 left-0 right-0 px-5 max-w-lg mx-auto flex items-end gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-apple shrink-0 bg-black">
            {barbershop.logo ? (
              <Image
                src={barbershop.logo}
                alt={barbershop.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-amber-500/20 text-amber-400">
                <Scissors className="w-8 h-8" />
              </div>
            )}
          </div>

          <div className="flex-1 pb-1">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>4.9 (180+ avaliações)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {barbershop.name}
            </h1>
            {barbershop.address && (
              <p className="text-xs text-white/60 flex items-center gap-1 mt-1 truncate">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{barbershop.address}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-lg mx-auto px-4 mt-3">
        {/* Navigation Tabs */}
        <SegmentedControl
          options={[
            { id: "services", label: "Serviços", icon: <Scissors className="w-3.5 h-3.5" /> },
            { id: "products", label: "Produtos", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
            { id: "about", label: "Sobre", icon: <Info className="w-3.5 h-3.5" /> },
          ]}
          selectedId={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            if (currentStep !== "catalog") setCurrentStep("catalog");
          }}
          className="mb-5"
        />

        {/* TAB 1: SERVIÇOS & AGENDAMENTO */}
        {activeTab === "services" && (
          <div>
            {currentStep === "catalog" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Category Chips */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setServiceCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        serviceCategoryFilter === cat
                          ? "bg-amber-500 text-black font-bold shadow-sm"
                          : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Services List */}
                <div className="space-y-3">
                  {filteredServices.map((service) => {
                    const isSelected = selectedServices.some((s) => s.id === service.id);
                    return (
                      <GlassCard
                        key={service.id}
                        variant={isSelected ? "glow" : "default"}
                        clickable
                        onClick={() => toggleService(service)}
                        className={`relative transition-all duration-200 ${
                          isSelected ? "border-amber-500/50 bg-[#1e1c18]/90" : ""
                        }`}
                      >
                        <div className="flex gap-3.5">
                          {service.image && (
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                              <Image
                                src={service.image}
                                alt={service.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-sm sm:text-base text-white leading-tight">
                                  {service.name}
                                </h3>
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                                    isSelected
                                      ? "bg-amber-500 border-amber-500 text-black"
                                      : "border-white/20 text-transparent"
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              </div>
                              {service.description && (
                                <p className="text-xs text-white/60 line-clamp-2 mt-1">
                                  {service.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                              <span className="text-[11px] text-white/50 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" />
                                {service.durationMin} min
                              </span>
                              <span className="text-sm font-bold text-amber-400">
                                {formatCurrency(service.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: ESCOLHA DE BARBEIRO, DATA E HORA */}
            {currentStep === "datetime" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Seleção de Barbeiro */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" /> Escolha o Profissional
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Opção Qualquer Profissional */}
                    <button
                      type="button"
                      onClick={() => setSelectedBarber(null)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedBarber === null
                          ? "bg-amber-500/10 border-amber-500 text-white"
                          : "bg-[#16161a] border-white/10 text-white/70 hover:border-white/20"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold mb-2">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Qualquer Barbeiro</p>
                        <p className="text-[10px] text-white/50">Primeiro disponível</p>
                      </div>
                    </button>

                    {/* Barbeiros da Barbearia */}
                    {barbershop.barbers.map((barber) => {
                      const isSelected = selectedBarber?.id === barber.id;
                      return (
                        <button
                          key={barber.id}
                          type="button"
                          onClick={() => setSelectedBarber(barber)}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? "bg-amber-500/10 border-amber-500 text-white"
                              : "bg-[#16161a] border-white/10 text-white/70 hover:border-white/20"
                          }`}
                        >
                          <div className="relative w-10 h-10 rounded-full overflow-hidden mb-2 border border-white/20">
                            {barber.avatar ? (
                              <Image
                                src={barber.avatar}
                                alt={barber.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-xs">
                                {barber.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="text-xs font-bold text-white truncate">{barber.name}</p>
                              <span className="text-[9px] text-amber-400 flex items-center">★{barber.rating}</span>
                            </div>
                            <p className="text-[10px] text-white/50 truncate">{barber.role}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seletor de Data Estilo Apple iOS (Carrossel Horizontal) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Escolha o Dia
                  </h3>
                  <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
                    {nextDays.map((day, idx) => {
                      const isSelected =
                        day.getDate() === selectedDate.getDate() &&
                        day.getMonth() === selectedDate.getMonth();
                      const weekDay = day.toLocaleDateString("pt-BR", { weekday: "short" });
                      const dayNumber = day.getDate();
                      const monthName = day.toLocaleDateString("pt-BR", { month: "short" });

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedDate(day);
                            setSelectedTime("");
                          }}
                          className={`flex flex-col items-center justify-center min-w-[62px] py-3 rounded-2xl border transition-all ${
                            isSelected
                              ? "bg-amber-500 border-amber-500 text-black shadow-apple-glow font-bold"
                              : "bg-[#16161a] border-white/10 text-white/80 hover:bg-white/5"
                          }`}
                        >
                          <span className={`text-[10px] uppercase font-semibold ${isSelected ? "text-black/80" : "text-white/50"}`}>
                            {idx === 0 ? "Hoje" : weekDay.replace(".", "")}
                          </span>
                          <span className="text-lg font-black my-0.5">{dayNumber}</span>
                          <span className={`text-[9px] ${isSelected ? "text-black/70" : "text-white/40"}`}>
                            {monthName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seletor de Horários */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Horários Disponíveis
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            isSelected
                              ? "bg-amber-400 text-black border-amber-400 shadow-md font-bold"
                              : "bg-[#16161a]/90 border-white/10 text-white/80 hover:border-white/20 active:bg-white/10"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DADOS DO CLIENTE & CONFIRMAÇÃO */}
            {currentStep === "checkout" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <GlassCard variant="gold" className="p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Resumo do Agendamento
                  </h4>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-white/70">
                      <span>Data e Hora:</span>
                      <span className="font-semibold text-white">
                        {selectedDate.toLocaleDateString("pt-BR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        às {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Profissional:</span>
                      <span className="font-semibold text-white">
                        {selectedBarber?.name || "Qualquer Barbeiro"}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Duração Estimada:</span>
                      <span className="font-semibold text-white">{totalDuration} minutos</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold">
                      <span className="text-white">Total a pagar:</span>
                      <span className="text-amber-400">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </GlassCard>

                {/* Form de Identificação */}
                <form onSubmit={handleBookingSubmit} className="space-y-3.5 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">
                      Seu Nome Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Carlos Eduardo"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">
                      WhatsApp para Notificação *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-white/40 mt-1 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-emerald-400" />
                      Você receberá a confirmação e lembrete direto no WhatsApp.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">
                      Observações ou Preferências (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Prefiro tesoura no topo, barba bem baixa"
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full bg-[#16161a] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUTOS & VITRINE */}
        {activeTab === "products" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Adquira produtos profissionais direto no balcão da barbearia.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {barbershop.products.map((product) => (
                <GlassCard key={product.id} className="p-3 flex flex-col justify-between">
                  <div>
                    {product.image && (
                      <div className="relative h-36 w-full rounded-xl overflow-hidden mb-2.5 border border-white/5">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-[10px] uppercase font-bold text-amber-400/80">
                      {product.category}
                    </span>
                    <h4 className="font-semibold text-sm text-white leading-tight mt-0.5">
                      {product.name}
                    </h4>
                    {product.description && (
                      <p className="text-xs text-white/60 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Em Estoque
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: SOBRE A BARBEARIA */}
        {activeTab === "about" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-sm"
          >
            <GlassCard className="p-5 space-y-4">
              <div>
                <h3 className="font-bold text-base text-white">Sobre a {barbershop.name}</h3>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
                  {barbershop.description ||
                    "Oferecemos uma experiência completa de barbearia com serviços de alta precisão, toalha quente, bebidas especiais e ambiente acolhedor."}
                </p>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs">
                <div className="flex items-start gap-2.5 text-white/80">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{barbershop.address || "São Paulo - SP"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/80">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Segunda a Sábado: {barbershop.openingTime} às {barbershop.closingTime}
                  </span>
                </div>
                {barbershop.phone && (
                  <div className="flex items-center gap-2.5 text-white/80">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>WhatsApp: {formatPhoneNumber(barbershop.phone)}</span>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Time de Barbeiros */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                Nossa Equipe de Barbeiros
              </h3>
              <div className="space-y-2.5">
                {barbershop.barbers.map((b) => (
                  <GlassCard key={b.id} className="p-3 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/20">
                      {b.avatar ? (
                        <Image src={b.avatar} alt={b.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center font-bold">
                          {b.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm text-white">{b.name}</h4>
                        <span className="text-xs text-amber-400 font-bold">★ {b.rating}</span>
                      </div>
                      <p className="text-xs text-white/50">{b.role}</p>
                      {b.bio && <p className="text-[11px] text-white/40 mt-0.5 line-clamp-1">{b.bio}</p>}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* FLOATING BOTTOM BAR (ESTILO APPLE PAY / CHECKOUT DOCK) */}
      {activeTab === "services" && selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6 bg-[#0a0a0c]/90 backdrop-blur-2xl border-t border-white/10 shadow-2xl">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-white/50 uppercase tracking-wider block">
                {selectedServices.length} {selectedServices.length === 1 ? "serviço" : "serviços"} ({totalDuration} min)
              </span>
              <span className="text-lg font-black text-amber-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            {currentStep === "catalog" && (
              <AppleButton
                variant="gold"
                size="md"
                onClick={() => setCurrentStep("datetime")}
                className="flex-1 max-w-[200px]"
              >
                <span>Escolher Horário</span>
                <ArrowRight className="w-4 h-4" />
              </AppleButton>
            )}

            {currentStep === "datetime" && (
              <div className="flex gap-2 flex-1 max-w-[240px]">
                <AppleButton
                  variant="secondary"
                  size="md"
                  onClick={() => setCurrentStep("catalog")}
                >
                  Voltar
                </AppleButton>
                <AppleButton
                  variant="gold"
                  size="md"
                  disabled={!selectedTime}
                  onClick={() => setCurrentStep("checkout")}
                  className="flex-1"
                >
                  <span>Avançar</span>
                  <ArrowRight className="w-4 h-4" />
                </AppleButton>
              </div>
            )}

            {currentStep === "checkout" && (
              <div className="flex gap-2 flex-1 max-w-[260px]">
                <AppleButton
                  variant="secondary"
                  size="md"
                  onClick={() => setCurrentStep("datetime")}
                >
                  Voltar
                </AppleButton>
                <AppleButton
                  variant="gold"
                  size="md"
                  loading={isSubmitting}
                  onClick={handleBookingSubmit}
                  className="flex-1"
                >
                  <span>Confirmar</span>
                  <Check className="w-4 h-4" />
                </AppleButton>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
