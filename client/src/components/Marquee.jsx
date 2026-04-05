import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const Marquee = () => {
    useEffect(() => {
        gsap.to('#mq1', { xPercent: -50, ease: 'none', duration: 22, repeat: -1 });
        gsap.fromTo('#mq2',
            { xPercent: -50 },
            { xPercent: 0, ease: 'none', duration: 32, repeat: -1 }
        );
    }, []);

    const stars = <span className="mq-star">★</span>;

    return (
        <div className="marquee-sec">
            <div className="mq-row">
                <div className="mq-track" id="mq1">
                    <span className="mq-t">HANDCRAFTED IN ITALY</span>{stars}
                    <span className="mq-t">FULL GRAIN LEATHER</span>{stars}
                    <span className="mq-t">SINCE 1954</span>{stars}
                    <span className="mq-t">LIMITED RUNS</span>{stars}
                    {/* Duplicate for seamless infinite loop */}
                    <span className="mq-t">HANDCRAFTED IN ITALY</span>{stars}
                    <span className="mq-t">FULL GRAIN LEATHER</span>{stars}
                    <span className="mq-t">SINCE 1954</span>{stars}
                    <span className="mq-t">LIMITED RUNS</span>{stars}
                </div>
            </div>
            <div className="mq-row">
                <div className="mq-track" id="mq2">
                    <span className="mq-t">FG</span>{stars}
                    <span className="mq-t">AG</span>{stars}
                    <span className="mq-t">TF</span>{stars}
                    <span className="mq-t">HERITAGE</span>{stars}
                    <span className="mq-t">PRECISION</span>{stars}
                    <span className="mq-t">CRAFT</span>{stars}
                    <span className="mq-t">LEGACY</span>{stars}
                    {/* Duplicate for seamless infinite loop */}
                    <span className="mq-t">FG</span>{stars}
                    <span className="mq-t">AG</span>{stars}
                    <span className="mq-t">TF</span>{stars}
                    <span className="mq-t">HERITAGE</span>{stars}
                    <span className="mq-t">PRECISION</span>{stars}
                    <span className="mq-t">CRAFT</span>{stars}
                    <span className="mq-t">LEGACY</span>{stars}
                </div>
            </div>
        </div>
    );
};

export default Marquee;
