const router = require('express').Router();
const prisma = require('../lib/prisma');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/orders — place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, itemsPrice, shippingPrice, totalPrice } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'No items in order' });

    // Verify stock
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product) return res.status(404).json({ error: `Product ${item.productId} not found` });
      if (product.countInStock < item.quantity)
        return res.status(400).json({ error: `${product.name} is out of stock` });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        shippingAddress: JSON.stringify(shippingAddress),
        itemsPrice: Number(itemsPrice),
        shippingPrice: Number(shippingPrice),
        total: Number(totalPrice),
        status: 'pending_payment',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
      include: { items: true }
    });

    // Reduce stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { countInStock: { decrement: item.quantity } }
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/myorders — logged in user's orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { 
        userId: req.user.id,
        status: { not: 'pending_payment' }
      },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: { items: { include: { product: true } }, user: true }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not authorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders — admin: all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/status — admin update status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status))
      return res.status(400).json({ error: 'Invalid status' });

    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { status }
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
