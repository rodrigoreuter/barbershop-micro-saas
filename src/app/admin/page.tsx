import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Buscar a barbearia cadastrada
  const barbershop = await prisma.barbershop.findFirst({
    include: {
      barbers: { orderBy: { createdAt: "asc" } },
      services: { orderBy: { category: "asc" } },
      products: { orderBy: { name: "asc" } },
    },
  });

  if (!barbershop) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <p className="text-white/60">Nenhuma barbearia cadastrada. Execute o seed do banco de dados.</p>
      </div>
    );
  }

  const bookings = await prisma.booking.findMany({
    where: { barbershopId: barbershop.id },
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
          phone: true,
          address: true,
          pixKey: true,
        },
      },
    },
    orderBy: {
      dateTime: "desc",
    },
  });

  return (
    <AdminDashboard
      barbershop={barbershop}
      initialBookings={JSON.parse(JSON.stringify(bookings))}
      initialServices={JSON.parse(JSON.stringify(barbershop.services))}
      initialProducts={JSON.parse(JSON.stringify(barbershop.products))}
      initialBarbers={JSON.parse(JSON.stringify(barbershop.barbers))}
    />
  );
}
