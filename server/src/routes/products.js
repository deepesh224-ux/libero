const express = require('express');
const prisma = require('../lib/prisma');
// const { protect, adminOnly } = require('../middleware/auth'); // Placeholder

const router = express.Router();

// GET /api/products — all products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = category.toUpperCase();
    }
    
    const products = await prisma.product.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
