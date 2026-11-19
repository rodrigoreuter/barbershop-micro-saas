const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Populando banco de dados com Barbearia VIP...");

  // Deletar dados antigos se existirem
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.product.deleteMany();
  await prisma.barber.deleteMany();
  await prisma.barbershop.deleteMany();

  // Criar Barbearia Principal
  const barbershop = await prisma.barbershop.create({
    data: {
      name: "The Royal Barber Club",
      slug: "royal-barber",
      description: "Excelência e sofisticação em cortes clássicos, barba com toalha quente e cuidados masculinos premium.",
      logo: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300&auto=format&fit=crop&q=80",
      coverImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&auto=format&fit=crop&q=80",
      address: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP",
      phone: "5511998765432",
      instagram: "@royalbarberclub",
      pixKey: "pix@royalbarber.com.br",
      openingTime: "09:00",
      closingTime: "20:00",
      slotInterval: 30,
    },
  });

  console.log(`✅ Barbearia criada: ${barbershop.name} (${barbershop.slug})`);

  // Criar Barbeiros
  const barber1 = await prisma.barber.create({
    data: {
      name: "Enzo 'Fade Master'",
      role: "Especialista em Fade & Freestyle",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      phone: "5511988881111",
      bio: "Mais de 8 anos transformando visuais com cortes modernos e degradês perfeitos.",
      rating: 4.9,
      barbershopId: barbershop.id,
    },
  });

  const barber2 = await prisma.barber.create({
    data: {
      name: "Mateus 'Don' Silva",
      role: "Mestre Barbeiro & Visagista",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      phone: "5511988882222",
      bio: "Especialista em barboterapia, cortes clássicos executivos e visagismo facial.",
      rating: 5.0,
      barbershopId: barbershop.id,
    },
  });

  const barber3 = await prisma.barber.create({
    data: {
      name: "Lucas 'Navalha' Costa",
      role: "Barbeiro Clássico",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      phone: "5511988883333",
      bio: "Precisão cirúrgica na navalha e finalizações impecáveis com produtos nobres.",
      rating: 4.8,
      barbershopId: barbershop.id,
    },
  });

  console.log("✅ 3 Barbeiros cadastrados");

  // Criar Serviços
  const servicesData = [
    {
      name: "Corte Executivo / Fade",
      description: "Corte sob medida com máquina e tesoura, finalizado com lavagem especial e pomada matte.",
      price: 65.0,
      durationMin: 45,
      category: "Cabelo",
      image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&auto=format&fit=crop&q=80",
      barbershopId: barbershop.id,
    },
    {
      name: "Barboterapia Premium",
      description: "Alinhamento com navalha, toalha quente com óleos essenciais, massagem facial e hidratação.",
      price: 50.0,
      durationMin: 35,
      category: "Barba",
      image: "https://images.unsplash.com/photo-1517832606589-7629c3397143?w=400&auto=format&fit=crop&q=80",
      barbershopId: barbershop.id,
    },
    {
      name: "Combo VIP (Cabelo + Barba + Bebida)",
      description: "Experiência completa: Corte estilizado, barboterapia relaxante e 1 cerveja artesanal cortesia.",
      price: 105.0,
      durationMin: 70,
      category: "Combos",
      image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format&fit=crop&q=80",
      barbershopId: barbershop.id,
    },
    {
      name: "Pigmentação de Barba & Cabelo",
      description: "Preenchimento de falhas e realce dos contornos com tintura hipoalergênica de alta durabilidade.",
      price: 45.0,
      durationMin: 25,
      category: "Estética",
      image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&auto=format&fit=crop&q=80",
      barbershopId: barbershop.id,
    },
    {
      name: "Camuflagem de Fios Brancos",
      description: "Tonalização suave e natural para disfarçar fios brancos com acabamento discreto e elegante.",
      price: 55.0,
      durationMin: 30,
      category: "Estética",
      image: "https://images.unsplash.com/photo-1584297091622-af8e5fd64324?w=400&auto=format&fit=crop&q=80",
      barbershopId: barbershop.id,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.create({ data: s });
  }
  console.log(`✅ ${servicesData.length} Serviços cadastrados`);

  // Criar Produtos
  const productsData = [
    {
      name: "Pomada Efeito Matte Extra Forte 100g",
      description: "Fixação prolongada sem brilho, ideal para topetes e penteados texturizados.",
      price: 48.0,
      category: "Finalizadores",
      image: "https://images.unsplash.com/photo-1597354984706-aec992c7d1d6?w=400&auto=format&fit=crop&q=80",
      stock: 15,
      barbershopId: barbershop.id,
    },
    {
      name: "Óleo Nutritivo para Barba Amadeirado 30ml",
      description: "Hidrata profundamente os fios da barba e a pele com fragrância nobre de cedro.",
      price: 39.9,
      category: "Barba",
      image: "https://images.unsplash.com/photo-1608248597359-0097726e6d1a?w=400&auto=format&fit=crop&q=80",
      stock: 20,
      barbershopId: barbershop.id,
    },
    {
      name: "Balm Modelador e Refrescante 120ml",
      description: "Acalma a pele pós-barba, reduz coceira e alinha fios rebeldes.",
      price: 42.0,
      category: "Barba",
      image: "https://images.unsplash.com/photo-1626015366551-789a7fb3d12d?w=400&auto=format&fit=crop&q=80",
      stock: 12,
      barbershopId: barbershop.id,
    },
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }
  console.log(`✅ ${productsData.length} Produtos cadastrados`);

  // Criar Agendamento Exemplo
  const sampleService = await prisma.service.findFirst({ where: { barbershopId: barbershop.id } });
  if (sampleService) {
    const bookingDate = new Date();
    bookingDate.setHours(15, 0, 0, 0);

    const booking = await prisma.booking.create({
      data: {
        code: "BRB-9412",
        clientName: "Rodrigo Silva",
        clientPhone: "5511999998888",
        clientNotes: "Prefere café sem açúcar",
        dateTime: bookingDate,
        totalAmount: sampleService.price,
        status: "CONFIRMED",
        barbershopId: barbershop.id,
        barberId: barber1.id,
        items: {
          create: [
            {
              serviceId: sampleService.id,
              price: sampleService.price,
            },
          ],
        },
      },
    });
    console.log(`✅ Agendamento de exemplo criado: #${booking.code}`);
  }

  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
