import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const Hero = () => {

    useEffect(() => {
        gsap.to('.hero-h1 .line', {
            y: '0%', opacity: 1,
            duration: 1.1, stagger: .14, ease: 'power4.out',
            delay: 2.5 // wait for preloader
        });
    }, []);

    return (
        <section className="hero">
            <div className="hero-inner">
                <div className="tag-pill">SINCE 1954 · ITALIAN CRAFT</div>
                <h1 className="hero-h1">
                    <div className="line-wrap"><span className="line" style={{ transform: 'translateY(110%)', opacity: 0 }}>BORN</span></div>
                    <div className="line-wrap"><span className="line" style={{ transform: 'translateY(110%)', opacity: 0 }}>FROM THE</span></div>
                    <div className="line-wrap"><span className="line" style={{ transform: 'translateY(110%)', opacity: 0 }}>PITCH</span></div>
                </h1>
                <div className="sep"></div>
                <p className="hero-sub">Hand-stitched leather. Precision engineered. Worn by legends across three decades of football.</p>
                <div className="hero-btns">
                    <button className="btn-solid">SHOP COLLECTION</button>
                    <button className="btn-ghost" onClick={() => document.getElementById('tl-sec')?.scrollIntoView()}>OUR HERITAGE →</button>
                </div>
                {/* Notice: we incorporate the stats from the user's HTML prompt here! */}
                <div className="hero-stats">
                    <div className="stat">
                        <div className="stat-line"></div>
                        <h3>1954</h3>
                        <p>EST.</p>
                    </div>
                    <div className="stat">
                        <div className="stat-line"></div>
                        <h3>47 TITLES</h3>
                        <p>WON WITH</p>
                    </div>
                    <div className="stat">
                        <div className="stat-line"></div>
                        <h3>12 NATIONS</h3>
                        <p>ACROSS</p>
                    </div>
                </div>
            </div>
            <div className="scroll-hint">▼ SCROLL TO DISCOVER</div>
        </section>
    );
};

export default Hero;
