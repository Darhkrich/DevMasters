// src/components/common/AddToQuoteButton.jsx
'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { transformToCartItem } from '../../utils/dataTransform';

export default function AddToQuoteButton({ item, source, className = '' }) {
  const { addToCart, cart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Check if item is already in cart
  const isInCart = cart.some(cartItem => 
    cartItem.source === source && cartItem.id === item.id
  );

  const handleAddToQuote = () => {
    try {
      const cartItem = transformToCartItem(item, source);
      addToCart(cartItem);
      setIsAdded(true);
      
      // Show success message
      const event = new CustomEvent('cartUpdated', { 
        detail: { 
          item: cartItem,
          action: 'add'
        } 
      });
      window.dispatchEvent(event);
      
      // Reset after 2 seconds
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Show error message
      const event = new CustomEvent('cartError', { 
        detail: { 
          error: 'Failed to add item to cart',
          item
        } 
      });
      window.dispatchEvent(event);
    }
  };

  const getButtonText = () => {
    if (isAdded) return 'Added to Quote';
    if (isInCart) return 'Already in Quote';
    return 'Add to Quote';
  };

  const getIcon = () => {
    if (isAdded) return 'fas fa-check';
    if (isInCart) return 'fas fa-shopping-cart';
    return 'fas fa-plus';
  };

  return (
    <button
      onClick={handleAddToQuote}
      disabled={isInCart}
      className={`add-to-quote-btn ${isAdded ? 'added' : ''} ${isInCart ? 'in-cart' : ''} ${className}`}
      title={isInCart ? 'This item is already in your quote request' : 'Add to quote request'}
    >
      <i className={getIcon()}></i>
      {getButtonText()}
    </button>
  );
}