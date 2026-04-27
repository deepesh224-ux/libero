import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
    const { user } = useAuth();
    
    // Tabs
    const [activeTab, setActiveTab] = useState('products');
    
    // Data
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Modals/Forms
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '', category: 'FG', price: '', countInStock: '', image: '', description: '', badge: ''
    });

    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'products') {
                const { data } = await api.get('/products');
                setProducts(data);
            } else if (activeTab === 'orders') {
                const { data } = await api.get('/orders');
                setOrders(data);
            } else if (activeTab === 'newsletter') {
                const { data } = await api.get('/newsletter');
                setSubscribers(data);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error(err.response?.data?.error || 'Access denied or server error');
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type = 'success') => {
        if (type === 'success') {
            toast.success(text);
        } else {
            toast.error(text);
        }
    };

    // ── PRODUCTS ─────────────────────────────────────────────────────────────

    const handleOpenAdd = () => {
        setEditingProduct(null);
        setProductForm({ name: '', category: 'FG', price: '', countInStock: '', image: '', description: '', badge: '' });
        setIsProductModalOpen(true);
    };

    const handleOpenEdit = (p) => {
        setEditingProduct(p);
        setProductForm({ 
            name: p.name, 
            category: p.category, 
            price: p.price, 
            countInStock: p.countInStock, 
            image: p.image, 
            description: p.description || '', 
            badge: p.badge || '' 
        });
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, productForm);
                showMsg('Product updated successfully');
            } else {
                await api.post('/products', productForm);
                showMsg('New product added to inventory');
            }
            setIsProductModalOpen(false);
            fetchData();
        } catch (err) {
            showMsg(err.response?.data?.error || 'Failed to save product', 'error');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure? This action is permanent.')) return;
        try {
            await api.delete(`/products/${id}`);
            showMsg('Product removed from catalog');
            fetchData();
        } catch (err) {
            showMsg('Delete operation failed', 'error');
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProductForm(prev => ({ ...prev, image: data.imageUrl }));
            showMsg('Visual asset uploaded');
        } catch (err) {
            showMsg('Asset upload failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    // ── ORDERS ──────────────────────────────────────────────────────────────

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            showMsg(`Order status updated to ${newStatus}`);
            fetchData();
        } catch (err) {
            showMsg('Status update failed', 'error');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-wrapper">
                <header className="admin-nav">
                    <div className="brand-group">
                        <span className="admin-label">RESTRICTED AREA</span>
                        <h1>COMMAND CENTER</h1>
                    </div>
                    <div className="tab-menu">
                        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>INVENTORY</button>
                        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>ORDER FLOW</button>
                        <button className={activeTab === 'newsletter' ? 'active' : ''} onClick={() => setActiveTab('newsletter')}>AUDIENCE</button>
                    </div>
                </header>


                <main className="admin-body">
                    {loading ? (
                        <div className="admin-skeleton-list">
                            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-row"></div>)}
                        </div>
                    ) : activeTab === 'products' ? (
                        <section className="pane">
                            <div className="pane-header">
                                <h2>{products.length} Products in Stock</h2>
                                <button className="btn-add-p" onClick={handleOpenAdd}>+ CREATE PRODUCT</button>
                            </div>
                            <div className="table-container shadow-2xl">
                                <table className="libero-admin-table">
                                    <thead>
                                        <tr>
                                            <th>ITEM</th>
                                            <th>TYPE</th>
                                            <th>PRICE</th>
                                            <th>STOCK</th>
                                            <th>BADGE</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p.id}>
                                                <td><div className="td-p-name"><strong>{p.name}</strong><small>ID: {p.id}</small></div></td>
                                                <td><span className="cat-tag">{p.category}</span></td>
                                                <td className="price-bold">{formatter.format(p.price)}</td>
                                                <td><span className={p.countInStock < 10 ? 'stock-low' : ''}>{p.countInStock}</span></td>
                                                <td>{p.badge ? <span className="admin-badge">{p.badge}</span> : '—'}</td>
                                                <td className="actions-cell">
                                                    <button className="edit-btn" onClick={() => handleOpenEdit(p)}>EDIT</button>
                                                    <button className="delete-btn" onClick={() => handleDeleteProduct(p.id)}>REMOVE</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    ) : activeTab === 'orders' ? (
                        <section className="pane">
                            <div className="pane-header">
                                <h2>Transaction Monitor</h2>
                            </div>
                            <div className="table-container shadow-2xl">
                                <table className="libero-admin-table">
                                    <thead>
                                        <tr>
                                            <th>ORDER #</th>
                                            <th>CUSTOMER</th>
                                            <th>TOTAL</th>
                                            <th>STATUS</th>
                                            <th>PLACED ON</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o.id}>
                                                <td className="mono">#{o.id.toString().slice(-6).toUpperCase()}</td>
                                                <td>
                                                    <div className="td-cust-info">
                                                        <span>{o.user?.name}</span>
                                                        <small>{o.user?.email}</small>
                                                    </div>
                                                </td>
                                                <td className="price-bold">{formatter.format(o.total)}</td>
                                                <td>
                                                    <select 
                                                        value={o.status} 
                                                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                                                        className={`status-gateway ${o.status.toLowerCase()}`}
                                                    >
                                                        <option value="pending">PENDING</option>
                                                        <option value="confirmed">CONFIRMED</option>
                                                        <option value="shipped">SHIPPED</option>
                                                        <option value="delivered">DELIVERED</option>
                                                        <option value="cancelled">CANCELLED</option>
                                                    </select>
                                                </td>
                                                <td className="date-cell">{new Date(o.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    ) : (
                        <section className="pane">
                            <div className="pane-header">
                                <h2>Audience Database</h2>
                                <span className="sub-count">{subscribers.length} Global Subscribers</span>
                            </div>
                            <div className="table-container shadow-2xl">
                                <table className="libero-admin-table">
                                    <thead>
                                        <tr>
                                            <th>EMAIL ADDRESS</th>
                                            <th>OPT-IN DATE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscribers.map((s, i) => (
                                            <tr key={i}>
                                                <td className="email-cell">{s.email}</td>
                                                <td className="date-cell">{new Date(s.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </main>
            </div>

            {/* PRODUCT MODAL */}
            {isProductModalOpen && (
                <div className="admin-modal-overlay" onClick={() => setIsProductModalOpen(false)}>
                    <div className="luxury-modal" onClick={e => e.stopPropagation()}>
                        <header className="m-header">
                            <h3>PRODUCT MANAGEMENT</h3>
                            <button className="close-m" onClick={() => setIsProductModalOpen(false)}>✕</button>
                        </header>
                        <form onSubmit={handleSaveProduct} className="admin-p-form">
                            <div className="grid-2">
                                <div className="f-g">
                                    <label>BOOT NAME</label>
                                    <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required placeholder="e.g. Mercurial Elite" />
                                </div>
                                <div className="f-g">
                                    <label>TECH CATEGORY</label>
                                    <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                                        <option value="FG">FG (Firm Ground)</option>
                                        <option value="AG">AG (Artificial)</option>
                                        <option value="SG">SG (Soft Ground)</option>
                                        <option value="IC">IC (Indoor)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="f-g">
                                    <label>SRP (₹)</label>
                                    <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} required />
                                </div>
                                <div className="f-g">
                                    <label>ALLOCATED STOCK</label>
                                    <input type="number" value={productForm.countInStock} onChange={e => setProductForm({...productForm, countInStock: Number(e.target.value)})} required />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="f-g">
                                    <label>COLLECTION BADGE</label>
                                    <input type="text" value={productForm.badge} onChange={e => setProductForm({...productForm, badge: e.target.value})} placeholder="NEW / BESTSELLER / null" />
                                </div>
                                <div className="f-g">
                                    <label>VISUAL ASSET (URL OR UPLOAD)</label>
                                    <div className="dual-input">
                                        <input type="text" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} placeholder="https://..." />
                                        <label className="admin-upload-btn">
                                            UPLOAD
                                            <input type="file" onChange={uploadFileHandler} hidden />
                                        </label>
                                    </div>
                                    {uploading && <span className="up-status">TRANSMITTING...</span>}
                                </div>
                            </div>
                            <div className="f-g">
                                <label>TECH SPECIFICATIONS / DESCRIPTION</label>
                                <textarea rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required></textarea>
                            </div>
                            <button type="submit" className="admin-save-cta">COMMITT CHANGES</button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .admin-dashboard { min-height: 100vh; background: #050505; color: #fff; padding-top: 100px; font-family: var(--font-inter); }
                .admin-wrapper { max-width: 1400px; margin: 0 auto; padding: 2.5rem; }

                .admin-nav { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid #111; padding-bottom: 2rem; margin-bottom: 3rem; }
                .admin-label { display: block; font-size: 0.6rem; color: var(--primary); font-weight: 900; letter-spacing: 0.3em; margin-bottom: 0.5rem; }
                .admin-nav h1 { font-family: var(--font-bebas); font-size: 3rem; margin: 0; line-height: 1; letter-spacing: 0.05em; }
                
                .tab-menu { display: flex; gap: 3rem; }
                .tab-menu button { background: none; border: none; font-size: 0.75rem; font-weight: 800; color: #333; letter-spacing: 0.1em; cursor: pointer; padding-bottom: 1rem; position: relative; transition: color 0.3s; }
                .tab-menu button.active { color: #fff; }
                .tab-menu button.active::after { content: ""; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--primary); }

                .admin-toast-pill { position: fixed; top: 120px; right: 2rem; background: #fff; color: #000; padding: 12px 24px; border-radius: 4px; font-size: 0.75rem; font-weight: 800; z-index: 20000; box-shadow: 0 10px 40px rgba(0,0,0,0.5); animation: toastIn 0.4s var(--ease) forwards; }
                .admin-toast-pill.error { background: #ef4444; color: #fff; }
                @keyframes toastIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }

                .pane-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .pane-header h2 { font-size: 0.9rem; color: #555; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; }
                .sub-count { font-weight: 900; color: #fff; }

                .btn-add-p { background: #fff; color: #000; border: none; padding: 10px 20px; font-size: 0.7rem; font-weight: 900; cursor: pointer; border-radius: 2px; }

                /* TABLE STYLING */
                .table-container { background: #080808; border-radius: 8px; border: 1px solid #111; overflow: hidden; }
                .libero-admin-table { width: 100%; border-collapse: collapse; text-align: left; }
                .libero-admin-table th { background: #0a0a0a; padding: 1.2rem 1.5rem; font-size: 0.6rem; color: #444; text-transform: uppercase; letter-spacing: 0.1em; }
                .libero-admin-table td { padding: 1.5rem; border-bottom: 1px solid #111; font-size: 0.85rem; color: #ccc; }
                
                .td-p-name { display: flex; flex-direction: column; gap: 4px; }
                .td-p-name small { font-size: 0.65rem; color: #444; }
                .cat-tag { font-size: 0.65rem; font-weight: 800; background: #111; padding: 4px 8px; border-radius: 4px; color: #666; }
                .price-bold { font-weight: 800; color: #fff; }
                .stock-low { color: #ef4444; font-weight: 900; }
                .admin-badge { font-size: 0.6rem; font-weight: 900; background: var(--primary); color: #fff; padding: 2px 6px; border-radius: 2px; }

                .actions-cell { display: flex; gap: 1rem; }
                .edit-btn { background: none; border: none; color: #3b82f6; font-weight: 800; font-size: 0.65rem; cursor: pointer; }
                .delete-btn { background: none; border: none; color: #ef4444; font-weight: 800; font-size: 0.65rem; cursor: pointer; }

                .status-gateway { background: #000; border: 1px solid #333; color: #fff; padding: 6px 12px; border-radius: 4px; font-size: 0.7rem; font-weight: 800; cursor: pointer; text-transform: uppercase; }
                .status-gateway.pending { border-color: #555; color: #555; }
                .status-gateway.delivered { border-color: #22c55e; color: #22c55e; }

                /* MODAL */
                .admin-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(8px); z-index: 50000; display: flex; align-items: center; justify-content: center; }
                .luxury-modal { background: #0c0c0c; border: 1px solid #222; border-radius: 12px; width: min(700px, 95vw); padding: 3rem; }
                .m-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
                .m-header h3 { font-size: 0.8rem; font-weight: 900; letter-spacing: 0.2em; color: #555; margin: 0; }
                .close-m { background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; }

                .admin-p-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .f-g { display: flex; flex-direction: column; gap: 0.8rem; }
                .f-g label { font-size: 0.65rem; font-weight: 800; color: #444; }
                .f-g input, .f-g select, .f-g textarea { background: #000; border: 1px solid #222; color: #fff; padding: 14px; border-radius: 4px; font-size: 0.85rem; outline: none; transition: 0.2s; }
                .f-g input:focus { border-color: #fff; }

                .dual-input { display: flex; gap: 10px; }
                .admin-upload-btn { background: #222; color: #fff; padding: 0 15px; display: flex; align-items: center; font-size: 0.6rem; font-weight: 900; border-radius: 4px; cursor: pointer; }
                .up-status { font-size: 0.6rem; color: var(--primary); font-weight: 900; margin-top: 5px; }

                .admin-save-cta { margin-top: 1rem; background: #fff; color: #000; border: none; padding: 1.2rem; border-radius: 4px; font-weight: 900; font-size: 0.8rem; letter-spacing: 0.1em; cursor: pointer; }

                .admin-skeleton-list { display: flex; flex-direction: column; gap: 10px; }
                .skeleton-row { height: 80px; background: #0a0a0a; border-radius: 4px; position: relative; overflow: hidden; }
                .skeleton-row::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent); animation: shimmer 1.5s infinite; }
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
            `}</style>
        </div>
    );
};

export default AdminPage;

