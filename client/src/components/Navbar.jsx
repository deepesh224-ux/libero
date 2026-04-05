import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isSolid, setSolid] = useState(false);
    const [isMobOpen, setMobOpen] = useState(false);
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => setSolid(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`nav ${isSolid ? 'solid' : ''}`}>
                <a href="#" className="nav-logo">LIBERO</a>
                <div className="nav-links">
                    <a href="#collection">Collection</a>
                    <a href="#heritage">Technology</a>
                    <a href="#tl-sec">Heritage</a>
                    <a href="#footer">Contact</a>
                </div>
                <div className="nav-icons">
                    <a href="#" className="hide-mob">Search</a>
                    <a href="#" className="hide-mob">♥</a>
                    <a href="#">Bag <span className="cart-n">({cartCount})</span></a>
                    <button className={`hamburger hide-desk ${isMobOpen ? 'open' : ''}`} onClick={() => setMobOpen(!isMobOpen)}>
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </nav>
            <div className={`mob-menu ${isMobOpen ? 'active' : ''}`}>
                <div className="mob-menu-inner">
                    <a href="#collection" onClick={() => setMobOpen(false)}>Collection</a>
                    <a href="#heritage" onClick={() => setMobOpen(false)}>Technology</a>
                    <a href="#tl-sec" onClick={() => setMobOpen(false)}>Heritage</a>
                    <a href="#footer" onClick={() => setMobOpen(false)}>Contact</a>
                </div>
            </div>
        </>
    );
};

export default Navbar;
