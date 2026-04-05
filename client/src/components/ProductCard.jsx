import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const getBadgeClass = (badge) => {
        if (!badge) return '';
        if (badge === 'BESTSELLER') return 'b-wh';
        if (badge.includes('SALE') || badge === 'NEW DROP') return 'b-rd';
        if (badge.includes('LIMITED')) return 'b-gd';
        if (badge.includes('AG SPECIAL')) return 'b-gn';
        if (badge === "COLLECTOR'S") return 'b-gd2';
        return 'b-wh';
    };

    return (
        <div className="card">
            {product.badge && <div className={`badge ${getBadgeClass(product.badge)}`}>{product.badge}</div>}
            <div className="img-ph"><span className="img-ph-txt">{product.image}</span></div>
            <h3 className="card-name">{product.name}</h3>
            <span className="surf-pill">{product.category}</span>
            <div className="card-btm">
                <div className="price">
                    {product.originalPrice && <span className="price-orig">₹{product.originalPrice.toLocaleString()}</span>}
                    {product.originalPrice && <span className="price-sale">₹{product.price.toLocaleString()}</span>}
                    {!product.originalPrice && `₹${product.price.toLocaleString()}`}
                </div>
                <div className="rev-sm">
                    <div className="stars-sm">★★★★★</div>
                    {product.rating} ({product.reviewCount})
                </div>
            </div>
            <button className="btn-cart" onClick={() => addToCart(product.id, 1)}>ADD TO CART</button>
        </div>
    );
};

export default ProductCard;
