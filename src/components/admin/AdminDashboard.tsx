"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Scissors,
  ShoppingBag,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock3,
  MessageCircle,
  ExternalLink,
  Phone,
  RefreshCw,
  Zap,
  User,
  Star,
  Image as ImageIcon,
  Save,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/apple-ui/GlassCard";
import { SegmentedControl } from "@/components/apple-ui/SegmentedControl";
import { AppleButton } from "@/components/apple-ui/AppleButton";
import { formatCurrency, formatPhoneNumber } from "@/lib/utils";
import {
  buildReminderWhatsAppMessage,
  createWhatsAppLink,
} from "@/lib/whatsapp";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  category: string;
  image?: string | null;
  active: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image?: string | null;
  stock: number;
  active: boolean;
}

interface Barber {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  bio: string | null;
  rating: number;
  active: boolean;
}

interface Booking {
  id: string;
  code: string;
  clientName: string;
  clientPhone: string;
  clientNotes: string | null;
  dateTime: string;
  totalAmount: number;
  status: string;
  barber?: { name: string } | null;
  items: { service: { name: string; price: number } }[];
  barbershop: {
    name: string;
    phone: string | null;
    address: string | null;
    pixKey: string | null;
  };
}

interface Barbershop {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  phone: string | null;
  address: string | null;
  instagram?: string | null;
  pixKey: string | null;
  openingTime: string;
  closingTime: string;
  slotInterval?: number;
}

