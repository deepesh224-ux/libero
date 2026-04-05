const router = require('express').Router();
const prisma = require('../lib/prisma');

// POST /api/cart/validate — validate cart items before checkout
router.post('/validate', async (req, res) => {
  try {
    const { items } = req.body;
    const results = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      results.push({
        productId: item.productId,
        available: product ? product.countInStock >= item.quantity : false,
        currentPrice: product?.price,
        inStock: product?.countInStock ?? 0,
      });
    }

    const allAvailable = results.every(r => r.available);
    res.json({ valid: allAvailable, items: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
