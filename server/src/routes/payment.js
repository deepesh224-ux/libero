const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id_for_tests',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret_for_tests',
});

// ── CREATE ORDER (RAZORPAY side) ─────────────────────────────────────────────
router.post('/create-order', protect, async (req, res) => {
    try {
        const { amount } = req.body; // Amount in paise
        
        const options = {
            amount: Number(amount),
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const rzpOrder = await razorpay.orders.create(options);

        res.json({
            razorpayOrderId: rzpOrder.id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.error('RZP Create Order Error:', err);
        res.status(500).json({ error: 'Failed to create payment order' });
    }
});

// ── VERIFY PAYMENT ───────────────────────────────────────────────────────────
router.post('/verify', protect, async (req, res) => {
    try {
        const { 
            razorpayOrderId, 
            razorpayPaymentId, 
            razorpaySignature, 
            internalOrderId 
        } = req.body;

        const body = razorpayOrderId + "|" + razorpayPaymentId;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpaySignature) {
            // Update order status in DB
            await prisma.order.update({
                where: { id: Number(internalOrderId) },
                data: { 
                    status: 'confirmed',
                    paymentId: razorpayPaymentId 
                },
            });

            res.json({ success: true, orderId: internalOrderId });
        } else {
            res.status(400).json({ error: 'Invalid payment signature' });
        }
    } catch (err) {
        console.error('RZP Verify Error:', err);
        res.status(500).json({ error: 'Payment verification failed' });
    }
});

module.exports = router;
