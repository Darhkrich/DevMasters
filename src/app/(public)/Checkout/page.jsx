'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { analyzeCart } from '@/utils/dataTransform';
import CartSummary from '@/components/checkout/CartSummary';
import QuoteForm from '@/components/checkout/QuoteForm';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import { createOrder } from '@/lib/boemApi';
import './checkout.css';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoFillData = analyzeCart(cart);

  const handleSubmit = async (formValues) => {
    setIsSubmitting(true);

    const items = cart.map(item => {
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

    if (formValues.budgetRange && !isNaN(parseFloat(formValues.budgetRange))) {
      payload.budget_min = parseFloat(formValues.budgetRange);
    }

    try {
      const data = await createOrder(payload);
      clearCart();
      window.location.href = `/Checkout/success?order=${data.reference}`;
    } catch (err) {
      console.error('Order creation failed:', err);
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
      <div className="chk-page">
        <div className="chk-container">
          <div className="chk-empty">
            <div className="chk-empty-icon">🛒</div>
            <h1 className="chk-empty-title">Your Cart is Empty</h1>
            <p className="chk-empty-message">
              Add services or templates to your cart to request a quote.
            </p>
            <a href="/services" className="chk-browse-btn">
              <i className="fas fa-arrow-left"></i> Browse Services
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chk-page">
      {/* Progress Bar */}
      <div className="chk-progress">
        <div className="chk-container">
          <div className="chk-progress-inner">
            <div className="chk-steps">
              <div className="chk-step">
                <div className="chk-step-num chk-step-active">1</div>
                <span className="chk-step-label chk-step-label-active">Cart</span>
              </div>
              <div className="chk-step-line"></div>
              <div className="chk-step">
                <div className="chk-step-num chk-step-inactive">2</div>
                <span className="chk-step-label chk-step-label-inactive">Details</span>
              </div>
              <div className="chk-step-line"></div>
              <div className="chk-step">
                <div className="chk-step-num chk-step-upcoming">3</div>
                <span className="chk-step-label">Confirm</span>
              </div>
            </div>
            <div className="chk-item-count">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="chk-container">
        <CheckoutHeader cart={cart} />
        
        <div className="chk-grid">
          <div className="chk-sidebar">
            <CartSummary />
          </div>
          <div className="chk-form-col">
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