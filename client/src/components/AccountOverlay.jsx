import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AccountOverlay = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    useEffect(() => {
        if (!isOpen || !user) return;

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders', err);
                toast.error('Failed to load your order history');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isOpen, user]);

    // Handle ESC key to close
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleLogout = () => {
        logout();
        onClose();
    };

    const getStatusProps = (status) => {
        const s = (status || 'pending').toLowerCase();
        switch (s) {
            case 'pending': return { label: 'Pending', color: '#666' };
            case 'confirmed': return { label: 'Confirmed', color: '#3b82f6' };
            case 'shipped': return { label: 'Shipped', color: '#ffbf00' };
            case 'delivered': return { label: 'Delivered', color: '#22c55e' };
            default: return { label: status, color: '#555' };
        }
    };

    const SkeletonCard = () => (
        <div className="order-card skeleton-card">
            <div className="skeleton-line" style={{ width: '40%' }}></div>
            <div className="skeleton-grid">
                <div className="skeleton-line" style={{ width: '80%' }}></div>
                <div className="skeleton-line" style={{ width: '60%' }}></div>
            </div>
        </div>
    );

    return (
        <div className={`account-overlay ${isOpen ? 'active' : ''}`}>
            <div className="overlay-backdrop" onClick={onClose}></div>
            <div className="overlay-content">
                <button className="overlay-close-btn" onClick={onClose} aria-label="Close Account">✕</button>

                <div className="overlay-inner">
                    {/* ── PROFILE HEADER ── */}
                    <div className="profile-hero-mini">
                        <div className="user-meta">
                            <div className="avatar-ph">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="user-txt">
                                <h1>{user?.name || 'Account'}</h1>
                                <p>{user?.email || 'User Profile'}</p>
                            </div>
                        </div>
                        <button className="logout-trigger-mini" onClick={handleLogout}>
                            LOG OUT
                        </button>
                    </div>

                    {/* ── ORDERS LIST ── */}
                    <div className="orders-section">
                        <h2 className="section-title">ORDER HISTORY</h2>

                        {loading ? (
                            <div className="orders-grid-mini">
                                <SkeletonCard />
                                <SkeletonCard />
                            </div>
                        ) : !orders || orders.length === 0 ? (
                            <div className="empty-orders-mini">
                                <div className="empty-icon">📦</div>
                                <h3>You haven&apos;t placed any orders yet</h3>
                                <p>When you do, they&apos;ll appear here with their tracking status.</p>
                                <button className="shop-cta-mini" onClick={onClose}>CONTINUE SHOPPING</button>
                            </div>
                        ) : (
                            <div className="orders-grid-mini">
                                {orders.map((order) => {
                                    if (!order) return null;
                                    const { label, color } = getStatusProps(order.status);
                                    const orderDate = order.createdAt 
                                        ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                          })
                                        : 'Recent';

                                    const orderIdStr = order.id || order._id || 'UNKNOWN';

                                    return (
                                        <div key={orderIdStr} className="order-item-card-mini">
                                            <div className="card-top">
                                                <div className="order-id-date">
                                                    <span className="oid">Order #{orderIdStr.toString().slice(-6).toUpperCase()}</span>
                                                    <span className="dot">·</span>
                                                    <span className="odate">{orderDate}</span>
                                                </div>
                                                <div className="status-badge" style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}30` }}>
                                                    {label}
                                                </div>
                                            </div>

                                            <div className="card-items">
                                                {(order.items || []).slice(0, 2).map((item, i) => (
                                                    <div key={i} className="mini-item">
                                                        <span className="item-name">{item.name || 'Product'}</span>
                                                        <span className="item-size">EU {item.size || 'N/A'}</span>
                                                    </div>
                                                ))}
                                                {order.items && order.items.length > 2 && (
                                                    <div className="more-items">+ {order.items.length - 2} more items</div>
                                                )}
                                            </div>

                                            <div className="card-bottom">
                                                <div className="order-total">
                                                    <span className="total-label">Total Paid</span>
                                                    <span className="total-val">{formatter.format(order.total || 0)}</span>
                                                </div>
                                                <Link to={`/order-success/${orderIdStr}`} className="view-link-mini" onClick={onClose}>
                                                    DETAILS →
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .account-overlay { position: fixed; inset: 0; z-index: 10000; visibility: hidden; }
                .account-overlay.active { visibility: visible; }

                .overlay-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); animation: fadeIn 0.4s var(--ease); }
                .overlay-content { position: absolute; top: 0; right: 0; width: min(600px, 100vw); height: 100%; background: #050505; animation: slideInX 0.5s var(--ease); display: flex; flex-direction: column; }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideInX { from { transform: translateX(100%); } to { transform: translateX(0); } }

                .overlay-close-btn { position: absolute; top: 2rem; left: -50px; background: #fff; color: #000; width: 36px; height: 36px; border-radius: 50%; border: none; font-size: 1.2rem; cursor: pointer; transition: 0.3s; z-index: 10; }
                @media (max-width: 700px) { .overlay-close-btn { left: 20px; top: 20px; } }
                .overlay-close-btn:hover { transform: scale(1.1) rotate(90deg); }

                .overlay-inner { flex: 1; overflow-y: auto; padding: 4rem 3rem; color: #fff; }
                @media (max-width: 500px) { .overlay-inner { padding: 5rem 1.5rem 2rem; } }

                .profile-hero-mini { margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid #111; display: flex; justify-content: space-between; align-items: flex-start; }
                .user-meta { display: flex; align-items: center; gap: 1rem; }
                .avatar-ph { width: 50px; height: 50px; background: #fff; color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-bebas); font-size: 1.5rem; }
                .user-txt h1 { font-family: var(--font-bebas); font-size: 2.2rem; margin: 0; letter-spacing: 0.05em; }
                .user-txt p { color: #555; font-size: 0.8rem; margin: 0; }
                .logout-trigger-mini { background: transparent; border: 1px solid #222; color: #666; padding: 6px 12px; font-size: 0.6rem; font-weight: 800; cursor: pointer; border-radius: 4px; }
                .logout-trigger-mini:hover { color: #fff; border-color: #fff; }

                .section-title { font-size: 0.65rem; font-weight: 800; color: #333; letter-spacing: 0.2em; margin-bottom: 2rem; text-transform: uppercase; }
                .orders-grid-mini { display: flex; flex-direction: column; gap: 1rem; }
                .order-item-card-mini { background: #0c0c0c; border: 1px solid #181818; padding: 1.5rem; border-radius: 8px; }

                .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .order-id-date { font-size: 0.75rem; font-family: var(--font-space); }
                .oid { color: #fff; font-weight: 700; }
                .odate { color: #444; margin-left: 10px; }
                .status-badge { font-size: 0.55rem; font-weight: 900; padding: 3px 8px; border-radius: 4px; border: 1px solid; text-transform: uppercase; }

                .card-items { padding: 0.8rem 0; border-top: 1px solid #151515; border-bottom: 1px solid #151515; display: flex; flex-direction: column; gap: 6px; }
                .mini-item { display: flex; justify-content: space-between; font-size: 0.75rem; color: #888; }
                .item-size { color: #444; font-size: 0.65rem; }
                .more-items { font-size: 0.65rem; color: #333; font-style: italic; }

                .card-bottom { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 1rem; }
                .total-label { font-size: 0.6rem; color: #444; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px; }
                .total-val { font-size: 1rem; font-weight: 900; }
                .view-link-mini { font-size: 0.65rem; font-weight: 900; color: #555; text-decoration: none; border-bottom: 1px solid #222; }
                .view-link-mini:hover { color: #fff; border-color: #fff; }

                .empty-orders-mini { text-align: center; padding: 4rem 1rem; border: 1px dashed #151515; border-radius: 12px; }
                .empty-icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.2; }
                .empty-orders-mini h3 { font-size: 1rem; margin-bottom: 0.5rem; }
                .empty-orders-mini p { color: #444; font-size: 0.8rem; margin-bottom: 2rem; }
                .shop-cta-mini { background: #fff; color: #000; border: none; padding: 12px 24px; font-weight: 900; font-size: 0.7rem; border-radius: 4px; cursor: pointer; }

                /* Skeleton */
                .skeleton-card { height: 180px; background: #0c0c0c; border: 1px solid #151515; position: relative; overflow: hidden; padding: 1.5rem; }
                .skeleton-line { height: 10px; background: #1a1a1a; margin-bottom: 10px; border-radius: 2px; }
                .skeleton-card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent); animation: shimmer 1.5s infinite; }
            `}</style>
        </div>
    );
};

export default AccountOverlay;
