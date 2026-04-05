import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Timeline = () => {
    useEffect(() => {
        const track = document.getElementById('tl-track');
        const pin = document.getElementById('tl-pin');
        if (!track || !pin) return;

        // Wait for DOM + layout to fully settle before calculating
        const init = setTimeout(() => {
            const mm = gsap.matchMedia();

            mm.add("(min-width: 769px)", () => {
                const getScrollDist = () => track.scrollWidth - pin.offsetWidth;

                const tl = gsap.to(track, {
                    x: () => -getScrollDist(),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#tl-sec',      // ← use tl-sec not tl-pin
                        start: 'top top',
                        end: () => `+=${getScrollDist()}`,
                        pin: '#tl-pin',
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                        refreshPriority: -1,
                    }
                });

                // ← Use tl-sec as trigger, not tl-pin (which is being pinned)
                gsap.from('.tl-card', {
                    opacity: 0,
                    y: 50,
                    stagger: 0.12,
                    duration: 0.9,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '#tl-sec',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                        refreshPriority: -1,
                    }
                });

                return () => { tl.kill(); };
            });

            mm.add("(max-width: 768px)", () => {
                gsap.from('.tl-card', {
                    opacity: 0,
                    x: -40,
                    stagger: 0.15,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '#tl-sec',     // ← tl-sec here too
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });

            // Force recalculate all scroll positions after pin is registered
            ScrollTrigger.refresh();

            return () => mm.revert();
        }, 300); // ← 300ms delay lets React finish painting

        return () => {
            clearTimeout(init);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const events = [
        { year: 1954, img: '/assets/tl_1954.png', title: 'Founded in Turin', desc: 'In a small cobblestone workshop, the first LIBERO boot was hand-stitched from locally sourced Italian leather. A craft that would outlast generations.' },
        { year: 1966, img: '/assets/tl_1966.png', title: 'First World Cup Appearance', desc: 'Under the floodlights of Wembley, LIBERO boots touched the world stage for the first time. The legend was born in rain-soaked English turf.' },
        { year: 1982, img: '/assets/tl_1982.png', title: 'Spain World Cup Glory', desc: 'The iconic three-stripe design debuted on Spanish grass. Italian tricolore detailing became a mark of unmatched craftsmanship on the biggest stage.' },
        { year: 1990, img: '/assets/tl_1990.png', title: "Italia '90 – Home Soil", desc: 'Under the Roman stars, LIBERO returned home. The tournament that redefined football passion, played in boots forged just kilometers from the pitch.' },
        { year: 2006, img: '/assets/tl_2006.png', title: 'The Golden Era', desc: "A new generation of models launched, fusing heritage silhouettes with modern performance. The LIBERO Gold R became an instant collector's icon." },
        { year: 2025, img: '/assets/tl_2025.png', title: 'Heritage Reborn', desc: 'Classic aesthetics meet precision engineering. The heritage collection returns — same soul, evolved craft. A boot for the next 40 years.' }
    ];

    return (
        <section className="tl-sec" id="tl-sec">
            <h2>40 YEARS ON THE PITCH</h2>
            <p className="tl-sub">A legacy stitched through time</p>
            <div className="tl-pin" id="tl-pin">
                <div className="tl-connector"></div>
                <div className="tl-track" id="tl-track">
                    {events.map(ev => (
                        <div className="tl-card" key={ev.year}>
                            <div className="tl-img"><img src={ev.img} alt={`${ev.year} – ${ev.title}`} /></div>
                            <h3>{ev.year}</h3>
                            <h4>{ev.title}</h4>
                            <p>{ev.desc}</p>
                            <div className="tl-accent"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Timeline;
