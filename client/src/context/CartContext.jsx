import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = async (productId, quantity = 1) => {
    // Optimistic update
    setCartCount(prev => prev + quantity);

    try {
      const response = await axios.post('/api/cart', { productId, quantity });
      if (response.data.success) {
        setCartCount(response.data.cartSummary.totalItems);
      }
    } catch (error) {
      console.error('Failed to add to cart on server', error);
      // Revert if failed
      setCartCount(prev => Math.max(0, prev - quantity));
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
