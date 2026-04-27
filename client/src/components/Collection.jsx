import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from './ProductCard';

const Collection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('ALL');

    const categories = ['ALL', 'FG', 'AG', 'SG', 'IC'];

    const fetchProducts = async (cat = 'ALL') => {
        try {
            setLoading(true);
            const url = cat === 'ALL' ? '/products' : `/products?category=${cat}`;
            const { data } = await api.get(url);
            setProducts(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(category);
    }, [category]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            // Client-side filter is enough per requirements
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="section" id="collection">
            <div className="sec-head">
                <h2>THE COLLECTION</h2>
                <p>Engineered for the elite. Powered by Italian heritage.</p>
            </div>

            <div className="collection-tools">
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search boots..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <button onClick={handleSearch}>SEARCH</button>
                </div>
                
                <div className="filters">
                    {categories.map(cat => (
                        <span 
                            key={cat} 
                            className={category === cat ? 'on' : ''}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div className="card-skel" key={i}>
                            <div className="skel-img"></div>
                            <div className="skel-text"></div>
                            <div className="skel-text short"></div>
                        </div>
                    ))
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)
                ) : (
                    <div className="no-results">
                        <p>No boots matching your search.</p>
                        <button onClick={() => { setSearchTerm(''); setCategory('ALL'); }}>CLEAR FILTERS</button>
                    </div>
                )}
            </div>

            <style>{`
                .collection-tools {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                    margin-bottom: 4rem;
                }
                .search-bar {
                    display: flex;
                    width: 100%;
                    max-width: 500px;
                    border: 1px solid var(--border);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .search-bar input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    padding: 12px 20px;
                    color: white;
                    font-family: var(--font-inter);
                    outline: none;
                }
                .search-bar button {
                    background: #E8E8E8;
                    color: black;
                    border: none;
                    padding: 0 20px;
                    font-weight: 800;
                    font-size: 0.7rem;
                    cursor: pointer;
                }

                .card-skel {
                    background: #111;
                    padding: 1.5rem;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .skel-img { background: #1a1a1a; height: 180px; border-radius: 4px; }
                .skel-text { background: #1a1a1a; height: 20px; border-radius: 4px; }
                .skel-text.short { width: 60%; }

                .no-results {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 5rem 0;
                    color: var(--text-muted);
                }
                .no-results button {
                    background: none;
                    border: 1px solid var(--border);
                    color: #E8E8E8;
                    padding: 10px 20px;
                    margin-top: 1rem;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 0.7rem;
                }
            `}</style>
        </section>
    );
};

export default Collection;

