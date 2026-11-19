import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barbershopId = searchParams.get("barbershopId");

    const services = await prisma.service.findMany({
      where: barbershopId ? { barbershopId } : undefined,
      orderBy: { category: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar serviços" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, durationMin, category, image, barbershopId } = body;

    if (!name || price === undefined || !barbershopId) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || "",
        price: Number(price),
        durationMin: Number(durationMin) || 30,
        category: category || "Cabelo",
        image: image || null,
        barbershopId,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar serviço" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, price, durationMin, category, image, active } = body;

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(durationMin !== undefined && { durationMin: Number(durationMin) }),
        ...(category && { category }),
        ...(image !== undefined && { image }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar serviço" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir serviço" }, { status: 500 });
  }
}
