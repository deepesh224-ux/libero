import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeError, setSizeError] = useState(false);
    const { addToCart, openCart } = useCart();

    const isOut = product.countInStock === 0;
    const availableSizes = [39, 40, 41, 42, 43, 44, 45, 46];

    const getBadgeClass = (badge) => {
        if (!badge) return '';
        if (badge === 'NEW' || badge === 'NEW DROP') return 'b-rd';
        if (badge === 'BESTSELLER') return 'b-wh';
        if (badge === 'SALE') return 'b-rd-outline';
        return 'b-wh';
    };

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedSize) {
            setSizeError(true);
            setTimeout(() => setSizeError(false), 3000);
            return;
        }
        addToCart(product, selectedSize, 1);
        openCart();
    };

    return (
        <Link to={`/product/${product.id}`} className={`card ${isOut ? 'out' : ''}`}>
            {product.badge && <div className={`badge ${getBadgeClass(product.badge)}`}>{product.badge}</div>}
            
            <div className="img-ph">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="card-img" 
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = '#111';
                        e.target.parentElement.style.display = 'flex';
                        e.target.parentElement.style.alignItems = 'center';
                        e.target.parentElement.style.justifyContent = 'center';
                        e.target.parentElement.innerHTML = 
                          '<span style="color:rgba(255,255,255,0.15);font-size:0.7rem;' +
                          'letter-spacing:0.2em;font-weight:700">LIBERO</span>';
                    }}
                />
                {isOut && <div className="out-overlay">OUT OF STOCK</div>}
            </div>
            
            <h3 className="card-name">{product.name}</h3>
            
            <div className="card-btm">
                <div className="price">
                    {product.originalPrice && <span className="price-orig">{formatter.format(product.originalPrice)}</span>}
                    <span className={product.originalPrice ? 'price-sale' : ''}>{formatter.format(product.price)}</span>
                </div>
            </div>

            {!isOut && (
                <div className="card-actions" onClick={e => e.stopPropagation()}>
                    <div className="size-mini-grid">
                        {availableSizes.map(s => (
                            <button 
                                key={s} 
                                className={`sz-btn ${selectedSize === s ? 'active' : ''}`}
                                onClick={(e) => { e.preventDefault(); setSelectedSize(s); }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    
                    <button className="add-to-bag-btn" onClick={handleAdd}>
                        ADD TO BAG
                    </button>
                    
                    {sizeError && <div className="sz-err">PLEASE SELECT A SIZE</div>}
                </div>
            )}

            <style>{`
                .card { position: relative; display: flex; flex-direction: column; text-decoration: none; color: inherit; background: #0c0c0c; border-radius: 8px; overflow: hidden; transition: transform 0.3s ease; }
                .card:hover { transform: translateY(-5px); }
                .img-ph { position: relative; aspect-ratio: 1/1; background: #1a1a1a; }
                .card-img { width: 100%; height: 100%; object-fit: cover; }
                
                .card-name { font-family: var(--font-bebas); font-size: 1.25rem; padding: 1rem 1rem 0.2rem; letter-spacing: 0.05em; color: white; }
                .card-btm { padding: 0 1rem 1rem; }
                
                .card-actions { padding: 0 1rem 1.5rem; display: flex; flex-direction: column; gap: 12px; }
                .size-mini-grid { display: flex; gap: 6px; flex-wrap: wrap; }
                .sz-btn { 
                    background: #1a1a1a; border: 1px solid #333; color: #888; 
                    font-size: 0.65rem; padding: 4px 0; width: 32px; cursor: pointer; 
                    font-weight: 700; border-radius: 2px; transition: 0.2s;
                }
                .sz-btn:hover { border-color: #666; color: #fff; }
                .sz-btn.active { background: #fff; color: #000; border-color: #fff; }

                .add-to-bag-btn {
                    background: #E8E8E8; color: #000; border: none;
                    padding: 10px; font-weight: 900; font-size: 0.7rem;
                    cursor: pointer; border-radius: 4px; letter-spacing: 0.05em;
                }
                .add-to-bag-btn:hover { filter: brightness(1.1); }

                .sz-err { color: #ff4d4d; font-size: 0.6rem; font-weight: 900; text-align: center; }

                .b-rd-outline { border: 1px solid #E8E8E8; color: #E8E8E8; background: transparent; }
            `}</style>
        </Link>
    );
};

export default ProductCard;

