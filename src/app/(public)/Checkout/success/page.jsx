'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '@/styles/checkout.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get('order');

  return (
    <>
      {orderRef && (
        <div className="quote-reference">
          <div className="quote-reference-label">Your Order Reference</div>
          <div className="quote-reference-value">{orderRef}</div>
          <p className="text-sm text-gray-400 mt-2">
            Please save this reference for future communication.
          </p>
        </div>
      )}
    </>
  );
}

export default function SuccessPage() {
  // Clear cart on success (extra safety)
  useEffect(() => {
    localStorage.removeItem('serviceQuoteCart');
    localStorage.removeItem('quoteFormData');
    const event = new CustomEvent('cartCleared');
    window.dispatchEvent(event);
  }, []);

  return (
    <div className="checkout-page">
      <div className="success-page">
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">
              <i className="fas fa-check"></i>
            </div>

            <h1 className="success-title">Order Submitted Successfully!</h1>
            <p className="success-message">
              Your order has been received. Our team will review your requirements and contact you within 24 hours.
            </p>

            <Suspense fallback={
              <div className="quote-reference">
                <div className="quote-reference-label">Loading order reference...</div>
              </div>
            }>
              <SuccessContent />
            </Suspense>

            <div className="success-steps">
              <div className="success-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Initial Review</h4>
                  <p>Our team will review your requirements within 24 hours</p>
                </div>
              </div>

              <div className="success-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Schedule Consultation</h4>
                  <p>We&apos;ll contact you to schedule a detailed consultation call</p>
                </div>
              </div>

              <div className="success-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Receive Custom Quote</h4>
                  <p>You&apos;ll receive a detailed quote and proposal</p>
                </div>
              </div>
            </div>

            <div className="success-actions">
              <Link href="/dashboard" className="success-btn secondary">
                <i className="fas fa-home mr-2"></i>
                View Your Dashboard
              </Link>
              <Link href="/services" className="success-btn primary">
                <i className="fas fa-briefcase mr-2"></i>
                Browse More Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
