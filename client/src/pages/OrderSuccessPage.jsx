import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const OrderSuccessPage = () => {
    const { orderId } = useParams();
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/orders/${orderId}`);
                // Parse shippingAddress if it's stored as a string
                if (data && typeof data.shippingAddress === 'string') {
                    try { data.shippingAddress = JSON.parse(data.shippingAddress); } catch(e) { /* ignore */ }
                }
                setOrder(data);
            } catch (err) {
                console.error('Fetch order error:', err);
                setError(err.response?.data?.error || 'Order not found');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrder();
        window.scrollTo(0, 0);
    }, [orderId]);

    if (loading) return (
        <div className="order-success-status">
            <div className="spinner"></div>
            <p>Confirming your performance gear...</p>
        </div>
    );

    if (error || !order) return (
        <div className="order-success-status error-state">
            <div className="error-icon">⚠️</div>
            <h2>ORDER NOT FOUND</h2>
            <p>We couldn&apos;t load your order details. Check your account page for order history.</p>
            <div className="error-actions">
                <Link to="/" className="btn-p">CONTINUE SHOPPING</Link>
                <Link to="/account" className="btn-s">VIEW MY ORDERS</Link>
            </div>
        </div>
    );

    return (
        <div className="order-success-container">
            <div className="success-wrapper">
                {/* ── ANIMATED CHECKMARK ── */}
                <div className="success-icon-wrap">
                    <div className="tick-circle">
                        <div className="tick-mark"></div>
                    </div>
                </div>

                <div className="success-hero">
                    <div className="status-pill Confirmed">Confirmed</div>
                    <h1>THANK YOU FOR YOUR ORDER</h1>
                    <p className="order-tag">Order ID: #{orderId}</p>
                </div>

                <div className="order-card shadow-lg">
                    <p className="delivery-p">Expected Delivery: <span className="highlight">3–5 Business Days</span></p>
                    
                    <div className="order-split">
                        {/* Left: Items List */}
                        <div className="order-items-col">
                            <h3>ORDER SUMMARY</h3>
                            <div className="items-scroll">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-row-item">
                                        <div className="row-item-info">
                                            <span className="row-item-name">{item.name}</span>
                                            <span className="row-item-qty">Size EU {item.size} × {item.quantity}</span>
                                        </div>
                                        <span className="row-item-price">{formatter.format(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="order-pricing-box">
                                <div className="p-line">
                                    <span>Subtotal</span>
                                    <span>{formatter.format(order.itemsPrice)}</span>
                                </div>
                                <div className="p-line">
                                    <span>Shipping</span>
                                    <span className={order.shippingPrice === 0 ? 'free-tag' : ''}>
                                        {order.shippingPrice === 0 ? 'FREE' : formatter.format(order.shippingPrice)}
                                    </span>
                                </div>
                                <div className="p-line total-line">
                                    <span>Total Paid</span>
                                    <span>{formatter.format(order.total || 0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Shipping Address */}
                        <div className="order-address-col">
                            <h3>SHIPPING TO</h3>
                            <div className="address-display">
                                <p className="a-name">{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.address1}</p>
                                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                <p>{order.shippingAddress.pin}</p>
                                <p className="a-phone">T: {order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="success-actions-bottom">
                    <Link to="/" className="cta-secondary">CONTINUE SHOPPING</Link>
                    <Link to="/account" className="cta-primary">VIEW MY ORDERS</Link>
                </div>
            </div>

            <style>{`
                .order-success-container { min-height: 100vh; padding: 140px 1rem 5rem; display: flex; justify-content: center; background: #050505; }
                .success-wrapper { width: 100%; max-width: 800px; text-align: center; }

                /* Tick Animation */
                .success-icon-wrap { margin-bottom: 2rem; display: flex; justify-content: center; }
                .tick-circle {
                    width: 70px; height: 70px; border-radius: 50%; border: 3px solid #22c55e;
                    position: relative; animation: circleGrow 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .tick-mark {
                    position: absolute; 
                    top: 35px; 
                    left: 20px; 
                    width: 28px; 
                    height: 14px;
                    border-left: 6px solid #22c55e; 
                    border-bottom: 6px solid #22c55e;
                    transform: rotate(-45deg) scale(0);
                    transform-origin: left top;
                    animation: tickPop 0.4s 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes circleGrow { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes tickPop { to { transform: rotate(-45deg) scale(1); } }

                .success-hero h1 { font-family: var(--font-bebas); font-size: 3.5rem; letter-spacing: 0.1em; margin: 1.5rem 0 0.5rem; }
                .order-tag { color: #555; font-weight: 700; font-family: var(--font-space); font-size: 0.8rem; margin-bottom: 3rem; }
                .status-pill { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; }
                .status-pill.Confirmed { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }

                .order-card { background: #0c0c0c; border: 1px solid #1a1a1a; border-radius: 12px; padding: 3rem; text-align: left; }
                .delivery-p { font-size: 0.95rem; font-weight: 600; color: #888; text-align: center; margin-bottom: 3rem; }
                .highlight { color: #fff; text-decoration: underline; text-underline-offset: 4px; }

                .order-split { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 4rem; }
                @media (max-width: 700px) { .order-split { grid-template-columns: 1fr; gap: 3rem; } }

                .order-items-col h3, .order-address-col h3 { font-size: 0.7rem; font-weight: 800; color: #444; letter-spacing: 0.1em; margin-bottom: 1.5rem; }
                
                .items-scroll { max-height: 250px; overflow-y: auto; margin-bottom: 2rem; border-bottom: 1px solid #151515; }
                .order-row-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-right: 1rem; }
                .row-item-info { display: flex; flex-direction: column; gap: 4px; }
                .row-item-name { font-size: 0.9rem; font-weight: 700; color: #fff; }
                .row-item-qty { font-size: 0.75rem; color: #555; }
                .row-item-price { font-size: 0.85rem; font-weight: 700; }

                .order-pricing-box { display: flex; flex-direction: column; gap: 0.8rem; }
                .p-line { display: flex; justify-content: space-between; font-size: 0.85rem; color: #666; font-weight: 600; }
                .free-tag { color: #22c55e; }
                .total-line { border-top: 1px solid #222; padding-top: 1rem; margin-top: 0.5rem; color: #fff; font-size: 1.1rem; font-weight: 900; }

                .address-display { display: flex; flex-direction: column; gap: 4px; }
                .address-display p { font-size: 0.9rem; color: #888; margin: 0; }
                .a-name { font-weight: 800; color: #fff; margin-bottom: 6px !important; }
                .a-phone { margin-top: 10px !important; font-size: 0.8rem !important; }

                .success-actions-bottom { margin-top: 3rem; display: flex; justify-content: center; gap: 1rem; }
                .cta-primary, .cta-secondary { padding: 1rem 2rem; border-radius: 4px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; text-decoration: none; transition: 0.2s; }
                .cta-primary { background: #fff; color: #000; }
                .cta-secondary { background: transparent; color: #fff; border: 1px solid #333; }
                .cta-primary:hover { transform: translateY(-2px); opacity: 0.9; }
                .cta-secondary:hover { border-color: #555; background: #0c0c0c; }

                .order-success-status { min-height: 100vh; padding-top: 140px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 1.5rem; color: #555; }
                .spinner { width: 30px; height: 30px; border: 2px solid #111; border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .error-state { text-align: center; max-width: 400px; }
                .error-icon { font-size: 3rem; margin-bottom: 1rem; }
                .error-state h2 { font-family: var(--font-bebas); font-size: 2rem; color: #fff; margin-bottom: 1rem; }
                .error-state p { font-size: 0.9rem; line-height: 1.6; margin-bottom: 2rem; }
                .error-actions { display: flex; gap: 1rem; justify-content: center; }
                .btn-p, .btn-s { padding: 10px 16px; border-radius: 4px; font-size: 0.7rem; font-weight: 800; text-decoration: none; }
                .btn-p { background: #fff; color: #000; }
                .btn-s { border: 1px solid #333; color: #fff; }
            `}</style>
        </div>
    );
};

export default OrderSuccessPage;
