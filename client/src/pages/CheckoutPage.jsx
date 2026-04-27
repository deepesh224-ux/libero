import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, cartTotal, clearCart } = useCart();

    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        pin: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // ── CONFIG & HELPERS ───────────────────────────────────────────────────────
    
    useEffect(() => {
        if (cartItems.length === 0 && !loading) {
            navigate('/', { replace: true });
        }
    }, [cartItems, navigate, loading]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const shippingFee = cartTotal >= 5000 ? 0 : 40;
    const grandTotal = cartTotal + shippingFee;

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    // ── NAVIGATION & VALIDATION ───────────────────────────────────────────────

    const validateStep1 = () => {
        const newErrors = {};
        if (!form.phone || !/^\d{10}$/.test(form.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
        if (!form.address1) newErrors.address1 = 'Address is required';
        if (!form.city) newErrors.city = 'City is required';
        if (!form.state) newErrors.state = 'State is required';
        if (!form.pin || !/^\d{6}$/.test(form.pin)) newErrors.pin = 'Enter a valid 6-digit pincode';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (currentStep === 1 && !validateStep1()) return;
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    // ── RAZORPAY LOGIC ────────────────────────────────────────────────────────

    const handleFinalPayment = async () => {
        setLoading(true);
        setApiError('');

        try {
            // 1. Create Internal Order
            const { data: internalOrder } = await api.post('/orders', {
                items: cartItems.map(i => ({ 
                    productId: i.productId, 
                    name: i.name, 
                    size: i.size, 
                    quantity: i.quantity, 
                    price: i.price 
                })),
                shippingAddress: form,
                itemsPrice: cartTotal,
                shippingPrice: shippingFee,
                totalPrice: grandTotal
            });

            // 2. Create Razorpay order
            const rzpRes = await api.post('/payment/create-order', {
                amount: grandTotal * 100 // convert ₹ to paise
            });

            // 3. Open Razorpay checkout
            const options = {
                key: rzpRes.data.keyId,
                amount: rzpRes.data.amount,
                currency: 'INR',
                order_id: rzpRes.data.razorpayOrderId,
                name: 'LIBERO Italia',
                description: 'Football Boots Order',
                handler: async (response) => {
                    try {
                        await api.post('/payment/verify', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            internalOrderId: internalOrder.id || internalOrder._id
                        });
                        toast.success('Order placed successfully!');
                        clearCart();
                        const orderId = internalOrder.id || internalOrder._id;
                        navigate(`/order-success/${orderId}`);
                    } catch (err) {
                        toast.error(err.response?.data?.error || 'Payment verification failed');
                        setApiError('Payment verification failed. Please contact support.');
                        setLoading(false);
                    }
                },
                prefill: { 
                    name: form.name, 
                    email: user?.email,
                    contact: form.phone 
                },
                theme: { color: '#c41e3a' },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error('Payment Flow Error:', err);
            const msg = err.response?.data?.error || 'Payment initiation failed. Please try again.';
            toast.error(msg);
            setApiError(msg);
            setLoading(false);
        }
    };

    // ── RENDER ────────────────────────────────────────────────────────────────

    return (
        <div className="checkout-page">
            <button onClick={() => navigate(-1)} className="checkout-back-btn">
                ← BACK TO SHOPPING
            </button>

            <div className="checkout-container">
                <header className="checkout-stepper">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}><span>1</span> SHIPPING</div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}><span>2</span> REVIEW</div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}><span>3</span> PAYMENT</div>
                </header>

                <main className="checkout-layout">
                    {/* ── LEFT: DYNAMIC STEP CONTENT ── */}
                    <div className="checkout-main-content">
                        {currentStep === 1 && (
                            <section className="checkout-step-pane">
                                <h3>SHIPPING ADDRESS</h3>
                                <div className="form-grid">
                                    <div className="f-grp full"><label>NAME</label><input value={form.name} disabled /></div>
                                    <div className="f-grp full"><label>EMAIL</label><input value={form.email} disabled /></div>
                                    <div className="f-grp full">
                                        <label>PHONE (10 DIGITS)</label>
                                        <input name="phone" value={form.phone} onChange={handleChange} className={errors.phone ? 'err' : ''} />
                                        {errors.phone && <small className="err-msg">{errors.phone}</small>}
                                    </div>
                                    <div className="f-grp full">
                                        <label>STREET ADDRESS</label>
                                        <input name="address1" value={form.address1} onChange={handleChange} className={errors.address1 ? 'err' : ''} />
                                        {errors.address1 && <small className="err-msg">{errors.address1}</small>}
                                    </div>
                                    <div className="f-grp full"><label>ADDRESS 2 (OPTIONAL)</label><input name="address2" value={form.address2} onChange={handleChange} /></div>
                                    <div className="f-grp">
                                        <label>CITY</label>
                                        <input name="city" value={form.city} onChange={handleChange} className={errors.city ? 'err' : ''} />
                                        {errors.city && <small className="err-msg">{errors.city}</small>}
                                    </div>
                                    <div className="f-grp">
                                        <label>STATE</label>
                                        <input name="state" value={form.state} onChange={handleChange} className={errors.state ? 'err' : ''} />
                                        {errors.state && <small className="err-msg">{errors.state}</small>}
                                    </div>
                                    <div className="f-grp full">
                                        <label>PINCODE (6 DIGITS)</label>
                                        <input name="pin" value={form.pin} onChange={handleChange} className={errors.pin ? 'err' : ''} />
                                        {errors.pin && <small className="err-msg">{errors.pin}</small>}
                                    </div>
                                </div>
                                <button className="checkout-next-btn" onClick={nextStep}>CONTINUE TO REVIEW</button>
                            </section>
                        )}

                        {currentStep === 2 && (
                            <section className="checkout-step-pane">
                                <h3>ORDER REVIEW</h3>
                                <div className="review-shipping">
                                    <p><strong>Deliver to:</strong> {form.name}</p>
                                    <p>{form.address1}, {form.city}, {form.state} - {form.pin}</p>
                                    <p>Phone: {form.phone}</p>
                                    <button className="text-btn" onClick={prevStep}>Change Address</button>
                                </div>
                                <div className="review-items">
                                    {cartItems.map((item, i) => (
                                        <div key={i} className="rev-item">
                                            <div className="rev-item-info">
                                                <span>{item.name}</span>
                                                <small>SIZE {item.size} × {item.quantity}</small>
                                            </div>
                                            <span>{formatter.format(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="checkout-next-btn" onClick={nextStep}>PROCEED TO PAYMENT</button>
                            </section>
                        )}

                        {currentStep === 3 && (
                            <section className="checkout-step-pane p-center">
                                <div className="payment-ready-card">
                                    <h3>PAYMENT</h3>
                                    <p>Secure payment via Razorpay. Currently accepting UPI, Cards, and Netbanking.</p>
                                    <div className="pay-amount">{formatter.format(grandTotal)}</div>
                                    {apiError && <div className="api-error">{apiError}</div>}
                                    <button className="pay-btn" onClick={handleFinalPayment} disabled={loading}>
                                        {loading ? 'PROCESSING...' : 'PAY NOW'}
                                    </button>
                                    <button className="text-btn" onClick={prevStep}>Go Back</button>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* ── RIGHT: SUMMARY SIDEBAR ── */}
                    <aside className="checkout-sidebar">
                        <div className="mini-summary">
                            <h4>TOTAL</h4>
                            <div className="s-row"><span>Subtotal</span><span>{formatter.format(cartTotal)}</span></div>
                            <div className="s-row"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : formatter.format(shippingFee)}</span></div>
                            <div className="s-row final"><span>Amount to Pay</span><span>{formatter.format(grandTotal)}</span></div>
                        </div>
                    </aside>
                </main>
            </div>

            <style>{`
                .checkout-page { min-height: 100vh; background: #080808; color: white; padding: 100px 1rem 5rem; }
                .checkout-container { max-width: 1000px; margin: 0 auto; }
                
                .checkout-back-btn { background: none; border: none; color: #666; font-size: 0.75rem; font-weight: 700; cursor: pointer; margin-bottom: 2rem; }
                .checkout-back-btn:hover { color: #fff; }

                .checkout-stepper { display: flex; justify-content: center; gap: 3rem; margin-bottom: 4rem; padding-bottom: 2rem; border-bottom: 1px solid #1a1a1a; }
                .step { display: flex; align-items: center; gap: 0.8rem; font-size: 0.7rem; font-weight: 800; color: #333; letter-spacing: 0.1em; }
                .step span { width: 24px; height: 24px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.6rem; }
                .step.active { color: #fff; }
                .step.active span { border-color: #E8E8E8; color: #E8E8E8; }

                .checkout-layout { display: grid; grid-template-columns: 1fr 320px; gap: 4rem; }
                @media (max-width: 850px) { .checkout-layout { grid-template-columns: 1fr; } }

                .checkout-step-pane h3 { font-family: var(--font-bebas); font-size: 1.5rem; letter-spacing: 0.1em; margin-bottom: 2rem; }
                
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .f-grp.full { grid-column: span 2; }
                .f-grp label { display: block; font-size: 0.6rem; font-weight: 800; color: #555; margin-bottom: 0.5rem; }
                .f-grp input { width: 100%; background: #111; border: 1px solid #222; padding: 12px; color: #fff; font-family: var(--font-inter); outline: none; border-radius: 4px; }
                .f-grp input:focus { border-color: #444; }
                .f-grp input.err { border-color: #ff4d4d; }
                .err-msg { color: #ff4d4d; font-size: 0.6rem; font-weight: 700; margin-top: 5px; display: block; }

                .checkout-next-btn { width: 100%; background: white; color: black; border: none; padding: 15px; font-weight: 800; font-size: 0.8rem; cursor: pointer; margin-top: 2rem; border-radius: 4px; }
                
                .review-shipping { background: #111; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; }
                .review-shipping p { font-size: 0.85rem; color: #aaa; line-height: 1.6; }
                .review-items { display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid #1a1a1a; padding-top: 1.5rem; }
                .rev-item { display: flex; justify-content: space-between; align-items: center; }
                .rev-item-info { display: flex; flex-direction: column; }
                .rev-item-info span { font-size: 0.85rem; font-weight: 600; }
                .rev-item-info small { font-size: 0.65rem; color: #555; }

                .payment-ready-card { text-align: center; background: #111; padding: 3rem; border-radius: 12px; border: 1px solid #222; }
                .pay-amount { font-family: var(--font-bebas); font-size: 3rem; color: #E8E8E8; margin: 1.5rem 0; }
                .pay-btn { background: #E8E8E8; color: #000; border: none; width: 100%; padding: 15px; font-weight: 900; font-size: 0.9rem; cursor: pointer; border-radius: 4px; }
                .text-btn { background: none; border: none; color: #555; font-size: 0.7rem; font-weight: 700; cursor: pointer; margin-top: 1rem; text-decoration: underline; }

                .mini-summary { background: #111; padding: 2rem; border-radius: 12px; border: 1px solid #1a1a1a; position: sticky; top: 120px; }
                .mini-summary h4 { font-family: var(--font-bebas); font-size: 1rem; margin-bottom: 1.5rem; color: #444; }
                .s-row { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 1rem; color: #888; }
                .s-row.final { border-top: 1px solid #222; padding-top: 1rem; color: #fff; font-weight: 800; font-size: 1.1rem; }
                
                .api-error { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; border: 1px solid #ff4d4d; padding: 10px; margin-bottom: 1rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
            `}</style>
        </div>
    );
};

export default CheckoutPage;

