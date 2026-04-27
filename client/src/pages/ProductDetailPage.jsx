import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { addToCart, openCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [selectedSize, setSelectedSize] = useState('');
    const [qty, setQty] = useState(1);
    const [message, setMessage] = useState('');

    // Review Form State
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const sizes = [39, 40, 41, 42, 43, 44, 45, 46];

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Product not found');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToBag = () => {
        if (!selectedSize) {
            setMessage('Please select a size');
            return;
        }
        setMessage('');
        addToCart(product, selectedSize, qty);
        openCart();
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        
        try {
            setSubmitting(true);
            await api.post(`/reviews/${id}`, { 
                rating, 
                comment 
            });
            setComment('');
            setRating(5);
            toast.success('Thank you for your review!');
            // Refresh product to show new review
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
        } catch (err) {
            console.error('Review error:', err);
            toast.error(err.response?.data?.error || 'Failed to post review');
        } finally {
            setSubmitting(false);
        }
    };

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    if (loading) return (
        <div className="pdp-skeleton">
            <div className="skel-img"></div>
            <div className="skel-info">
                <div className="skel-line title"></div>
                <div className="skel-line price"></div>
                <div className="skel-line text"></div>
                <div className="skel-line text"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="pdp-error">
            <h2>{error}</h2>
            <Link to="/" className="back-btn">← BACK TO COLLECTION</Link>
        </div>
    );

    const isOutOfStock = product.countInStock === 0;

    return (
        <div className="pdp-container">
            <Link to="/" className="back-btn">← BACK TO COLLECTION</Link>

            <div className="pdp-main">
                <div className="pdp-media">
                    <div className="img-holder">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="pdp-img" 
                            onError={(e) => { e.target.src = 'https://placehold.co/1000x1000/111/white?text=BOOT+IMAGE'; }}
                        />
                        {isOutOfStock && <div className="pdp-out-badge">OUT OF STOCK</div>}
                    </div>
                </div>

                <div className="pdp-info">
                    {product.badge && <span className="pdp-badge">{product.badge}</span>}
                    <h1 className="pdp-title">{product.name}</h1>
                    
                    <div className="pdp-rating">
                        <div className="stars">
                            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
                        </div>
                        <span className="rev-count">{product.reviewCount} Reviews</span>
                    </div>

                    <div className="pdp-pricing">
                        {product.originalPrice && <span className="pdp-price-orig">{formatter.format(product.originalPrice)}</span>}
                        <span className="pdp-price-current">{formatter.format(product.price)}</span>
                    </div>

                    <p className="pdp-desc">{product.description}</p>

                    <div className="pdp-form-section">
                        <div className="section-header">
                            <label>SELECT EU SIZE</label>
                            {message && <span className="err-msg">{message}</span>}
                        </div>
                        <div className="size-chips">
                            {sizes.map(size => (
                                <button 
                                    key={size}
                                    className={`chip ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => { setSelectedSize(size); setMessage(''); }}
                                    disabled={isOutOfStock}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pdp-form-section">
                        <label>QUANTITY</label>
                        <div className="qty-control">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1 || isOutOfStock}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))} disabled={qty >= product.countInStock || isOutOfStock}>+</button>
                        </div>
                        {product.countInStock < 5 && product.countInStock > 0 && (
                            <p className="stock-alert">Only {product.countInStock} left! Order soon.</p>
                        )}
                    </div>

                    <button 
                        className="pdp-cta" 
                        onClick={handleAddToBag}
                        disabled={isOutOfStock}
                    >
                        {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
                    </button>
                    
                    <div className="pdp-bullets">
                        <div className="bullet">⚡ Free Express Shipping in India</div>
                        <div className="bullet">🛡️ 1-Year Performance Warranty</div>
                        <div className="bullet">🔄 30-Day Professional Trial</div>
                    </div>
                </div>
            </div>

            <div className="pdp-reviews-box shadow-pdp">
                <div className="rev-header">
                    <h2>USER REVIEWS</h2>
                    {!user && <p className="login-prompt">Please <Link to="/">Login</Link> to leave a review.</p>}
                </div>

                {user && (
                    <form className="rev-form" onSubmit={handleReviewSubmit}>
                    <div className="rev-form-row">
                        <label>Your Rating</label>
                        <div className="star-picker">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span
                                    key={num}
                                    role="button"
                                    className={`star-btn ${(hoverRating || rating) >= num ? 'on' : ''}`}
                                    onMouseEnter={() => setHoverRating(num)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(num)}
                                >
                                    ★
                                </span>
                            ))}
                            <span className="rating-desc">
                                {['Terrible', 'Poor', 'Good', 'Very Good', 'Excellent'][(hoverRating || rating) - 1]}
                            </span>
                        </div>
                    </div>
                        <div className="rev-form-row">
                            <label>Your Experience</label>
                            <textarea 
                                placeholder="Describe the touch, fit, and speed..." 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'POSTING...' : 'SUBMIT REVIEW'}
                        </button>
                    </form>
                )}

                <div className="reviews-feed">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((r, i) => (
                            <div className="review-item" key={i}>
                                <div className="ri-top">
                                    <span className="ri-name">{r.user?.name || 'Anonymous'}</span>
                                    <div className="ri-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                                </div>
                                <p className="ri-comment">{r.comment}</p>
                                <span className="ri-date">{new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                        ))
                    ) : (
                        <p className="no-revs">No reviews yet. Be the first to share your performance experience.</p>
                    )}
                </div>
            </div>

            <style>{`
                .pdp-container { max-width: 1100px; margin: 0 auto; padding: 120px 1rem 5rem; }
                .back-btn { font-size: 0.7rem; font-weight: 800; color: #666; text-decoration: none; margin-bottom: 2rem; display: block; }
                .back-btn:hover { color: #fff; }

                .pdp-main { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; margin-bottom: 5rem; }
                @media (max-width: 850px) { .pdp-main { grid-template-columns: 1fr; } }

                .img-holder { position: relative; aspect-ratio: 1; background: #0c0c0c; border: 1px solid #1a1a1a; overflow: hidden; border-radius: 8px; }
                .pdp-img { width: 100%; height: 100%; object-fit: cover; }
                .pdp-out-badge { position: absolute; inset: 0; background: rgba(0,0,0,0.6); color: white; display: flex; align-items: center; justify-content: center; font-family: var(--font-bebas); font-size: 2rem; letter-spacing: 0.1em; pointer-events: none; }

                .pdp-badge { background: #E8E8E8; color: #000; font-size: 0.6rem; font-weight: 900; padding: 4px 8px; border-radius: 2px; }
                .pdp-title { font-family: var(--font-bebas); font-size: 4rem; line-height: 0.9; margin: 1rem 0; letter-spacing: 0.05em; }
                .pdp-rating { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
                .stars { color: #facc15; font-size: 1.1rem; }
                .rev-count { font-size: 0.8rem; color: #555; }

                .pdp-pricing { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
                .pdp-price-current { font-family: var(--font-bebas); font-size: 2.5rem; color: #fff; }
                .pdp-price-orig { text-decoration: line-through; color: #555; font-size: 1.2rem; }

                .pdp-desc { color: #888; line-height: 1.6; font-size: 0.95rem; margin-bottom: 2.5rem; }

                .pdp-form-section { margin-bottom: 2.5rem; }
                .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .pdp-form-section label { display: block; font-size: 0.65rem; font-weight: 800; color: #555; margin-bottom: 0.5rem; }
                .err-msg { font-size: 0.65rem; color: #E8E8E8; font-weight: 800; }

                .size-chips { display: flex; flex-wrap: wrap; gap: 8px; }
                .chip { background: #111; border: 1px solid #222; color: #fff; padding: 10px 0; width: 50px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.2s; border-radius: 4px; }
                .chip:hover:not(:disabled) { border-color: #555; }
                .chip.active { background: #fff; color: #000; border-color: #fff; }
                .chip:disabled { opacity: 0.3; cursor: not-allowed; }

                .qty-control { display: flex; align-items: center; gap: 1.5rem; background: #111; width: fit-content; padding: 8px 1.5rem; border: 1px solid #222; border-radius: 4px; }
                .qty-control button { background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; }
                .qty-control span { font-weight: 800; min-width: 20px; text-align: center; }
                .stock-alert { color: #facc15; font-size: 0.75rem; font-weight: 700; margin-top: 10px; }

                .pdp-cta { width: 100%; background: #E8E8E8; color: #000; border: none; padding: 1.2rem; font-weight: 900; font-size: 0.9rem; letter-spacing: 0.1em; cursor: pointer; border-radius: 4px; transition: 0.2s; }
                .pdp-cta:hover:not(:disabled) { transform: translateY(-2px); opacity: 0.9; }
                .pdp-cta:disabled { background: #222; color: #555; cursor: not-allowed; }

                .pdp-bullets { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.8rem; }
                .bullet { font-size: 0.75rem; font-weight: 600; color: #555; }

                .pdp-reviews-box { margin-top: 5rem; border-top: 1px solid #111; padding-top: 4rem; }
                .rev-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; }
                .rev-header h2 { font-family: var(--font-bebas); font-size: 2.5rem; letter-spacing: 0.05em; }
                .login-prompt { font-size: 0.8rem; color: #555; }
                .login-prompt a { color: #E8E8E8; font-weight: 700; }

                .rev-form { padding: 0; margin-bottom: 5rem; border: none; background: transparent; }
                .rev-form-row { margin-bottom: 1.5rem; }
                .rev-form-row label { display: block; font-size: 0.72rem; font-weight: 800; color: #333; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em; }
                .rev-form select, .rev-form textarea { width: 100%; background: #080808; border: 1px solid #111; padding: 15px; color: #fff; border-radius: 4px; outline: none; transition: border-color 0.2s; }
                .rev-form textarea { height: 120px; resize: none; font-family: var(--font-inter); }
                .rev-form textarea:focus { border-color: #333; }
                .rev-form button { background: #fff; color: #000; border: none; padding: 15px 3rem; font-weight: 900; font-size: 0.75rem; cursor: pointer; border-radius: 4px; transition: 0.2s; }
                .rev-form button:hover { opacity: 0.8; transform: translateY(-2px); }
                
                .reviews-feed { display: flex; flex-direction: column; gap: 2rem; }
                .review-item { border-bottom: 1px solid #111; padding-bottom: 1.5rem; }
                .ri-top { display: flex; justify-content: space-between; margin-bottom: 0.8rem; }
                .ri-name { font-weight: 900; font-size: 0.9rem; }
                .ri-stars { color: #facc15; font-size: 0.8rem; }
                .ri-comment { font-size: 0.95rem; color: #888; line-height: 1.6; margin-bottom: 0.8rem; }
                .ri-date { font-size: 0.75rem; color: #444; }
                .no-revs { color: #444; text-align: center; padding: 3rem 0; font-style: italic; }

                /* Star Picker */
                .star-picker { display: flex; align-items: center; gap: 0.6rem; margin: 10px 0 20px; }
                .star-btn { display: inline-block; background: transparent; border: none; font-size: 2.2rem; color: #1a1a1a; cursor: pointer; transition: 0.2s var(--ease); padding: 0 4px; line-height: 1; user-select: none; }
                .star-btn.on { color: #facc15; text-shadow: 0 0 15px rgba(250, 204, 21, 0.4); }
                .star-btn:hover { transform: scale(1.25); color: #facc15; }
                .rating-desc { margin-left: 1.5rem; font-size: 0.85rem; font-weight: 800; color: #444; text-transform: uppercase; letter-spacing: 0.1em; }
            `}</style>
        </div>
    );
};

export default ProductDetailPage;

