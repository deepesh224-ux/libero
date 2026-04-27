import React, { useEffect, useRef, useState } from 'react';

const Preloader = ({ setLoading }) => {
    const logoRef = useRef();
    const sgRef = useRef();
    const swRef = useRef();
    const srRef = useRef();
    const sceneRef = useRef();
    const hasExited = useRef(false);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const logo = logoRef.current;
        const sg = sgRef.current;
        const sw = swRef.current;
        const sr = srRef.current;
        const letters = [...logo.querySelectorAll('.pl-l')];

        // ── RESET ──
        logo.style.animation = 'none';
        logo.style.opacity = '0';
        letters.forEach(l => { l.style.animation = 'none'; l.style.transform = ''; l.style.opacity = '1'; });
        [sg, sw, sr].forEach(s => { s.style.animation = 'none'; s.style.opacity = '0'; s.style.transform = 'scaleX(0)'; });
        void sceneRef.current.offsetHeight;

        // ── INTRO: logo rises in ──
        const t1 = setTimeout(() => {
            logo.style.opacity = '1';
            logo.style.animation = 'plLogoIn 0.88s cubic-bezier(0.16,1,0.3,1) forwards';
        }, 80);

        // ── INTRO: flag stripes staggered ──
        const t2 = setTimeout(() => { sg.style.opacity = '1'; sg.style.transform = ''; sg.style.animation = 'plStripeIn 0.4s ease forwards'; }, 640);
        const t3 = setTimeout(() => { sw.style.opacity = '1'; sw.style.transform = ''; sw.style.animation = 'plStripeIn 0.4s ease forwards'; }, 770);
        const t4 = setTimeout(() => { sr.style.opacity = '1'; sr.style.transform = ''; sr.style.animation = 'plStripeIn 0.4s ease forwards'; }, 900);

        // ── EXIT: letters split + flag shoots ──
        const t5 = setTimeout(() => {
            letters.forEach((l, i) => {
                const up = l.dataset.up === '1';
                l.style.animation = `${up ? 'plLetterUp' : 'plLetterDn'} 0.75s cubic-bezier(0.4,0,0.6,1) ${i * 70}ms forwards`;
            });
            sg.style.animation = 'plGreenEx 0.9s ease-in 60ms forwards';
            sw.style.animation = 'plWhiteEx 0.6s ease-in 30ms forwards';
            sr.style.animation = 'plRedEx 0.9s ease-in 60ms forwards';
        }, 2200);

        // ── FADE the whole black screen out ──
        const t6 = setTimeout(() => setFading(true), 3050);

        // ── DONE: unmount from parent after fade completes ──
        const t7 = setTimeout(() => {
            if (!hasExited.current) {
                hasExited.current = true;
                if (setLoading) setLoading(false);
            }
        }, 3600);

        return () => [t1, t2, t3, t4, t5, t6, t7].forEach(clearTimeout);
    }, [setLoading]);

    return (
        <div
            ref={sceneRef}
            style={{
                position: 'fixed',
                inset: 0,
                background: '#000',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                opacity: fading ? 0 : 1,
                transition: 'opacity 500ms ease-out',
                pointerEvents: fading ? 'none' : 'all',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '26px' }}>
                <div className="pl-logo" ref={logoRef} style={{ display: 'flex', gap: '3px', opacity: 0 }}>
                    {['L', 'I', 'B', 'E', 'R', 'O'].map((char, i) => (
                        <span
                            key={i}
                            className="pl-l"
                            data-up={[0, 2, 4].includes(i) ? '1' : '0'}
                            style={{
                                fontSize: 'clamp(4rem, 12vw, 96px)',
                                fontWeight: 900,
                                color: '#fff',
                                fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
                                lineHeight: 1,
                                display: 'inline-block',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '9px' }}>
                    <div ref={sgRef} style={{ width: 60, height: 3, borderRadius: 2, background: '#009246', opacity: 0, transform: 'scaleX(0)', transformOrigin: '50% 100%' }} />
                    <div ref={swRef} style={{ width: 60, height: 3, borderRadius: 2, background: '#ffffff', opacity: 0, transform: 'scaleX(0)', transformOrigin: '50% 50%' }} />
                    <div ref={srRef} style={{ width: 60, height: 3, borderRadius: 2, background: '#CE2B37', opacity: 0, transform: 'scaleX(0)', transformOrigin: '50% 0%' }} />
                </div>
            </div>

            <style>{`
                @keyframes plLogoIn {
                    from { opacity: 0; transform: translateY(22px) scale(0.92); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes plStripeIn {
                    from { transform: scaleX(0); opacity: 0; }
                    to   { transform: scaleX(1); opacity: 1; }
                }
                @keyframes plLetterUp {
                    0%   { transform: translateY(0);      opacity: 1; }
                    100% { transform: translateY(-300px); opacity: 0; }
                }
                @keyframes plLetterDn {
                    0%   { transform: translateY(0);     opacity: 1; }
                    100% { transform: translateY(300px); opacity: 0; }
                }
                @keyframes plGreenEx {
                    0%   { transform: scaleY(1)   scaleX(1);   opacity: 1; }
                    100% { transform: scaleY(100) scaleX(1.7); opacity: 0; }
                }
                @keyframes plRedEx {
                    0%   { transform: scaleY(1)   scaleX(1);   opacity: 1; }
                    100% { transform: scaleY(100) scaleX(1.7); opacity: 0; }
                }
                @keyframes plWhiteEx {
                    0%   { transform: scaleX(1); opacity: 1;   }
                    70%  {                        opacity: 0.2; }
                    100% { transform: scaleX(6); opacity: 0;   }
                }
            `}</style>
        </div>
    );
};

export default Preloader;