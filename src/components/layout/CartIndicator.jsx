// src/components/layout/CartIndicator.jsx
'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function CartIndicator() {
  const { cartCount, cart } = useCart();
  const [showPreview, setShowPreview] = useState(false);

  if (cartCount === 0) {
    return (
      <Link href="/checkout" className="cart-indicator empty">
        <i className="fas fa-shopping-cart"></i>
        <span className="count">0</span>
      </Link>
    );
  }

  return (
    <div className="cart-indicator-container">
      <Link 
        href="/checkout" 
        className="cart-indicator"
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        <i className="fas fa-shopping-cart"></i>
        <span className="count">{cartCount}</span>
      </Link>
      
      {showPreview && (
        <div className="cart-preview">
          <div className="cart-preview-header">
            <h4>Your Quote Request</h4>
            <span>{cartCount} items</span>
          </div>
          <div className="cart-preview-items">
            {cart.slice(0, 3).map((item, index) => (
              <div key={index} className="cart-preview-item">
                <div className="item-name">{item.title}</div>
                <div className="item-category">{item.category}</div>
              </div>
            ))}
            {cart.length > 3 && (
              <div className="more-items">+{cart.length - 3} more items</div>
            )}
          </div>
          <Link href="/checkout" className="view-quote-btn">
            View Quote Request
          </Link>
        </div>
      )}
    </div>
  );
}