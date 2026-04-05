import React, { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ScrollStory = ({ setActivePanel, setAutoRotating }) => {
    const [current, setCurrent] = useState(0);

    const panelsData = [
        { tag: 'UPPER · LAYER 01', title: 'FULL GRAIN LEATHER UPPER', desc: 'Hand-selected bovine leather, tumbled for softness. Every panel stitched with 0.8mm nylon thread.', pills: ['Full Grain', 'Hand Stitched', 'Waterproof Treated'] },
        { tag: 'OUTSOLE · LAYER 02', title: 'SCREW-IN STUD SYSTEM', desc: 'Interchangeable aluminium studs adapt to any pitch condition. 6-stud configuration.', pills: ['Aluminium Studs', 'FG Certified', 'Replaceable'] },
        { tag: 'STRIPES · LAYER 03', title: 'THE THREE STRIPE HERITAGE', desc: 'Italian tricolore detailing on the signature stripes. A mark of craftsmanship since 1982.', pills: ['Italian Detail', 'Heritage Design', 'Iconic Stripe'] },
        { tag: 'INSOLE · LAYER 04', title: 'ANATOMIC FOOTBED', desc: 'Contoured cork-latex insole molds to your foot shape. Natural materials breathe.', pills: ['Cork-Latex', 'Anatomic Fit', 'Natural Breathe'] },
        { tag: 'THE BOOT · COMPLETE', title: 'THE LIBERO. COMPLETE.', desc: 'Four decades of Italian football craftsmanship. This is not just a boot. This is a legacy.', pills: [] }
    ];

    useEffect(() => {
        const panels = [0, 1, 2, 3, 4];
        panels.forEach((p) => {
            ScrollTrigger.create({
                trigger: '#story-outer',
                start: `${p * 20}% top`,
                end: `${(p + 1) * 20}% top`,
                onToggle: self => {
                    if (self.isActive) {
                        setCurrent(p);
                        setActivePanel(p);
                        setAutoRotating(false);
                    }
                }
            });
        });

        const st = ScrollTrigger.create({
            trigger: '#story-outer',
            start: 'top bottom',
            onLeaveBack: () => setAutoRotating(true)
        });

        return () => {
             // We won't kill all triggers here to match the cleanup of parent App
             // The main cleanup will handle destroying scroll triggers.
        };
    }, [setActivePanel, setAutoRotating]);

    return (
        <div className="story-outer" id="story-outer">
            <div className="story-sticky">
                <div className="progress-track">
                    <div id="prog-fill" style={{ height: `${(current / 4) * 100}%` }}></div>
                </div>
                <div className="panels-box">
                    {panelsData.map((p, i) => (
                        <div key={i} className={`panel p${i + 1} ${current === i ? 'active' : ''}`}>
                            <div className="panel-tag">{p.tag}</div>
                            <h2>{p.title}</h2>
                            <p>{p.desc}</p>
                            {p.pills.length > 0 && (
                                <div className="pills">
                                    {p.pills.map((pill, idx) => <span key={idx} className="pill">{pill}</span>)}
                                </div>
                            )}
                            {i === 4 && <button className="btn-red">SHOP THE LIBERO →</button>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScrollStory;
