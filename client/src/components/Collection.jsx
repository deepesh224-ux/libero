import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Collection = () => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        axios.get(`${API_URL}/api/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const filters = ['ALL', 'FG', 'AG', 'TF', 'LIMITED EDITION'];

    const filteredProducts = products.filter(p => {
        if (filter === 'ALL') return true;
        if (filter === 'LIMITED EDITION') return p.badge && p.badge.includes('LIMITED');
        return p.category.includes(filter);
    });

    return (
        <section className="section" id="collection" style={{ background: 'var(--bg)' }}>
            <div className="sec-head">
                <h2>THE COLLECTION</h2>
                <p>Handcrafted in limited numbers. Built to outlast the game.</p>
            </div>
            <div className="filters">
                {filters.map(f => (
                    <span 
                        key={f} 
                        className={filter === f ? 'on' : ''}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </span>
                ))}
            </div>
            <div className="grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)
                ) : (
                    [1, 2, 3].map(i => (
                        <div className="card" key={i}>
                            <div className="img-ph"></div>
                            <div className="card-name">LOADING...</div>
                        </div>
                    ))
                )}
            </div>
            <div className="grid-cta">
                <button className="btn-ghost">VIEW FULL CATALOGUE →</button>
            </div>
        </section>
    );
};

export default Collection;
