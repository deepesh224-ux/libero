const prisma = require('./lib/prisma');

async function main() {
  await prisma.product.deleteMany();

  const products = [
    {
      name: 'LIBERO CLASSICO',
      description: 'Handcrafted full grain leather boot designed for ultimate comfort and control.',
      price: 14999,
      category: 'FG',
      image: '/assets/classico.png',
      countInStock: 50,
    },
    {
      name: 'LIBERO NERO',
      description: 'The dark knight of the pitch. Sleek, stealthy, and powerful.',
      price: 18499,
      category: 'FG/AG',
      image: '/assets/nero.png',
      countInStock: 30,
    },
    {
      name: "LIBERO HERITAGE '82",
      description: 'A tribute to the 1982 World Cup. Classic stripes, modern soul.',
      price: 22999,
      category: 'FG',
      image: '/assets/1982.png',
      countInStock: 20,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('✓ Database seeded with LIBERO products');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
