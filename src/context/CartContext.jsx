// src/context/CartContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

function readStoredJson(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    window.localStorage.removeItem(key);
    return fallback;
  }
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => readStoredJson('serviceQuoteCart', []));
  const [formData, setFormData] = useState(() => readStoredJson('quoteFormData', {}));
  const [builderSelections, setBuilderSelections] = useState(() => readStoredJson('builderSelections', {}));

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('serviceQuoteCart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('quoteFormData', JSON.stringify(formData));
    } catch (e) {
      console.error('Error saving form:', e);
    }
  }, [formData]);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      // Check if item already exists
      const exists = prev.some(cartItem => 
        cartItem.source === item.source && cartItem.id === item.id
      );
      if (exists) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((source, id) => {
    setCart(prev => prev.filter(item => 
      !(item.source === source && item.id === id)
    ));
  }, []);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setFormData({});
    localStorage.removeItem('serviceQuoteCart');
    localStorage.removeItem('quoteFormData');
    localStorage.removeItem('builderSelections');
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      if (item.price && typeof item.price === 'number') {
        return total + item.price;
      }
      return total;
    }, 0);
  }, [cart]);

  const getCartByCategory = useCallback(() => {
    const categories = {};
    cart.forEach(item => {
      const category = item.category || 'other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    return categories;
  }, [cart]);

  const value = {
    cart,
    formData,
    builderSelections,
    addToCart,
    removeFromCart,
    updateFormData,
    clearCart,
    getCartTotal,
    getCartByCategory,
    cartCount: cart.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
