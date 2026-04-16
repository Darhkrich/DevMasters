// src/components/checkout/CartSummary.jsx
'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import ServiceCard from './ServiceCard';
import './CartSummary.css';

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
      <div className="chk-cart">
        <div className="chk-cart-empty">
          <div className="chk-cart-empty-icon">🛒</div>
          <h3 className="chk-cart-empty-title">Your cart is empty</h3>
          <p className="chk-cart-empty-message">Add services to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chk-cart">
      <div className="chk-cart-header">
        <h2 className="chk-cart-title">Selected Services</h2>
        <span className="chk-cart-count">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="chk-cart-tabs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`chk-cart-tab ${activeCategory === 'all' ? 'chk-cart-tab-active' : ''}`}
          >
            All Services ({cart.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`chk-cart-tab ${activeCategory === category ? 'chk-cart-tab-active' : ''}`}
            >
              {category} ({categorizedCart[category].length})
            </button>
          ))}
        </div>
      )}

      {/* Service Cards */}
      <div className="chk-cart-items">
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
      <div className="chk-cart-footer">
        <div className="chk-cart-footer-row">
          <span>Services selected</span>
          <span>{cart.length}</span>
        </div>
        <div className="chk-cart-footer-row">
          <span>Requires consultation</span>
          <span>{cart.some(item => item.requiresDocuments) ? 'Yes' : 'No'}</span>
        </div>
        <div className="chk-cart-footer-note">
          * Final pricing will be determined after consultation based on your specific requirements.
        </div>
      </div>
    </div>
  );
}