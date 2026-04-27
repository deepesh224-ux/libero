import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AccountPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    useEffect(() => {
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

        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
            navigate('/');
        }
        window.scrollTo(0, 0);
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
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
        <div className="account-container">
            {/* ── PROFILE HEADER ── */}
            <div className="profile-hero">
                <div className="hero-content">
                    <div className="user-meta">
                        <div className="avatar-ph">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="user-txt">
                            <h1>{user?.name || 'Account'}</h1>
                            <p>{user?.email || 'User Profile'}</p>
                        </div>
                    </div>
                    <button className="logout-trigger" onClick={handleLogout}>
                        LOG OUT
                    </button>
                </div>
            </div>

            {/* ── ORDERS LIST ── */}
            <div className="orders-section">
                <h2 className="section-title">ORDER HISTORY</h2>

                {loading ? (
                    <div className="orders-grid">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : !orders || orders.length === 0 ? (
                    <div className="empty-orders">
                        <div className="empty-icon">📦</div>
                        <h3>You haven&apos;t placed any orders yet</h3>
                        <p>When you do, they&apos;ll appear here with their tracking status.</p>
                        <Link to="/" className="shop-cta">SHOP NOW</Link>
                    </div>
                ) : (
                    <div className="orders-grid">
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
                                <div key={orderIdStr} className="order-item-card">
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
                                        {(order.items || []).slice(0, 3).map((item, i) => (
                                            <div key={i} className="mini-item">
                                                <span className="item-name">{item.name || 'Product'}</span>
                                                <span className="item-size">EU {item.size || 'N/A'}</span>
                                            </div>
                                        ))}
                                        {order.items && order.items.length > 3 && (
                                            <div className="more-items">+ {order.items.length - 3} more items</div>
                                        )}
                                    </div>

                                    <div className="card-bottom">
                                        <div className="order-total">
                                            <span className="total-label">Total</span>
                                            <span className="total-val">{formatter.format(order.totalPrice || 0)}</span>
                                        </div>
                                        <Link to={`/order-success/${orderIdStr}`} className="view-link">
                                            VIEW DETAILS →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <style>{`
                .account-container { max-width: 1100px; margin: 0 auto; padding: 140px 1.5rem 5rem; color: #fff; }
                
                /* Profile Hero */
                .profile-hero { margin-bottom: 5rem; padding-bottom: 3rem; border-bottom: 1px solid #111; }
                .hero-content { display: flex; justify-content: space-between; align-items: center; }
                .user-meta { display: flex; align-items: center; gap: 1.5rem; }
                .avatar-ph { width: 60px; height: 60px; background: #fff; color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-bebas); font-size: 1.8rem; }
                .user-txt h1 { font-family: var(--font-bebas); font-size: 3rem; letter-spacing: 0.05em; margin: 0; }
                .user-txt p { color: #555; font-size: 0.9rem; margin: 0.2rem 0 0; }
                .logout-trigger { background: transparent; border: 1px solid #222; color: #fff; padding: 10px 20px; font-size: 0.7rem; font-weight: 800; cursor: pointer; transition: 0.2s; text-transform: uppercase; }
                .logout-trigger:hover { background: #fff; color: #000; border-color: #fff; }

                /* Orders Table/Grid */
                .section-title { font-size: 0.7rem; font-weight: 800; color: #333; letter-spacing: 0.2em; margin-bottom: 2.5rem; text-transform: uppercase; }
                .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; }
                @media (max-width: 400px) { .orders-grid { grid-template-columns: 1fr; } }

                .order-item-card { background: #080808; border: 1px solid #111; border-radius: 8px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; transition: 0.3s; }
                .order-item-card:hover { border-color: #222; transform: translateY(-4px); }

                .card-top { display: flex; justify-content: space-between; align-items: center; }
                .order-id-date { display: flex; gap: 8px; font-size: 0.8rem; font-family: var(--font-space); }
                .oid { color: #fff; font-weight: 700; }
                .dot { color: #333; }
                .odate { color: #555; }

                .status-badge { font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 4px; border: 1px solid; text-transform: uppercase; letter-spacing: 0.05em; }

                .card-items { display: flex; flex-direction: column; gap: 8px; padding: 1rem 0; border-top: 1px solid #111; border-bottom: 1px solid #111; }
                .mini-item { display: flex; justify-content: space-between; font-size: 0.8rem; }
                .item-name { color: #aaa; font-weight: 500; }
                .item-size { color: #444; font-size: 0.7rem; font-weight: 700; }
                .more-items { font-size: 0.7rem; color: #333; font-weight: 600; font-style: italic; }

                .card-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
                .order-total { display: flex; flex-direction: column; gap: 4px; }
                .total-label { font-size: 0.65rem; color: #444; font-weight: 800; text-transform: uppercase; }
                .total-val { font-size: 1.1rem; font-weight: 900; color: #fff; }
                .view-link { font-size: 0.7rem; font-weight: 800; color: #555; text-decoration: none; transition: 0.2s; }
                .view-link:hover { color: #fff; transform: translateX(4px); }

                /* Empty state */
                .empty-orders { padding: 5rem 0; text-align: center; border: 1px dashed #111; border-radius: 12px; }
                .empty-icon { font-size: 3rem; margin-bottom: 1.5rem; filter: grayscale(1); }
                .empty-orders h3 { font-size: 1.2rem; margin-bottom: 0.5rem; }
                .empty-orders p { color: #555; margin-bottom: 2rem; font-size: 0.9rem; }
                .shop-cta { background: #fff; color: #000; padding: 12px 30px; text-decoration: none; font-size: 0.75rem; font-weight: 800; border-radius: 4px; display: inline-block; }

                /* Skeleton Loader */
                .skeleton-card { height: 260px; background: #111 !important; border: 1px solid #1a1a1a !important; position: relative; overflow: hidden; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border-radius: 8px; }
                .skeleton-line { height: 12px; background: #222; border-radius: 4px; }
                .skeleton-grid { display: flex; flex-direction: column; gap: 10px; margin: 1rem 0; }
                .skeleton-card::after { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); animation: shimmer 1.5s infinite; }
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
            `}</style>
        </div>
    );
};

export default AccountPage;
