import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="foot-grid">
                <div>
                    <a href="#" className="foot-logo">LIBERO</a>
                    <div className="foot-flags">
                        <span className="g"></span><span className="w"></span><span className="r"></span>
                    </div>
                    <p className="foot-desc">
                        Handcrafted in Italy. Built for the beautiful game. Legends never fade, they only evolve.
                    </p>
                    <div className="foot-social">
                        <a href="#">INSTAGRAM</a>
                        <a href="#">X</a>
                        <a href="#">YOUTUBE</a>
                    </div>
                </div>
                <div className="foot-col">
                    <h5>SHOP</h5>
                    <ul>
                        <li><a href="#">All Boots</a></li>
                        <li><a href="#">New Arrivals</a></li>
                        <li><a href="#">Heritage</a></li>
                        <li><a href="#">Limited Edition</a></li>
                        <li><a href="#">Sale</a></li>
                    </ul>
                </div>
                <div className="foot-col">
                    <h5>SUPPORT</h5>
                    <ul>
                        <li><a href="#">Size Guide</a></li>
                        <li><a href="#">Shipping</a></li>
                        <li><a href="#">Returns</a></li>
                        <li><a href="#">Track Order</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                <div className="foot-col">
                    <h5>BRAND</h5>
                    <ul>
                        <li><a href="#">Our Story</a></li>
                        <li><a href="#">Craftsmanship</a></li>
                        <li><a href="#">Sustainability</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Careers</a></li>
                    </ul>
                </div>
            </div>
            <div className="foot-btm">
                <span>© 2025 LIBERO ITALIA. All rights reserved.</span>
                <span>Privacy | Terms | Cookies</span>
            </div>
        </footer>
    );
};

export default Footer;
