// src/app/(public)/Checkout/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { analyzeCart } from '@/utils/dataTransform';
import CartSummary from '@/components/checkout/CartSummary';
import QuoteForm from '@/components/checkout/QuoteForm';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import { useRouter } from 'next/navigation';
import '@/styles/checkout.css'; // Import CSS

export default function CheckoutPage() {
  const { cart, formData, updateFormData } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoFillData, setAutoFillData] = useState({});

  // Analyze cart for auto-fill data
  useEffect(() => {
    const analysis = analyzeCart(cart);
    setAutoFillData(analysis);
    
    // Auto-update form with suggestions
    if (analysis.serviceCategory && !formData.serviceCategory) {
      updateFormData({ serviceCategory: analysis.serviceCategory });
    }
    if (analysis.suggestedTimeline && !formData.timeline) {
      updateFormData({ timeline: analysis.suggestedTimeline });
    }
  }, [cart, formData, updateFormData]);

  const handleSubmit = async (formValues) => {
    setIsSubmitting(true);
    
    // Prepare quote data
    const quoteData = {
      id: `QR-${Date.now().toString().slice(-8)}`,
      timestamp: new Date().toISOString(),
      status: 'New',
      cartItems: cart,
      formData: formValues,
      autoFillData,
    };

    console.log('Submitting quote:', quoteData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    
    // Redirect to success page
    window.location.href = `/Checkout/success?quote=${quoteData.id}`;
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h1 className="empty-cart-title">Your Cart is Empty</h1>
            <p className="empty-cart-message">
              Add services or templates to your cart to request a quote.
            </p>
            <a 
              href="/services" 
              className="browse-services-btn"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Browse Services
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="checkout-container">
          <div className="progress-inner">
            <div className="progress-steps">
              <div className="progress-step">
                <div className="step-number active">1</div>
                <span className="step-label active">Cart</span>
              </div>
              <div className="step-connector"></div>
              <div className="progress-step">
                <div className="step-number inactive">2</div>
                <span className="step-label inactive">Details</span>
              </div>
              <div className="step-connector"></div>
              <div className="progress-step">
                <div className="step-number upcoming">3</div>
                <span className="step-label">Confirm</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="checkout-container">
        <CheckoutHeader cart={cart} />
        
        <div className="checkout-grid">
          {/* Left Column - Cart Summary */}
          <div className="sticky-sidebar">
            <CartSummary />
          </div>

          {/* Right Column - Quote Form */}
          <div>
            <QuoteForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              autoFillData={autoFillData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}