import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildBookingWhatsAppMessage, buildReminderWhatsAppMessage } from "@/lib/whatsapp";

/**
 * Webhook endpoint para automações WhatsApp (n8n, Evolution API, Z-API, Typebot)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, bookingId, customMessage } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId obrigatório" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        barber: true,
        items: { include: { service: true } },
        barbershop: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });
    }

    const messageParams = {
      barbershopName: booking.barbershop.name,
      barbershopPhone: booking.barbershop.phone,
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      bookingCode: booking.code,
      dateTime: booking.dateTime,
      services: booking.items.map((i) => i.service.name),
      totalAmount: booking.totalAmount,
      barberName: booking.barber?.name,
      address: booking.barbershop.address,
      pixKey: booking.barbershop.pixKey,
    };

    let generatedMessage = "";
    if (action === "REMINDER_2H") {
      generatedMessage = buildReminderWhatsAppMessage(messageParams);
    } else {
      generatedMessage = buildBookingWhatsAppMessage(messageParams);
    }

    // Retornar o payload estruturado pronto para consumo pelo n8n / Evolution API
    return NextResponse.json({
      success: true,
      action: action || "CONFIRMATION",
      recipient: booking.clientPhone,
      clientName: booking.clientName,
      messageText: customMessage || generatedMessage,
      bookingDetails: {
        code: booking.code,
        dateTime: booking.dateTime,
        barbershop: booking.barbershop.name,
        barber: booking.barber?.name || "Não especificado",
        total: booking.totalAmount,
      },
      webhookTimestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro no processamento do webhook WhatsApp:", error);
    return NextResponse.json({ error: "Erro interno no webhook" }, { status: 500 });
  }
}
