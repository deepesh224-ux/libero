import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const CartDrawer = () => {
    const navigate = useNavigate();
    const { 
        isCartOpen, 
        closeCart, 
        cartItems, 
        cartTotal, 
        removeFromCart, 
        updateQuantity 
    } = useCart();
    const { user } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    const shippingFee = 0;
    const grandTotal = cartTotal + shippingFee;

    const handleCheckout = () => {
        if (!user) {
            toast.error('Please log in to checkout');
            setIsAuthOpen(true);
        } else {
            closeCart();
            navigate('/checkout');
        }
    };

    const handleUpdateQty = (item, delta) => {
        const newQty = item.quantity + delta;
        if (newQty < 1) {
            removeFromCart(item.productId, item.size);
        } else {
            updateQuantity(item.productId, item.size, newQty);
        }
    };

    return (
        <>
            <div className={`cart-backdrop ${isCartOpen ? 'visible' : ''}`} onClick={closeCart} />

            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>YOUR BAG</h2>
                    <button className="cart-close-icon" onClick={closeCart}>✕</button>
                </div>

                <div className="cart-body">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty-state">
                            <h3>YOUR BAG IS EMPTY</h3>
                            <p>Looks like you haven&apos;t added any gear yet.</p>
                            <button className="shop-now-btn" onClick={() => { closeCart(); window.location.href='#collection'; }}>
                                SHOP COLLECTION
                            </button>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div key={`${item.productId}-${item.size}`} className="drawer-item">
                                    <div className="d-item-img">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            onError={(e) => { e.target.src = 'https://placehold.co/200x200/111/white?text=IMAGE'; }}
                                        />
                                    </div>
                                    <div className="d-item-details">
                                        <div className="d-item-top">
                                            <h4>{item.name}</h4>
                                            <button className="d-item-del" onClick={() => removeFromCart(item.productId, item.size)}>✕</button>
                                        </div>
                                        <span className="d-item-size">EU {item.size}</span>
                                        <div className="d-item-bottom">
                                            <div className="d-qty-box">
                                                <button onClick={() => handleUpdateQty(item, -1)}>−</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => handleUpdateQty(item, 1)}>+</button>
                                            </div>
                                            <span className="d-item-price">{formatter.format(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer-box">
                        <div className="fee-line">
                            <span>Subtotal</span>
                            <span>{formatter.format(cartTotal)}</span>
                        </div>
                        <div className="fee-line">
                            <span>Shipping</span>
                            <span className="free-ship">FREE</span>
                        </div>
                        <div className="fee-line final-total">
                            <span>TOTAL</span>
                            <span>{formatter.format(grandTotal)}</span>
                        </div>
                        <button className="drawer-checkout-cta" onClick={handleCheckout}>
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                )}
            </div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

            <style>{`
                .cart-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); z-index: 2000; visibility: hidden; opacity: 0; transition: 0.4s; }
                .cart-backdrop.visible { visibility: visible; opacity: 1; }

                .cart-drawer { 
                    position: fixed; top: 0; right: 0; height: 100vh; width: 100%; max-width: 450px; 
                    background: #080808; z-index: 2001; display: flex; flex-direction: column;
                    transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    border-left: 1px solid #1a1a1a;
                }
                .cart-drawer.open { transform: translateX(0); }

                .cart-header { padding: 2rem; border-bottom: 1px solid #1a1a1a; display: flex; justify-content: space-between; align-items: center; }
                .cart-header h2 { font-family: var(--font-bebas); font-size: 1.8rem; letter-spacing: 0.1em; }
                .cart-close-icon { background: none; border: none; color: #555; font-size: 1.5rem; cursor: pointer; transition: 0.2s; }
                .cart-close-icon:hover { color: #fff; }

                .cart-body { flex: 1; overflow-y: auto; padding: 2rem; }
                
                .cart-empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
                .empty-icon { font-size: 4rem; margin-bottom: 1rem; filter: grayscale(1); opacity: 0.3; }
                .cart-empty-state h3 { font-family: var(--font-bebas); font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
                .cart-empty-state p { font-size: 0.85rem; color: #555; margin-bottom: 2rem; }
                .shop-now-btn { background: #fff; color: #000; border: none; padding: 12px 2rem; font-weight: 800; font-size: 0.75rem; cursor: pointer; border-radius: 4px; }

                .drawer-item { display: flex; gap: 1.5rem; margin-bottom: 2.5rem; }
                .d-item-img { width: 90px; height: 90px; background: #0c0c0c; border: 1px solid #1a1a1a; border-radius: 4px; overflow: hidden; }
                .d-item-img img { width: 100%; height: 100%; object-fit: cover; }
                
                .d-item-details { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
                .d-item-top { display: flex; justify-content: space-between; align-items: flex-start; }
                .d-item-top h4 { font-size: 0.95rem; font-weight: 700; margin: 0; color: #fff; }
                .d-item-del { background: none; border: none; color: #444; cursor: pointer; font-size: 0.9rem; }
                .d-item-del:hover { color: #E8E8E8; }
                .d-item-size { font-size: 0.7rem; color: #555; font-weight: 700; }
                
                .d-item-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 5px; }
                .d-qty-box { display: flex; align-items: center; gap: 12px; border: 1px solid #222; padding: 4px 10px; border-radius: 4px; }
                .d-qty-box button { background: none; border: none; color: #fff; cursor: pointer; font-size: 1rem; width: 20px; }
                .d-qty-box span { font-size: 0.85rem; font-weight: 800; min-width: 15px; text-align: center; }
                .d-item-price { font-weight: 700; font-size: 0.95rem; font-family: var(--font-space); }

                .cart-footer-box { padding: 2.5rem 2rem; background: #0c0c0c; border-top: 1px solid #1a1a1a; display: flex; flex-direction: column; gap: 1rem; }
                .fee-line { display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 600; color: #888; }
                .free-ship { color: #E8E8E8; font-weight: 800; }
                .final-total { border-top: 1px solid #222; padding-top: 1.5rem; margin-top: 0.5rem; color: #fff; font-size: 1.3rem; font-weight: 900; }
                
                .drawer-checkout-cta { 
                    background: #E8E8E8; color: #000; border: none; padding: 1.2rem; 
                    font-weight: 900; font-size: 0.85rem; letter-spacing: 0.1em; 
                    cursor: pointer; border-radius: 4px; margin-top: 1rem; transition: 0.2s;
                }
                .drawer-checkout-cta:hover { transform: translateY(-2px); opacity: 0.9; }
            `}</style>
        </>
    );
};

export default CartDrawer;

