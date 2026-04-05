const router = require('express').Router();
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');

// GET /api/reviews/site — homepage reviews
router.get('/site', async (req, res) => {
  try {
    const reviews = await prisma.siteReview.findMany();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews/:productId — add product review
router.post('/:productId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = Number(req.params.productId);

    const already = await prisma.review.findFirst({
      where: { productId, userId: req.user.id }
    });
    if (already) return res.status(400).json({ error: 'Already reviewed' });

    const review = await prisma.review.create({
      data: { productId, userId: req.user.id, rating, comment }
    });

    // Update product average rating
    const all = await prisma.review.findMany({ where: { productId } });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await prisma.product.update({
      where: { id: productId },
      data: { rating: Math.round(avg * 10) / 10, reviewCount: all.length }
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
