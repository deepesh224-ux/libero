const prisma = require('./lib/prisma');

async function main() {
  // Clean up existing data
  await prisma.product.deleteMany();
  await prisma.siteReview.deleteMany();

  const products = [
    {
      name: 'Predator Elite FG',
      description: 'Strikeskin technology combined with a HybridTouch 2.0 upper for ultimate control. Designed for the master of the pitch.',
      price: 21999,
      originalPrice: 24999,
      badge: 'NEW',
      category: 'FG',
      image: 'https://source.unsplash.com/800x800/?football+boots+adidas',
      rating: 4.9,
      reviewCount: 124,
      countInStock: 15,
    },
    {
      name: 'Phantom GX Elite AG',
      description: 'Gripknit upper provides unparalleled touch in any weather condition. Optimized stud pattern for artificial grass performance.',
      price: 19499,
      originalPrice: 22499,
      badge: 'BESTSELLER',
      category: 'AG',
      image: 'https://source.unsplash.com/800x800/?football+boots+nike',
      rating: 4.8,
      reviewCount: 98,
      countInStock: 22,
    },
    {
      name: 'Mercurial Superfly 9 SG',
      description: 'Features a Zoom Air unit for explosive speed. Soft ground configuration provides maximum traction on wet pitches.',
      price: 23999,
      originalPrice: 26999,
      badge: 'NEW',
      category: 'SG',
      image: 'https://source.unsplash.com/800x800/?football+boots+mercurial',
      rating: 5.0,
      reviewCount: 45,
      countInStock: 8,
    },
    {
      name: 'Copa Pure.2 FG',
      description: 'Premium Fusionskin leather for a seamless touch and quilted comfort. The modern classic for traditional players.',
      price: 14999,
      originalPrice: 17999,
      badge: 'SALE',
      category: 'FG',
      image: 'https://source.unsplash.com/800x800/?football+boots+leather',
      rating: 4.7,
      reviewCount: 210,
      countInStock: 30,
    },
    {
      name: 'X Crazyfast Elite IC',
      description: 'Aeropacity Speedskin for a second-skin feel and incredible pace. Non-marking outsole tuned for indoor court dominance.',
      price: 11999,
      originalPrice: 13999,
      badge: null,
      category: 'IC',
      image: 'https://source.unsplash.com/800x800/?football+boots+speed',
      rating: 4.6,
      reviewCount: 67,
      countInStock: 12,
    },
    {
      name: 'F50 Adizero Limited',
      description: 'Ultra-lightweight construction with a Sprintframe sole. A collectors limited drop for the fastest on the planet.',
      price: 24999,
      badge: 'BESTSELLER',
      category: 'FG',
      image: 'https://source.unsplash.com/800x800/?football+boots+limited',
      rating: 4.9,
      reviewCount: 341,
      countInStock: 5,
    },
    {
      name: 'Tiempo Legend 10 AG',
      description: 'FlyTouch Plus engineered leather that is softer than natural hide. Perfect for playmakers on synthetic surfaces.',
      price: 18999,
      originalPrice: 20999,
      badge: 'SALE',
      category: 'AG',
      image: 'https://source.unsplash.com/800x800/?football+boots+tiempo',
      rating: 4.8,
      reviewCount: 156,
      countInStock: 18,
    },
    {
      name: 'Puma Future 7 FG/AG',
      description: 'FUZIONFIT360 upper with PWRTAPE support for a custom locked-in feel. Dynamic Motion System outsole for agility.',
      price: 16999,
      badge: 'NEW',
      category: 'FG',
      image: 'https://source.unsplash.com/800x800/?football+boots+puma',
      rating: 4.7,
      reviewCount: 89,
      countInStock: 25,
    },
    {
      name: 'Morelia Neo IV SG',
      description: 'Handcrafted in Japan with elite K-Leather. The pinnacle of lightweight comfort and soft ground traction.',
      price: 22499,
      originalPrice: 25999,
      badge: 'BESTSELLER',
      category: 'SG',
      image: 'https://source.unsplash.com/800x800/?football+boots+mizuno',
      rating: 5.0,
      reviewCount: 32,
      countInStock: 7,
    },
    {
      name: 'Nike Streetgato IC',
      description: 'Combines performance design with streetwear style. Suede upper and rubber sole for urban pitch control.',
      price: 8499,
      originalPrice: 9999,
      badge: 'SALE',
      category: 'IC',
      image: 'https://source.unsplash.com/800x800/?soccer+boots+indoor',
      rating: 4.5,
      reviewCount: 112,
      countInStock: 20,
    },
    {
      name: 'Predator 24 Gold AG',
      description: 'Exclusive anniversary edition with metallic gold finish. Precision Power elements for clinical finishing on turf.',
      price: 25999,
      badge: 'BESTSELLER',
      category: 'AG',
      image: 'https://source.unsplash.com/800x800/?football+boots+gold',
      rating: 4.9,
      reviewCount: 15,
      countInStock: 3,
    },
    {
      name: 'Adidas Gloro FG',
      description: 'The return of the iconic fold-over tongue and premium leather. Timeless elegance and reliable performance.',
      price: 9999,
      originalPrice: 11999,
      badge: null,
      category: 'FG',
      image: 'https://source.unsplash.com/800x800/?football+boots+classic',
      rating: 4.6,
      reviewCount: 245,
      countInStock: 40,
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  const siteReviews = [
    {
      name: 'Arjun M. 🇮🇳',
      boot: 'Predator Elite FG',
      stars: 5,
      text: '"The Gripknit on these is a game changer. Best control I have had in years."',
      verified: true
    },
    {
      name: 'Luca B. 🇮🇹',
      boot: 'Morelia Neo IV SG',
      stars: 5,
      text: '"Japanese craftsmanship at its best. Worth every rupee for that leather touch."',
      verified: true
    },
    {
      name: 'Siddharth R. 🇮🇳',
      boot: 'Mercurial Superfly 9',
      stars: 4,
      text: '"Pure speed. A bit tight at first but molded perfectly after two matches."',
      verified: true
    }
  ];

  for (const review of siteReviews) {
    await prisma.siteReview.create({ data: review });
  }

  console.log(`✓ Database seeded with ${products.length} Professional Boots and 3 Site Reviews`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
