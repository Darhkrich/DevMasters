// src/components/checkout/CheckoutHeader.jsx
'use client';

import { useCart } from '../../context/CartContext';

export default function CheckoutHeader({ cart }) {
  const { getCartTotal } = useCart();
  const total = getCartTotal();
  
  return (
    <div className="checkout-header">
      <h1 className="checkout-title">Request Your Quote</h1>
      <p className="checkout-subtitle">
        Fill out the form below to get a customized quote for your project. Our team will review your requirements and contact you within 24 hours.
      </p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Services Selected</div>
          <div className="stat-value">{cart.length}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Estimated Timeline</div>
          <div className="stat-value">1-3 days</div>
          <div className="stat-subvalue">For quote preparation</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Next Steps</div>
          <div className="stat-value">1. Quote</div>
          <div className="stat-subvalue">2. Consultation → 3. Project Start</div>
        </div>
      </div>
    </div>
  );
}