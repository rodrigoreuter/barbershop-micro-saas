import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barbershopId = searchParams.get("barbershopId");

    const barbers = await prisma.barber.findMany({
      where: barbershopId ? { barbershopId } : undefined,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(barbers);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar barbeiros" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, avatar, phone, bio, rating, barbershopId } = body;

    if (!name || !barbershopId) {
      return NextResponse.json({ error: "Nome e ID da barbearia são obrigatórios" }, { status: 400 });
    }

    const barber = await prisma.barber.create({
      data: {
        name,
        role: role || "Barbeiro Profissional",
        avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        phone: phone || null,
        bio: bio || null,
        rating: Number(rating) || 5.0,
        active: true,
        barbershopId,
      },
    });

    return NextResponse.json(barber, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar barbeiro" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, role, avatar, phone, bio, rating, active } = body;

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const barber = await prisma.barber.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role !== undefined && { role }),
        ...(avatar !== undefined && { avatar }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(barber);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar barbeiro" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    await prisma.barber.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir barbeiro" }, { status: 500 });
  }
}
