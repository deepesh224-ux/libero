const prisma = require('./lib/prisma');

async function main() {
  await prisma.product.deleteMany();
  await prisma.siteReview.deleteMany();

  const products = [
    {
      name: 'LIBERO CLASSICO',
      description: 'Handcrafted full grain leather boot designed for ultimate comfort and control.',
      price: 14999,
      badge: 'BESTSELLER',
      category: 'FG',
      image: 'CLASSICO',
      rating: 4.9,
      reviewCount: 284,
      countInStock: 50,
    },
    {
      name: 'LIBERO NERO',
      description: 'The dark knight of the pitch. Sleek, stealthy, and powerful.',
      price: 18499,
      badge: 'NEW DROP',
      category: 'FG/AG',
      image: 'NERO',
      rating: 5.0,
      reviewCount: 47,
      countInStock: 30,
    },
    {
      name: "LIBERO HERITAGE '82",
      description: 'A tribute to the 1982 World Cup. Classic stripes, modern soul.',
      price: 22999,
      badge: 'LIMITED ED.',
      category: 'FG',
      image: '1982',
      rating: 4.8,
      reviewCount: 128,
      countInStock: 20,
    },
    {
      name: "LIBERO VELOCE",
      description: 'Built for speed and agility. Engineered specifically for artificial grass.',
      price: 11999,
      badge: 'AG SPECIAL',
      category: 'AG',
      image: 'VELOCE',
      rating: 4.7,
      reviewCount: 203,
      countInStock: 100,
    },
    {
      name: "LIBERO ARENA",
      description: 'Dominate the turf cages. High grip outsole and reinforced toe.',
      price: 8999,
      originalPrice: 11999,
      badge: 'SALE -25%',
      category: 'TF',
      image: 'ARENA',
      rating: 4.6,
      reviewCount: 89,
      countInStock: 15,
    },
    {
      name: "LIBERO ORIGINS",
      description: 'The boot that started it all, recreated with modern materials.',
      price: 16499,
      badge: "COLLECTOR'S",
      category: 'FG',
      image: 'ORIGINS',
      rating: 4.9,
      reviewCount: 341,
      countInStock: 5,
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  const reviews = [
    {
      name: 'Vikram S. 🇮🇳',
      boot: 'LIBERO CLASSICO',
      stars: 5,
      text: '"Wore these for 3 seasons. The leather has aged beautifully and the stud grip is still perfect."',
      verified: true
    },
    {
      name: 'Marco R. 🇮🇹',
      boot: "LIBERO HERITAGE '82",
      stars: 5,
      text: '"My grandfather wore these in 1982. I now own a pair. The quality is identical. Remarkable."',
      verified: true
    },
    {
      name: 'Aditya K. 🇮🇳',
      boot: 'LIBERO VELOCE',
      stars: 4,
      text: '"Best AG boot I have tried. The Italian detail on the stripes makes it feel special every match."',
      verified: true
    }
  ];

  for (const review of reviews) {
    await prisma.siteReview.create({ data: review });
  }

  console.log('✓ Database seeded with 6 LIBERO products and 3 Site Reviews');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
