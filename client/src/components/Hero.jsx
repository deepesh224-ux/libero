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
            {/* ── LAYER 3: COLOR GLOW ORBS ── */}
            <div className="orb-red"></div>
            <div className="orb-green"></div>

            <div className="hero-inner">
                {/* ── 3. HERO EYEBROW LINE ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <div style={{ width: '24px', height: '1px', background: '#C41E3A' }}></div>
                    <span style={{ fontSize: '8.5px', letterSpacing: '.28em', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase' }}>Since 1954 · Italian craft</span>
                </div>

                <h1 className="hero-h1">
                    <div className="line-wrap"><span className="line" style={{ transform: 'translateY(110%)', opacity: 0 }}>BORN</span></div>
                    {/* ── 2. HERO TEXT — ADD OUTLINE STYLE ── */}
                    <div className="line-wrap">
                        <span className="line stroke-text" style={{ transform: 'translateY(110%)', opacity: 0 }}>
                            FROM THE
                        </span>
                    </div>
                    <div className="line-wrap"><span className="line" style={{ transform: 'translateY(110%)', opacity: 0 }}>PITCH</span></div>
                </h1>

                {/* ── 7. HERO RED DIVIDER ── */}
                <div style={{ width: '36px', height: '2px', background: '#C41E3A', marginBottom: '20px' }}></div>

                <p className="hero-sub">Hand-stitched leather. Precision engineered. Worn by legends across three decades of football.</p>
                
                <div className="hero-btns">
                    <button className="btn-solid">SHOP COLLECTION</button>
                    <button className="btn-ghost" onClick={() => document.getElementById('tl-sec')?.scrollIntoView()}>OUR HERITAGE →</button>
                </div>

                {/* ── 5. STATS ROW REFINEMENT ── */}
                <div className="hero-stats-new">
                    <div className="stat-unit">
                        <h3>1954</h3>
                        <p>EST.</p>
                    </div>
                    <div className="stat-unit">
                        <h3>47</h3>
                        <p>TITLES WON WITH</p>
                    </div>
                    <div className="stat-unit">
                        <h3>12</h3>
                        <p>NATIONS ACROSS</p>
                    </div>
                    <div className="stat-unit">
                        <h3>2,847</h3>
                        <p>VERIFIED REVIEWS</p>
                    </div>
                </div>
            </div>

            {/* ── 6. SCROLL HINT REFINEMENT ── */}
            <div className="scroll-hint-premium">
                <div className="scroll-line"></div>
                <span>SCROLL TO DISCOVER</span>
            </div>

            <style>{`
                .orb-red {
                    width: 600px; height: 600px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(196,30,58,0.12) 0%, transparent 70%);
                    position: absolute; top: -100px; right: -80px;
                    z-index: 0; pointer-events: none;
                    animation: drift 9s ease-in-out infinite;
                }
                .orb-green {
                    width: 420px; height: 420px;  
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(26,107,60,0.08) 0%, transparent 70%);
                    position: absolute; bottom: -60px; left: -60px;
                    z-index: 0; pointer-events: none;
                    animation: drift 13s ease-in-out infinite reverse;
                }
                @keyframes drift {
                    0%   { transform: translateX(0) translateY(0); }
                    50%  { transform: translateX(-12px) translateY(-8px); }
                    100% { transform: translateX(0) translateY(0); }
                }

                .stroke-text { -webkit-text-stroke: 1px rgba(255,255,255,0.18); color: transparent; }

                .hero-stats-new {
                    display: flex;
                    border-top: 1px solid rgba(255,255,255,0.07);
                    padding-top: 24px;
                    width: 100%;
                }
                .stat-unit {
                    flex: 1;
                    padding-right: 20px;
                }
                .stat-unit:not(:first-child) {
                    padding-left: 20px;
                    border-left: 1px solid rgba(255,255,255,0.07);
                }
                .stat-unit h3 {
                    font-family: var(--font-bebas);
                    font-size: 1.6rem;
                    color: #fff;
                    margin-bottom: 4px;
                }
                .stat-unit p {
                    font-size: 7.5px;
                    letter-spacing: .22em;
                    color: rgba(255,255,255,.25);
                    text-transform: uppercase;
                }

                .scroll-hint-premium {
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    animation: pulse 2s infinite ease-in-out;
                }
                .scroll-line {
                    width: 1px;
                    height: 32px;
                    background: rgba(255,255,255,.15);
                }
                .scroll-hint-premium span {
                    font-size: 7.5px;
                    letter-spacing: .22em;
                    color: rgba(255,255,255,.2);
                    text-transform: uppercase;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: translate(-50%, 0); }
                    50% { opacity: 1; transform: translate(-50%, 10px); }
                }
            `}</style>
        </section>
    );
};

export default Hero;
