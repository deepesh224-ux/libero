const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();

// POST /api/newsletter
router.post('/', [
  body('email').isEmail().withMessage('Valid email is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const existing = await prisma.subscriber.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    await prisma.subscriber.create({
      data: { email: email.toLowerCase() },
    });
    
    res.status(201).json({ message: 'Welcome to the LIBERO family.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
