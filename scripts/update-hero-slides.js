const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateSlides() {
  const s1 = await prisma.heroSlide.updateMany({
    where: { order: 1 },
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1920&q=85',
      bgGradient: 'from-stone-950/95 via-stone-950/70 to-transparent'
    }
  });

  const s2 = await prisma.heroSlide.updateMany({
    where: { order: 2 },
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1920&q=85',
      bgGradient: 'from-stone-950/95 via-stone-950/70 to-transparent'
    }
  });

  const s3 = await prisma.heroSlide.updateMany({
    where: { order: 3 },
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1920&q=85',
      bgGradient: 'from-stone-950/95 via-stone-950/70 to-transparent'
    }
  });

  console.log('Successfully updated hero slides in database:', { s1, s2, s3 });
}

updateSlides()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
