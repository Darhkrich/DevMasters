// src/components/checkout/CartSummary.jsx
'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import ServiceCard from './ServiceCard';

export default function CartSummary() {
  const { cart, getCartByCategory, removeFromCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categorizedCart = getCartByCategory();
  const categories = Object.keys(categorizedCart);
  
  const displayItems = activeCategory === 'all' 
    ? cart 
    : categorizedCart[activeCategory] || [];

  if (cart.length === 0) {
    return (
      <div className="cart-summary">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3 className="empty-cart-title">Your cart is empty</h3>
          <p className="empty-cart-message">Add services to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <div className="cart-summary-header">
        <h2 className="cart-summary-title">Selected Services</h2>
        <span className="cart-items-count">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="category-tabs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
          >
            All Services ({cart.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            >
              {category} ({categorizedCart[category].length})
            </button>
          ))}
        </div>
      )}

      {/* Service Cards */}
      <div className="cart-items">
        {displayItems.map((item, index) => (
          <ServiceCard 
            key={`${item.source}-${item.id}`}
            item={item}
            index={index}
            onRemove={() => removeFromCart(item.source, item.id)}
          />
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-gray-400 mb-2">
          <span>Services selected</span>
          <span>{cart.length}</span>
        </div>
        <div className="flex justify-between text-gray-400 mb-4">
          <span>Requires consultation</span>
          <span>{cart.some(item => item.requiresDocuments) ? 'Yes' : 'No'}</span>
        </div>
        <div className="text-sm text-gray-500 italic">
          * Final pricing will be determined after consultation based on your specific requirements.
        </div>
      </div>
    </div>
  );
}