const router = require('express').Router();
const prisma = require('../lib/prisma');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/newsletter — public subscribe
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Already subscribed' });

    await prisma.subscriber.create({ data: { email } });
    res.json({ success: true, message: 'Subscribed! Welcome to the LIBERO legacy.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/newsletter — admin: view subscribers
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const subs = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
