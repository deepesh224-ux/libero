import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        api.get('/reviews/site')
            .then(res => setReviews(res.data))
            .catch(err => console.error(err));

        gsap.to('.b-fill', {
            scrollTrigger: { trigger: '.reviews-sec', start: 'top 70%' },
            width: (i, el) => el.getAttribute('data-w'),
            duration: 1.5, stagger: .15, ease: 'power2.out'
        });
    }, []);

    return (
        <section className="reviews-sec">
            <div className="rev-wrap">
                <div className="rev-left">
                    <h2>FROM THE PITCH</h2>
                    <div className="rating-num">4.9</div>
                    <div className="r-stars">★★★★★</div>
                    <div className="r-sub">2,847 verified reviews</div>
                    <div className="bars">
                        {[
                            { n: 5, w: '92%' },
                            { n: 4, w: '5%' },
                            { n: 3, w: '2%' },
                            { n: 2, w: '0.5%' },
                            { n: 1, w: '0.5%' }
                        ].map(bar => (
                            <div className="b-row" key={bar.n}>
                                <span className="b-num">{bar.n}</span>
                                <div className="b-bg">
                                    <div className="b-fill" data-w={bar.w}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rev-right">
                    {reviews.map(r => (
                        <div className="rev-card" key={r.id}>
                            <div className="rc-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                            <p className="rc-text">{r.text}</p>
                            <div className="rc-foot">
                                <div>
                                    <div className="rc-name">{r.name}</div>
                                    <div className="rc-boot">{r.boot}</div>
                                </div>
                                {r.verified && <span className="v-badge">VERIFIED</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
