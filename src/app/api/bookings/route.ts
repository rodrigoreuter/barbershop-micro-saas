import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBookingCode } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barbershopId = searchParams.get("barbershopId");
    const date = searchParams.get("date"); // YYYY-MM-DD

    let whereClause: any = {};
    if (barbershopId) {
      whereClause.barbershopId = barbershopId;
    }

    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);
      whereClause.dateTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        barber: true,
        items: {
          include: {
            service: true,
          },
        },
        barbershop: {
          select: {
            name: true,
            slug: true,
            phone: true,
            address: true,
            pixKey: true,
          },
        },
      },
      orderBy: {
        dateTime: "asc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      barbershopId,
      barberId,
      clientName,
      clientPhone,
      clientNotes,
      dateTime,
      serviceIds,
    } = body;

    if (!barbershopId || !clientName || !clientPhone || !dateTime || !serviceIds?.length) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Buscar serviços para calcular o valor total
    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
      },
    });

    if (services.length === 0) {
      return NextResponse.json(
        { error: "Nenhum serviço válido selecionado" },
        { status: 400 }
      );
    }

    const totalAmount = services.reduce((acc, curr) => acc + curr.price, 0);
    const bookingCode = generateBookingCode();

    const booking = await prisma.booking.create({
      data: {
        code: bookingCode,
        clientName,
        clientPhone,
        clientNotes: clientNotes || "",
        dateTime: new Date(dateTime),
        totalAmount,
        status: "CONFIRMED",
        barbershopId,
        barberId: barberId || null,
        items: {
          create: services.map((s) => ({
            serviceId: s.id,
            price: s.price,
          })),
        },
      },
      include: {
        barber: true,
        items: {
          include: {
            service: true,
          },
        },
        barbershop: true,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 }
    );
  }
}
