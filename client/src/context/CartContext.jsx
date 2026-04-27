import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const LS_KEY = 'libero_cart';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Hydrate from localStorage on initial load
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem(LS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Derived values
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Persist to localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = (product, size, quantity = 1) => {
        // Product is expected to have { id, name, image, price }
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item.productId === product.id && item.size === size
            );

            if (existingItemIndex !== -1) {
                // Item exists, update quantity
                const newItems = [...prevItems];
                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: newItems[existingItemIndex].quantity + quantity
                };
                return newItems;
            } else {
                // New item
                return [...prevItems, {
                    productId: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    size,
                    quantity
                }];
            }
        });
        
        toast.success('Added to cart!');
    };

    const removeFromCart = (productId, size) => {
        setCartItems(prevItems => 
            prevItems.filter(item => !(item.productId === productId && item.size === size))
        );
    };

    const updateQuantity = (productId, size, newQty) => {
        if (newQty <= 0) {
            removeFromCart(productId, size);
            return;
        }

        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.productId === productId && item.size === size) {
                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            cartTotal,
            isCartOpen,
            openCart,
            closeCart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
