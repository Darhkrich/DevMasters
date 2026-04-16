// app/Checkout/success/page.jsx (or wherever it lives)
'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import './success.css'; // new CSS file

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get('order');

  return (
    <>
      {orderRef && (
        <div className="chk-success-ref">
          <div className="chk-success-ref-label">Your Order Reference</div>
          <div className="chk-success-ref-value">{orderRef}</div>
          <p className="chk-success-ref-note">
            Please save this reference for future communication.
          </p>
        </div>
      )}
    </>
  );
}

export default function SuccessPage() {
  useEffect(() => {
    localStorage.removeItem('serviceQuoteCart');
    localStorage.removeItem('quoteFormData');
    const event = new CustomEvent('cartCleared');
    window.dispatchEvent(event);
  }, []);

  return (
    <div className="chk-page">
      <div className="chk-success">
        <div className="chk-success-container">
          <div className="chk-success-card">
            <div className="chk-success-icon">
              <i className="fas fa-check"></i>
            </div>

            <h1 className="chk-success-title">Order Submitted Successfully!</h1>
            <p className="chk-success-message">
              Your order has been received. Our team will review your requirements and contact you within 24 hours.
            </p>

            <Suspense fallback={
              <div className="chk-success-ref">
                <div className="chk-success-ref-label">Loading order reference...</div>
              </div>
            }>
              <SuccessContent />
            </Suspense>

            <div className="chk-success-steps">
              <div className="chk-success-step">
                <div className="chk-success-step-num">1</div>
                <div className="chk-success-step-content">
                  <h4>Initial Review</h4>
                  <p>Our team will review your requirements within 24 hours</p>
                </div>
              </div>

              <div className="chk-success-step">
                <div className="chk-success-step-num">2</div>
                <div className="chk-success-step-content">
                  <h4>Schedule Consultation</h4>
                  <p>We&apos;ll contact you to schedule a detailed consultation call</p>
                </div>
              </div>

              <div className="chk-success-step">
                <div className="chk-success-step-num">3</div>
                <div className="chk-success-step-content">
                  <h4>Receive Custom Quote</h4>
                  <p>You&apos;ll receive a detailed quote and proposal</p>
                </div>
              </div>
            </div>

            <div className="chk-success-actions">
              <Link href="/dashboard" className="chk-success-btn chk-success-btn-secondary">
                <i className="fas fa-home"></i>
                View Your Dashboard
              </Link>
              <Link href="/services" className="chk-success-btn chk-success-btn-primary">
                <i className="fas fa-briefcase"></i>
                Browse More Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}