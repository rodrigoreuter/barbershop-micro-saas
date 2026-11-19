import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingTicketView } from "@/components/booking/BookingTicketView";

export const dynamic = "force-dynamic";

interface BookingPageProps {
  params: Promise<{ barbershopSlug: string; id: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { barbershopSlug, id } = await params;

  const booking = await prisma.booking.findFirst({
    where: {
      OR: [{ id }, { code: id }],
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

  if (!booking) {
    notFound();
  }

  return (
    <BookingTicketView
      booking={booking}
      barbershopSlug={barbershopSlug}
    />
  );
}
