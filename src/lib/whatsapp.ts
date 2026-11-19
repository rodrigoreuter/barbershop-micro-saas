export interface WhatsAppBookingParams {
  barbershopName: string;
  barbershopPhone?: string | null;
  clientName: string;
  clientPhone: string;
  bookingCode: string;
  dateTime: Date | string;
  services: string[];
  totalAmount: number;
  barberName?: string | null;
  address?: string | null;
  pixKey?: string | null;
}

/**
 * Cria a mensagem de confirmação para o WhatsApp
 */
export function buildBookingWhatsAppMessage(params: WhatsAppBookingParams): string {
  const dateObj = typeof params.dateTime === "string" ? new Date(params.dateTime) : params.dateTime;
  
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(params.totalAmount);

  const lines = [
    `💈 *${params.barbershopName.toUpperCase()}* 💈`,
    `✨ *Agendamento Confirmado!*`,
    ``,
    `👤 *Cliente:* ${params.clientName}`,
    `📅 *Data e Hora:* ${formattedDate}`,
    `✂️ *Serviço(s):* ${params.services.join(", ")}`,
    params.barberName ? `💈 *Profissional:* ${params.barberName}` : null,
    `💰 *Valor Total:* ${formattedAmount}`,
    `🔖 *Código do Agendamento:* #${params.bookingCode}`,
    params.address ? `📍 *Endereço:* ${params.address}` : null,
    params.pixKey ? `🔑 *Chave Pix para adiantar:* ${params.pixKey}` : null,
    ``,
    `_Apresente este código ao chegar ou responda esta mensagem caso precise reagendar._`,
    `Te esperamos com aquela resenha e bebida gelada! 🍻✂️`,
  ].filter(Boolean);

  return lines.join("\n");
}

/**
 * Gera o link `https://wa.me/...` para enviar a mensagem
 */
export function createWhatsAppLink(phone: string, message: string): string {
  // Limpar caracteres não numéricos
  let cleanPhone = phone.replace(/\D/g, "");
  
  // Adicionar código do Brasil (55) se não houver
  if (cleanPhone.length === 10 || cleanPhone.length === 11) {
    cleanPhone = `55${cleanPhone}`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Mensagem de lembrete enviada pelo Barbeiro para o cliente
 */
export function buildReminderWhatsAppMessage(params: WhatsAppBookingParams): string {
  const dateObj = typeof params.dateTime === "string" ? new Date(params.dateTime) : params.dateTime;
  const time = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return [
    `Fala, *${params.clientName}*! 👋`,
    `Passando para lembrar do seu horário hoje às *${time}* na *${params.barbershopName}*.`,
    `Serviço: ${params.services.join(", ")}`,
    ``,
    `Tudo certo por aí? Nos vemos em breve! ✂️💈`
  ].join("\n");
}
