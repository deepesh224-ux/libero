import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import AccountOverlay from './AccountOverlay';

const Navbar = () => {
    const location = useLocation();
    const isAccountPage = location.pathname === '/account'; // Keep for fallback, but main is overlay
    
    const [isSolid, setSolid] = useState(false);
    const [isMobOpen, setMobOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    
    const { cartCount, openCart } = useCart();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setSolid(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const firstName = user?.name ? user.name.split(' ')[0] : '';

    return (
        <>
            <nav className={`nav ${isSolid || isAccountPage ? 'solid' : ''}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {/* LEFT: IDENTITY */}
                <div className="nav-left">
                    <Link to="/" className="nav-logo">LIBERO</Link>
                    <div className="it-flag-mini">
                        <span className="it-g"></span>
                        <span className="it-w"></span>
                        <span className="it-r"></span>
                    </div>
                </div>
                
                {/* CENTER: NAV */}
                {!isAccountPage && (
                    <div className="nav-links-center hide-mob">
                        <a href="#collection">Collection</a>
                        <a href="#heritage">Technology</a>
                        <a href="#tl-sec">Heritage</a>
                        <a href="#footer">Contact</a>
                    </div>
                )}

                {/* RIGHT: UTILS */}
                <div className="nav-right">
                    {user ? (
                        <div className="user-nav-minimal hide-mob">
                            <span className="user-name-mini">{firstName}</span>
                            <button onClick={() => setIsAccountOpen(true)} className="nav-util-link">Orders</button>
                            <button onClick={logout} className="nav-util-link">Sign out</button>
                        </div>
                    ) : (
                        <button className="nav-util-link hide-mob" onClick={() => setIsAuthOpen(true)}>Sign In</button>
                    )}

                    <button className="cart-btn-premium" onClick={openCart}>
                        BAG ({cartCount})
                    </button>

                    {isAccountPage && (
                        <Link to="/" className="close-dashboard" title="Close Dashboard">✕</Link>
                    )}

                    <button 
                        className={`hamburger hide-desk ${isMobOpen ? 'open' : ''}`} 
                        onClick={() => setMobOpen(!isMobOpen)}
                    >
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </nav>

            <div className={`mob-menu ${isMobOpen ? 'active' : ''}`}>
                <div className="mob-menu-inner">
                    <a href="#collection" onClick={() => setMobOpen(false)}>Collection</a>
                    <a href="#heritage" onClick={() => setMobOpen(false)}>Technology</a>
                    <a href="#tl-sec" onClick={() => setMobOpen(false)}>Heritage</a>
                    
                    {!user ? (
                        <button onClick={() => { setIsAuthOpen(true); setMobOpen(false); }}>Sign In</button>
                    ) : (
                        <>
                            <button onClick={() => { setIsAccountOpen(true); setMobOpen(false); }}>Account</button>
                            {user.role === 'admin' && (
                                <Link to="/admin" onClick={() => setMobOpen(false)}>Admin</Link>
                            )}
                            <button onClick={logout}>Log Out</button>
                        </>
                    )}
                    
                    <a href="#footer" onClick={() => setMobOpen(false)}>Contact</a>
                </div>
            </div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            <AccountOverlay isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />

            <style>{`
                .nav-left { display: flex; align-items: center; gap: 12px; }
                .it-flag-mini { display: flex; flex-direction: column; gap: 2px; }
                .it-flag-mini span { width: 18px; height: 2px; }
                .it-g { background: #009246; }
                .it-w { background: #ffffff; }
                .it-r { background: #CE2B37; }

                .nav-links-center { position: absolute; left: 50%; transform: translateX(-50%); display: flex; gap: 32px; }
                .nav-links-center a { color: rgba(255,255,255,0.45); text-decoration: none; font-size: 0.72rem; letter-spacing: 2px; text-transform: uppercase; transition: 0.3s; }
                .nav-links-center a:hover { color: #fff; }

                .nav-right { display: flex; align-items: center; gap: 20px; }
                .user-nav-minimal { display: flex; align-items: center; gap: 15px; }
                .user-name-mini { font-size: 0.75rem; color: rgba(255,255,255,0.55); letter-spacing: 0.5px; }
                .nav-util-link { background: none; border: none; color: rgba(255,255,255,0.45); font-family: inherit; font-size: 0.72rem; text-transform: uppercase; cursor: pointer; transition: 0.2s; letter-spacing: 1px; }
                .nav-util-link:hover { color: #fff; }

                .cart-btn-premium {
                    background: none;
                    border: 1px solid rgba(255,255,255,0.18);
                    color: #fff;
                    font-family: inherit;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    padding: 6px 14px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .cart-btn-premium:hover { background: #fff; color: #000; }

                .close-dashboard {
                    background: #fff; color: #000; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 0.9rem; font-weight: 800; transition: 0.2s;
                }
                .close-dashboard:hover { transform: scale(1.1) rotate(90deg); }
            `}</style>
        </>
    );
};

export default Navbar;

