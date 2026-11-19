import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientBookingFlow } from "@/components/booking/ClientBookingFlow";

export const dynamic = "force-dynamic";

interface BarbershopPageProps {
  params: Promise<{ barbershopSlug: string }>;
}

export default async function BarbershopPage({ params }: BarbershopPageProps) {
  const { barbershopSlug } = await params;

  const barbershop = await prisma.barbershop.findUnique({
    where: { slug: barbershopSlug },
    include: {
      barbers: { where: { active: true } },
      services: { where: { active: true }, orderBy: { category: "asc" } },
      products: { where: { active: true } },
    },
  });

  if (!barbershop) {
    notFound();
  }

  return <ClientBookingFlow barbershop={barbershop} />;
}
