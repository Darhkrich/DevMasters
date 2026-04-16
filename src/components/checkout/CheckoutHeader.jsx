// src/components/checkout/CheckoutHeader.jsx
'use client';

import { useCart } from '../../context/CartContext';
import './checkoutHeader.css';

export default function CheckoutHeader({ cart }) {
  const { getCartTotal } = useCart();
  const total = getCartTotal();
  
  return (
    <div className="chk-header">
      <h1 className="chk-header-title">Request Your Quote</h1>
      <p className="chk-header-subtitle">
        Fill out the form below to get a customized quote for your project. Our team will review your requirements and contact you within 24 hours.
      </p>
      
      <div className="chk-stats">
        <div className="chk-stat-card">
          <div className="chk-stat-label">Services Selected</div>
          <div className="chk-stat-value">{cart.length}</div>
        </div>
        
        <div className="chk-stat-card">
          <div className="chk-stat-label">Estimated Timeline</div>
          <div className="chk-stat-value">1-3 days</div>
          <div className="chk-stat-sub">For quote preparation</div>
        </div>
        
        <div className="chk-stat-card">
          <div className="chk-stat-label">Next Steps</div>
          <div className="chk-stat-value">1. Quote</div>
          <div className="chk-stat-sub">2. Consultation → 3. Project Start</div>
        </div>
      </div>
    </div>
  );
}