export function AdminDashboard({
  barbershop: initialBarbershop,
  initialBookings,
  initialServices,
  initialProducts,
  initialBarbers,
}: {
  barbershop: Barbershop;
  initialBookings: Booking[];
  initialServices: Service[];
  initialProducts: Product[];
  initialBarbers: Barber[];
}) {
  const [activeTab, setActiveTab] = useState("agenda");
  const [barbershop, setBarbershop] = useState<Barbershop>(initialBarbershop);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados para criação de Barbeiro
  const [isAddingBarber, setIsAddingBarber] = useState(false);
  const [newBarberName, setNewBarberName] = useState("");
  const [newBarberRole, setNewBarberRole] = useState("Barbeiro Profissional");
  const [newBarberAvatar, setNewBarberAvatar] = useState("");
  const [newBarberPhone, setNewBarberPhone] = useState("");
  const [newBarberBio, setNewBarberBio] = useState("");
  const [newBarberRating, setNewBarberRating] = useState("5.0");

  // Estados para criação rápida de Serviço
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("30");
  const [newServiceCategory, setNewServiceCategory] = useState("Cabelo");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [newServiceImage, setNewServiceImage] = useState("");
  const [isAddingService, setIsAddingService] = useState(false);

  // Estados para edição de Serviço
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Estados para criação rápida de Produto
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("10");
  const [newProdCategory, setNewProdCategory] = useState("Finalizadores");
  const [newProdDescription, setNewProdDescription] = useState("");
  const [newProdImage, setNewProdImage] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Estados para edição de Produto
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Estados do formulário "Sobre a Barbearia & Configurações"
  const [editName, setEditName] = useState(barbershop.name || "");
  const [editDescription, setEditDescription] = useState(barbershop.description || "");
  const [editAddress, setEditAddress] = useState(barbershop.address || "");
  const [editPhone, setEditPhone] = useState(barbershop.phone || "");
  const [editInstagram, setEditInstagram] = useState(barbershop.instagram || "");
  const [editPixKey, setEditPixKey] = useState(barbershop.pixKey || "");
  const [editOpeningTime, setEditOpeningTime] = useState(barbershop.openingTime || "09:00");
  const [editClosingTime, setEditClosingTime] = useState(barbershop.closingTime || "20:00");
  const [editCoverImage, setEditCoverImage] = useState(barbershop.coverImage || "");
  const [editLogo, setEditLogo] = useState(barbershop.logo || "");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  // Recarregar dados
  const refreshAll = async () => {
    setIsRefreshing(true);
    try {
      const [bookingsRes, barbersRes, servicesRes, productsRes] = await Promise.all([
        fetch(`/api/bookings?barbershopId=${barbershop.id}`),
        fetch(`/api/barbers?barbershopId=${barbershop.id}`),
        fetch(`/api/services?barbershopId=${barbershop.id}`),
        fetch(`/api/products?barbershopId=${barbershop.id}`),
      ]);

      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (barbersRes.ok) setBarbers(await barbersRes.json());
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Salvar configurações e texto "Sobre"
  const handleSaveBarbershopSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch(`/api/barbershops/${barbershop.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          address: editAddress,
          phone: editPhone,
          instagram: editInstagram,
          pixKey: editPixKey,
          openingTime: editOpeningTime,
          closingTime: editClosingTime,
          coverImage: editCoverImage,
          logo: editLogo,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setBarbershop(updated);
        setSaveSuccessMessage(true);
        setTimeout(() => setSaveSuccessMessage(false), 3000);
      } else {
        alert("Erro ao salvar dados.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Adicionar Barbeiro
  const handleAddBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarberName.trim()) return;

    try {
      const res = await fetch("/api/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBarberName,
          role: newBarberRole,
          avatar: newBarberAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
          phone: newBarberPhone,
          bio: newBarberBio,
          rating: Number(newBarberRating) || 5.0,
          barbershopId: barbershop.id,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setBarbers([...barbers, created]);
        setNewBarberName("");
        setNewBarberRole("Barbeiro Profissional");
        setNewBarberAvatar("");
        setNewBarberPhone("");
        setNewBarberBio("");
        setNewBarberRating("5.0");
        setIsAddingBarber(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Excluir Barbeiro
  const handleDeleteBarber = async (id: string) => {
    if (!confirm("Deseja realmente remover este profissional da equipe?")) return;
    try {
      const res = await fetch(`/api/barbers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBarbers(barbers.filter((b) => b.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Atualizar status do agendamento
  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Adicionar novo serviço
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newServiceName,
          description: newServiceDescription,
          price: Number(newServicePrice),
          durationMin: Number(newServiceDuration),
          category: newServiceCategory,
          image: newServiceImage || null,
          barbershopId: barbershop.id,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setServices([...services, created]);
        setNewServiceName("");
        setNewServiceDescription("");
        setNewServicePrice("");
        setNewServiceDuration("30");
        setNewServiceImage("");
        setIsAddingService(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Salvar edição de serviço
  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });

      if (res.ok) {
        const updated = await res.json();
        setServices(services.map((s) => (s.id === updated.id ? updated : s)));
        setEditingService(null);
      } else {
        alert("Erro ao atualizar serviço.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Excluir serviço
  const handleDeleteService = async (id: string) => {
    if (!confirm("Deseja realmente excluir este serviço?")) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices(services.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Adicionar novo produto
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProdName,
          description: newProdDescription,
          price: Number(newProdPrice),
          category: newProdCategory,
          stock: Number(newProdStock),
          image: newProdImage || null,
          barbershopId: barbershop.id,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setProducts([...products, created]);
        setNewProdName("");
        setNewProdDescription("");
        setNewProdPrice("");
        setNewProdStock("10");
        setNewProdImage("");
        setIsAddingProduct(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Salvar edição de produto
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        const updated = await res.json();
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
        setEditingProduct(null);
      } else {
        alert("Erro ao atualizar produto.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Excluir produto
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Deseja realmente excluir este produto?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Métricas calculadas
  const metrics = useMemo(() => {
    const validBookings = bookings.filter((b) => b.status !== "CANCELLED");
    const totalRev = validBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const confirmedCount = validBookings.filter((b) => b.status === "CONFIRMED").length;
    const completedCount = validBookings.filter((b) => b.status === "COMPLETED").length;
    const avgTicket = validBookings.length > 0 ? totalRev / validBookings.length : 0;

    return {
      totalRev,
      totalCount: validBookings.length,
      confirmedCount,
      completedCount,
      avgTicket,
    };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-24">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 px-4 py-3.5 bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">
                Painel do Barbeiro & Gestão
              </h1>
              <p className="text-[11px] text-white/50">{barbershop.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshAll}
              disabled={isRefreshing}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-all active:scale-95"
              title="Atualizar Dados"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
            </button>

            <Link
              href={`/${barbershop.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold hover:bg-amber-500/30 transition-all"
            >
              <span>Ver App do Cliente</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-5 space-y-6">
        {/* KPI Metrics Cards (Estilo Apple Dashboard) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <GlassCard variant="gold" className="p-3.5">
            <span className="text-[10px] uppercase font-bold text-amber-400/80 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Faturamento
            </span>
            <p className="text-lg sm:text-xl font-black text-amber-400 mt-1">
              {formatCurrency(metrics.totalRev)}
            </p>
            <p className="text-[10px] text-white/50 mt-0.5">{metrics.totalCount} agendamentos</p>
          </GlassCard>

          <GlassCard className="p-3.5">
            <span className="text-[10px] uppercase font-bold text-white/50 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-400" /> Confirmados
            </span>
            <p className="text-lg sm:text-xl font-bold text-white mt-1">
              {metrics.confirmedCount}
            </p>
            <p className="text-[10px] text-emerald-400 mt-0.5">Prontos p/ atender</p>
          </GlassCard>

          <GlassCard className="p-3.5">
            <span className="text-[10px] uppercase font-bold text-white/50 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Concluídos
            </span>
            <p className="text-lg sm:text-xl font-bold text-white mt-1">
              {metrics.completedCount}
            </p>
            <p className="text-[10px] text-white/50 mt-0.5">Finalizados</p>
          </GlassCard>

          <GlassCard className="p-3.5">
            <span className="text-[10px] uppercase font-bold text-white/50 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-purple-400" /> Ticket Médio
            </span>
            <p className="text-lg sm:text-xl font-bold text-white mt-1">
              {formatCurrency(metrics.avgTicket)}
            </p>
            <p className="text-[10px] text-white/50 mt-0.5">Por cliente</p>
          </GlassCard>
        </div>

        {/* Tab Controls com Novas Abas */}
        <SegmentedControl
          options={[
            { id: "agenda", label: "Agenda", icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: "services", label: "Serviços", icon: <Scissors className="w-3.5 h-3.5" /> },
            { id: "products", label: "Produtos", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
            { id: "barbers", label: "Barbeiros", icon: <Users className="w-3.5 h-3.5" /> },
            { id: "about", label: "Sobre & Perfil", icon: <Settings className="w-3.5 h-3.5" /> },
          ]}
          selectedId={activeTab}
          onChange={setActiveTab}
        />

        {/* TAB 1: AGENDA & GESTÃO COM WHATSAPP */}
        {activeTab === "agenda" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">
                Lista de Atendimentos ({bookings.length})
              </h2>
            </div>

            {bookings.length === 0 ? (
              <GlassCard className="p-8 text-center space-y-2">
                <Calendar className="w-8 h-8 text-white/30 mx-auto" />
                <p className="text-sm text-white/60">Nenhum agendamento encontrado.</p>
                <p className="text-xs text-white/40">
                  Novos agendamentos feitos no app do cliente aparecerão aqui instantaneamente.
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => {
                  const bookingDate = new Date(booking.dateTime);
                  const reminderMessage = buildReminderWhatsAppMessage({
                    barbershopName: barbershop.name,
                    barbershopPhone: barbershop.phone,
                    clientName: booking.clientName,
                    clientPhone: booking.clientPhone,
                    bookingCode: booking.code,
                    dateTime: booking.dateTime,
                    services: booking.items.map((i) => i.service.name),
                    totalAmount: booking.totalAmount,
                    barberName: booking.barber?.name,
                  });
                  const whatsappReminderLink = createWhatsAppLink(
                    booking.clientPhone,
                    reminderMessage
                  );

                  return (
                    <GlassCard
                      key={booking.id}
                      className={`p-4 transition-all ${
                        booking.status === "CONFIRMED"
                          ? "border-amber-500/20"
                          : booking.status === "COMPLETED"
                          ? "opacity-75 border-emerald-500/20"
                          : "opacity-50"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Time & Client Info */}
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center min-w-[64px]">
                            <span className="text-xs font-bold text-amber-400 block">
                              {bookingDate.toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span className="text-[10px] text-white/50 block capitalize">
                              {bookingDate.toLocaleDateString("pt-BR", {
                                weekday: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm text-white">
                                {booking.clientName}
                              </h3>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono">
                                #{booking.code}
                              </span>
                            </div>

                            <p className="text-xs text-white/70">
                              ✂️ {booking.items.map((i) => i.service.name).join(", ")}
                            </p>

                            <div className="flex items-center gap-3 text-[11px] text-white/50">
                              <span>Profissional: <strong className="text-white/80">{booking.barber?.name || "Qualquer"}</strong></span>
                              <span>•</span>
                              <span>WhatsApp: <strong className="text-white/80">{formatPhoneNumber(booking.clientPhone)}</strong></span>
                            </div>

                            {booking.clientNotes && (
                              <p className="text-[11px] text-amber-300/80 italic">
                                Obs: {booking.clientNotes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                          <span className="text-sm font-extrabold text-amber-400">
                            {formatCurrency(booking.totalAmount)}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <a
                              href={whatsappReminderLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-xs font-semibold flex items-center gap-1 transition-all"
                              title="Enviar Lembrete WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-current" />
                              <span className="hidden sm:inline">Lembrar</span>
                            </a>

                            <select
                              value={booking.status}
                              onChange={(e) =>
                                updateBookingStatus(booking.id, e.target.value)
                              }
                              className="bg-[#2c2c30] border border-white/10 text-xs rounded-xl px-2 py-1.5 text-white font-medium focus:outline-none focus:border-amber-400"
                            >
                              <option value="CONFIRMED">🟢 Confirmado</option>
                              <option value="COMPLETED">✅ Concluído</option>
                              <option value="CANCELLED">❌ Cancelado</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GERENCIAMENTO DE SERVIÇOS (CRIAR, EDITAR, REMOVER) */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">
                Serviços Cadastrados ({services.length})
              </h2>
              <AppleButton
                variant="gold"
                size="sm"
                onClick={() => {
                  setIsAddingService(!isAddingService);
                  setEditingService(null);
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingService ? "Fechar" : "Novo Serviço"}</span>
              </AppleButton>
            </div>

            {/* Modal/Form de Edição de Serviço */}
            {editingService && (
              <GlassCard variant="gold" className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Edit2 className="w-3.5 h-3.5" /> Editar Serviço: {editingService.name}
                  </h3>
                  <button
                    onClick={() => setEditingService(null)}
                    className="text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleUpdateService} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Nome do Serviço *</label>
                      <input
                        type="text"
                        required
                        value={editingService.name}
                        onChange={(e) =>
                          setEditingService({ ...editingService, name: e.target.value })
                        }
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Preço (R$) *</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={editingService.price}
                        onChange={(e) =>
                          setEditingService({ ...editingService, price: Number(e.target.value) })
                        }
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Duração (Minutos) *</label>
                      <input
                        type="number"
                        required
                        value={editingService.durationMin}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            durationMin: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Categoria</label>
                      <select
                        value={editingService.category}
                        onChange={(e) =>
                          setEditingService({ ...editingService, category: e.target.value })
                        }
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Cabelo">Cabelo</option>
                        <option value="Barba">Barba</option>
                        <option value="Combos">Combos</option>
                        <option value="Estética">Estética</option>
                        <option value="Tratamentos">Tratamentos</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">URL da Foto (Opcional)</label>
                      <input
                        type="url"
                        value={editingService.image || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, image: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Descrição do Serviço</label>
                    <textarea
                      rows={2}
                      value={editingService.description || ""}
                      onChange={(e) =>
                        setEditingService({ ...editingService, description: e.target.value })
                      }
                      placeholder="Detalhes sobre a experiência do serviço..."
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <AppleButton
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => setEditingService(null)}
                    >
                      Cancelar
                    </AppleButton>
                    <AppleButton variant="gold" size="sm" type="submit">
                      Salvar Alterações
                    </AppleButton>
                  </div>
                </form>
              </GlassCard>
            )}

            {/* Form de Novo Serviço */}
            {isAddingService && (
              <GlassCard variant="gold" className="p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5" /> Adicionar Novo Serviço
                </h3>
                <form onSubmit={handleAddService} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Nome do Serviço *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Corte Degrade + Lavagem"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Preço (R$) *</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        placeholder="Ex: 65.00"
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Duração (Minutos)</label>
                      <input
                        type="number"
                        placeholder="30"
                        value={newServiceDuration}
                        onChange={(e) => setNewServiceDuration(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Categoria</label>
                      <select
                        value={newServiceCategory}
                        onChange={(e) => setNewServiceCategory(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Cabelo">Cabelo</option>
                        <option value="Barba">Barba</option>
                        <option value="Combos">Combos</option>
                        <option value="Estética">Estética</option>
                        <option value="Tratamentos">Tratamentos</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">URL da Foto</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newServiceImage}
                        onChange={(e) => setNewServiceImage(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Descrição do Serviço</label>
                    <textarea
                      rows={2}
                      placeholder="Descrição detalhada do corte/serviço..."
                      value={newServiceDescription}
                      onChange={(e) => setNewServiceDescription(e.target.value)}
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <AppleButton
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => setIsAddingService(false)}
                    >
                      Cancelar
                    </AppleButton>
                    <AppleButton variant="primary" size="sm" type="submit">
                      Salvar Serviço
                    </AppleButton>
                  </div>
                </form>
              </GlassCard>
            )}

            {/* Grid de Serviços com Ações de Editar e Remover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service) => (
                <GlassCard key={service.id} className="p-4 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    {service.image && (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="text-[10px] text-amber-400 font-semibold uppercase">
                        {service.category}
                      </span>
                      <h4 className="font-semibold text-sm text-white leading-tight mt-0.5">
                        {service.name}
                      </h4>
                      <p className="text-xs text-white/50">{service.durationMin} min</p>
                      {service.description && (
                        <p className="text-xs text-white/60 line-clamp-2 mt-1">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                    <span className="text-sm font-bold text-amber-400">
                      {formatCurrency(service.price)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setIsAddingService(false);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                        title="Editar Serviço"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                        title="Excluir Serviço"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUTOS & ESTOQUE (CRIAR, EDITAR, REMOVER) */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">
                Vitrine de Produtos ({products.length})
              </h2>
              <AppleButton
                variant="gold"
                size="sm"
                onClick={() => {
                  setIsAddingProduct(!isAddingProduct);
                  setEditingProduct(null);
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingProduct ? "Fechar" : "Novo Produto"}</span>
              </AppleButton>
            </div>

            {/* Modal/Form de Edição de Produto */}
            {editingProduct && (
              <GlassCard variant="gold" className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Edit2 className="w-3.5 h-3.5" /> Editar Produto: {editingProduct.name}
                  </h3>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProduct} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Nome do Produto *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Preço (R$) *</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Estoque (Unidades)</label>
                      <input
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            stock: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Categoria</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, category: e.target.value })
                        }
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Finalizadores">Finalizadores</option>
                        <option value="Barba">Barba</option>
                        <option value="Shampoos">Shampoos & Cuidados</option>
                        <option value="Bebidas">Bebidas & Snacks</option>
                        <option value="Acessórios">Acessórios</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">URL da Foto (Opcional)</label>
                      <input
                        type="url"
                        value={editingProduct.image || ""}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, image: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Descrição do Produto</label>
                    <textarea
                      rows={2}
                      value={editingProduct.description || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      placeholder="Detalhes e benefícios do cosmético..."
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <AppleButton
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => setEditingProduct(null)}
                    >
                      Cancelar
                    </AppleButton>
                    <AppleButton variant="gold" size="sm" type="submit">
                      Salvar Alterações
                    </AppleButton>
                  </div>
                </form>
              </GlassCard>
            )}

            {/* Form de Novo Produto */}
            {isAddingProduct && (
              <GlassCard variant="gold" className="p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" /> Cadastrar Novo Produto
                </h3>
                <form onSubmit={handleAddProduct} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Nome do Produto *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Óleo Hidratante de Barba"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Preço (R$) *</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        placeholder="Ex: 45.00"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Estoque Inicial</label>
                      <input
                        type="number"
                        placeholder="10"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Categoria</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Finalizadores">Finalizadores</option>
                        <option value="Barba">Barba</option>
                        <option value="Shampoos">Shampoos & Cuidados</option>
                        <option value="Bebidas">Bebidas & Snacks</option>
                        <option value="Acessórios">Acessórios</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">URL da Foto</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-white/60 mb-1 block">Descrição do Produto</label>
                    <textarea
                      rows={2}
                      placeholder="Descrição, fragrância e aplicação do cosmético..."
                      value={newProdDescription}
                      onChange={(e) => setNewProdDescription(e.target.value)}
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <AppleButton
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                    >
                      Cancelar
                    </AppleButton>
                    <AppleButton variant="primary" size="sm" type="submit">
                      Salvar Produto
                    </AppleButton>
                  </div>
                </form>
              </GlassCard>
            )}

            {/* Grid de Produtos com Ações de Editar e Remover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((prod) => (
                <GlassCard key={prod.id} className="p-4 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    {prod.image && (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="text-[10px] text-amber-400 font-semibold uppercase">
                        {prod.category}
                      </span>
                      <h4 className="font-semibold text-sm text-white leading-tight mt-0.5">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-white/50">Estoque: {prod.stock} un</p>
                      {prod.description && (
                        <p className="text-xs text-white/60 line-clamp-2 mt-1">
                          {prod.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(prod.price)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsAddingProduct(false);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                        title="Editar Produto"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                        title="Excluir Produto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CADASTRO E GERENCIAMENTO DE BARBEIROS */}
        {activeTab === "barbers" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">
                Equipe de Barbeiros ({barbers.length})
              </h2>
              <AppleButton
                variant="gold"
                size="sm"
                onClick={() => setIsAddingBarber(!isAddingBarber)}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingBarber ? "Fechar" : "Novo Barbeiro"}</span>
              </AppleButton>
            </div>

            {/* Formulário de Novo Barbeiro */}
            {isAddingBarber && (
              <GlassCard variant="gold" className="p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Cadastrar Novo Barbeiro / Profissional
                </h3>
                <form onSubmit={handleAddBarber} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-white/60 mb-1 block">Nome do Barbeiro *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Gabriel 'Navalha' Souza"
                        value={newBarberName}
                        onChange={(e) => setNewBarberName(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/60 mb-1 block">Especialidade / Cargo</label>
                      <input
                        type="text"
                        placeholder="Ex: Especialista em Fade & Barboterapia"
                        value={newBarberRole}
                        onChange={(e) => setNewBarberRole(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[11px] text-white/60 mb-1 block">WhatsApp / Telefone</label>
                      <input
                        type="tel"
                        placeholder="5511999998888"
                        value={newBarberPhone}
                        onChange={(e) => setNewBarberPhone(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/60 mb-1 block">Avaliação Inicial (0 a 5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        placeholder="5.0"
                        value={newBarberRating}
                        onChange={(e) => setNewBarberRating(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/60 mb-1 block">URL da Foto (Avatar)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newBarberAvatar}
                        onChange={(e) => setNewBarberAvatar(e.target.value)}
                        className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-white/60 mb-1 block">Biografia / Apresentação</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Mais de 6 anos de experiência em cortes modernos, visagismo e cuidados masculinos."
                      value={newBarberBio}
                      onChange={(e) => setNewBarberBio(e.target.value)}
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <AppleButton
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => setIsAddingBarber(false)}
                    >
                      Cancelar
                    </AppleButton>
                    <AppleButton variant="primary" size="sm" type="submit">
                      Salvar Barbeiro
                    </AppleButton>
                  </div>
                </form>
              </GlassCard>
            )}

            {/* Lista de Barbeiros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {barbers.map((barber) => (
                <GlassCard key={barber.id} className="p-4 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/15 bg-neutral-900">
                      {barber.avatar ? (
                        <Image
                          src={barber.avatar}
                          alt={barber.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-base">
                          {barber.name[0]}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-white">{barber.name}</h4>
                        <span className="text-xs text-amber-400 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {barber.rating}
                        </span>
                      </div>
                      <p className="text-xs text-amber-300/80 font-medium">{barber.role}</p>
                      {barber.phone && (
                        <p className="text-[11px] text-white/50 mt-0.5">
                          WhatsApp: {formatPhoneNumber(barber.phone)}
                        </p>
                      )}
                      {barber.bio && (
                        <p className="text-xs text-white/60 line-clamp-2 mt-1.5">
                          {barber.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-xs">
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Disponível para agendamentos
                    </span>
                    <button
                      onClick={() => handleDeleteBarber(barber.id)}
                      className="p-1.5 text-white/40 hover:text-red-400 transition-colors flex items-center gap-1 text-[11px]"
                      title="Excluir Barbeiro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SOBRE A BARBEARIA & CONFIGURAÇÕES GERAIS */}
        {activeTab === "about" && (
          <div className="space-y-4">
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      Perfil da Barbearia & Seção "Sobre"
                    </h3>
                    <p className="text-xs text-white/60">
                      Atualize a apresentação da sua barbearia, horários de funcionamento e dados de contato.
                    </p>
                  </div>
                </div>

                {saveSuccessMessage && (
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-bounce">
                    <CheckCircle2 className="w-4 h-4" /> Alterações salvas!
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveBarbershopSettings} className="space-y-4 pt-2">
                {/* Texto Sobre a Barbearia */}
                <div>
                  <label className="text-xs font-semibold text-white/80 mb-1.5 block">
                    Texto "Sobre a Barbearia" (Exibido na aba 'Sobre' do app do cliente) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Conte a história da sua barbearia, diferenciais, ambiente, bebidas, toalha quente..."
                    className="w-full bg-[#16161a] border border-white/10 rounded-2xl p-3 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>

                {/* Dados da Empresa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/80 mb-1.5 block">
                      Nome da Barbearia *
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/80 mb-1.5 block">
                      Endereço Completo
                    </label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="Av. Paulista, 1578 - Bela Vista, SP"
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Contato & Pix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/80 mb-1.5 block">
                      WhatsApp Oficial (55...)
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="5511998765432"
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/80 mb-1.5 block">
                      Instagram (@suabarbearia)
                    </label>
                    <input
                      type="text"
                      value={editInstagram}
                      onChange={(e) => setEditInstagram(e.target.value)}
                      placeholder="@royalbarberclub"
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/80 mb-1.5 block">
                      Chave Pix (Passe Digital)
                    </label>
                    <input
                      type="text"
                      value={editPixKey}
                      onChange={(e) => setEditPixKey(e.target.value)}
                      placeholder="pix@suabarbearia.com.br"
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Horários de Funcionamento */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/80 mb-1.5 block">
                      Horário de Abertura
                    </label>
                    <input
                      type="time"
                      value={editOpeningTime}
                      onChange={(e) => setEditOpeningTime(e.target.value)}
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/80 mb-1.5 block">
                      Horário de Fechamento
                    </label>
                    <input
                      type="time"
                      value={editClosingTime}
                      onChange={(e) => setEditClosingTime(e.target.value)}
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Imagens (Cover & Logo) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/80 mb-1.5 block">
                      URL da Imagem de Capa (Banner)
                    </label>
                    <input
                      type="url"
                      value={editCoverImage}
                      onChange={(e) => setEditCoverImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/80 mb-1.5 block">
                      URL do Logotipo
                    </label>
                    <input
                      type="url"
                      value={editLogo}
                      onChange={(e) => setEditLogo(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#16161a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <AppleButton
                    variant="gold"
                    size="md"
                    type="submit"
                    loading={isSavingSettings}
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações da Barbearia</span>
                  </AppleButton>
                </div>
              </form>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
}
