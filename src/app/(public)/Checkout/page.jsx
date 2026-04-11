'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { analyzeCart } from '@/utils/dataTransform';
import CartSummary from '@/components/checkout/CartSummary';
import QuoteForm from '@/components/checkout/QuoteForm';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import { createOrder } from '@/lib/boemApi'; // changed from createInquiry
import '@/styles/checkout.css';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoFillData = analyzeCart(cart);

  const handleSubmit = async (formValues) => {
  setIsSubmitting(true);

  // Build items array from cart
  const items = cart.map(item => {
    // Determine item_type based on source
    let item_type = 'custom';
    if (item.source === 'appServices') item_type = 'service';
    else if (item.source === 'automation') item_type = 'ai';
    else if (item.source === 'pricingData') item_type = 'package';
    else if (item.source === 'templates') item_type = 'template';
    else if (item.source === 'bundles') item_type = 'bundle';

    return {
      item_type,
      item_id: String(item.id),
      title: item.title,
      price: typeof item.price === 'number' ? item.price : null,
      quantity: 1,
      metadata: {
        source: item.source,
        category: item.category,
        description: item.description,
        priceType: item.priceType,
        requiresDocuments: item.requiresDocuments,
        features: item.features,
        deliveryTime: item.deliveryTime,
        previewUrl: item.previewUrl,
        icon: item.icon,
      }
    };
  });

  const payload = {
    client_name: formValues.fullName,
    client_email: formValues.email,
    client_company: formValues.company || '',
    project_details: formValues.description,
    timeline: formValues.timeline || '',
    notes: formValues.message,
    items: items,
    metadata: {
      how_heard: formValues.howHeard || "",
      urgency: formValues.urgency || "",
      terms_accepted: Boolean(formValues.termsAccepted),
      cart_analysis: autoFillData,
    }
  };

  // Add budget_min only if it's a valid number
  if (formValues.budgetRange && !isNaN(parseFloat(formValues.budgetRange))) {
    payload.budget_min = parseFloat(formValues.budgetRange);
  }

  // Log for debugging
  console.log('Sending order payload:', JSON.stringify(payload, null, 2));

  try {
    const data = await createOrder(payload);
    clearCart();
    window.location.href = `/Checkout/success?order=${data.reference}`;
  } catch (err) {
    console.error('Order creation failed:', err);
    // Try to extract error details from the response
    if (err.payload && err.payload.errors) {
      alert(`Error: ${JSON.stringify(err.payload.errors)}`);
    } else {
      alert(err.message || 'Something went wrong while submitting your order.');
    }
  }

  setIsSubmitting(false);
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
