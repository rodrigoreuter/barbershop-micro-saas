import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const barbershop = await prisma.barbershop.findUnique({
      where: { slug },
      include: {
        barbers: {
          where: { active: true },
        },
        services: {
          where: { active: true },
          orderBy: { category: "asc" },
        },
        products: {
          where: { active: true },
        },
      },
    });

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbearia não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(barbershop);
  } catch (error) {
    console.error("Erro ao buscar barbearia:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const {
      name,
      description,
      logo,
      coverImage,
      address,
      phone,
      instagram,
      pixKey,
      openingTime,
      closingTime,
      slotInterval,
    } = body;

    const updated = await prisma.barbershop.update({
      where: { slug },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(logo !== undefined && { logo }),
        ...(coverImage !== undefined && { coverImage }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(instagram !== undefined && { instagram }),
        ...(pixKey !== undefined && { pixKey }),
        ...(openingTime !== undefined && { openingTime }),
        ...(closingTime !== undefined && { closingTime }),
        ...(slotInterval !== undefined && { slotInterval: Number(slotInterval) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar dados da barbearia:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar dados da barbearia" },
      { status: 500 }
    );
  }
}
