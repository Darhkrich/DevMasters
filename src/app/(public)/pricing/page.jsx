'use client';

import "./pricing.css";

import { useState, useEffect } from 'react';
import BuilderSection from './BuilderSection';
import { pricingData } from '@/data/pricing';
import AddToQuoteButton from '@/components/common/AddToQuoteButton';


export default function PricingPage() {
  // State for category tabs
  const [activeCategory, setActiveCategory] = useState('websites');
  
  // State for website type toggle
  const [websiteType, setWebsiteType] = useState('ready');
  
  // State for billing mode
  const [billingMode, setBillingMode] = useState('one-time');
  
  // State for selected package
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  // State for notification
  const [notification, setNotification] = useState({ visible: false, message: '' });

  // Handle package selection
  const handlePackageSelect = (pkg) => {
    const packageData = {
      ...pkg,
      price: billingMode === 'monthly' ? pkg.billingMonthly : pkg.billingOneTime,
      billingMode
    };
    
    setSelectedPackage(packageData);
    handlePackageSelection(packageData.id, packageData);
  };

  // Handle package selection (with notification)
  const handlePackageSelection = (packageId, data) => {
    // Update selected package summary
    const badge = data.badge ? ` • ${data.badge}` : '';
    
    // Save to localStorage (simulating dashboard integration)
    const existing = JSON.parse(localStorage.getItem('wc_selected_packages') || '[]');
    const index = existing.findIndex(pkg => pkg.id === packageId);
    if (index !== -1) {
      existing[index] = data;
    } else {
      existing.push(data);
    }
    localStorage.setItem('wc_selected_packages', JSON.stringify(existing));
    
    // Show notification
    setNotification({
      visible: true,
      message: `✅ "${data.title}" has been added to your client dashboard.`
    });
    
    // Auto-hide notification
    setTimeout(() => {
      setNotification({ visible: false, message: '' });
    }, 7000);
  };

  // Go to client dashboard
  const goToCheckout = () => {
    // In a real application, this would navigate to the dashboard
    window.location.href = '/dashboard';
  };

  // Helper function to capitalize
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Log initial layout/CSS state when pricing page mounts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bodyStyle = window.getComputedStyle(document.body);
    const bodyOpacity = bodyStyle.opacity;

    const servicesEl = document.querySelector('.sp5__wc-services-page');
    const servicesOpacity = servicesEl
      ? window.getComputedStyle(servicesEl).opacity
      : null;

    // Console-based instrumentation for pricing page mount
    // #region agent log console
    console.log('[DEBUG H1-H3] pricing CSS/state snapshot', {
      bodyOpacity,
      servicesOpacity,
      activeCategory,
      websiteType,
      billingMode,
    });
    // #endregion agent log console

    // #region agent log
    fetch('http://127.0.0.1:7654/ingest/d12143fe-693e-4703-9454-994924290ead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '3fb90f',
      },
      body: JSON.stringify({
        sessionId: '3fb90f',
        runId: 'initial',
        hypothesisId: 'H1-H3',
        location: 'app/(public)/pricing/page.jsx:83',
        message: 'Pricing page mounted - CSS and state snapshot',
        data: {
          bodyOpacity,
          servicesOpacity,
          activeCategory,
          websiteType,
          billingMode,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
  }, []);  

  return (
    <main className="sp5__wc-services-page sp5__wc-pricing-page">
      {/* Notification message */}
      <div 
        id="packageNotification" 
        className={`sp5__wc-package-notification ${notification.visible ? 'sp5__wc-package-notification--visible' : ''}`} 
        aria-live="polite"
      >
        {notification.message && (
          <>
            <span>{notification.message}</span>
            <br/>
            <span>Go to your <a href="/Checkout">client dashboard</a> to check it out.</span>
          </>
        )}
      </div>

      {/* HERO */}
      <section className="sp5__wc-services-hero sp5__wc-pricing-hero">

        <div className="sp5__wc-services-hero-text">
          <span className="sp5__wc-pill">
            <i className="fas fa-tags" style={{ fontSize: '0.8rem' }}></i>
            Transparent pricing
          </span>
          <h1>Pricing that grows with your ideas.</h1>
          <p>
            Choose a ready-made package or build your own mix of websites, apps and AI automation. 
            We keep everything simple, clear and scalable.
          </p>

        </div>

        <div className="sp5__wc-services-hero-demo">
         
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section className="sp5__wc-pricing-categories">
        <div className="sp5__wc-pricing-tabs" id="pricingTabs">
          <button
            className={`sp5__wc-pricing-tab ${activeCategory === 'websites' ? 'sp5__wc-pricing-tab--active' : ''}`}
            onClick={() => setActiveCategory('websites')}
          >
            <i className="fas fa-globe"></i> Websites
          </button>
          <button
            className={`sp5__wc-pricing-tab ${activeCategory === 'apps' ? 'sp5__wc-pricing-tab--active' : ''}`}
            onClick={() => setActiveCategory('apps')}
          >
            <i className="fas fa-mobile-alt"></i> Web & Mobile Apps
          </button>
          <button
            className={`sp5__wc-pricing-tab ${activeCategory === 'ai' ? 'sp5__wc-pricing-tab--active' : ''}`}
            onClick={() => setActiveCategory('ai')}
          >
            <i className="fas fa-robot"></i> AI Automations
          </button>
        </div>
      </section>

      
          <div className="sp5__wc-pricing-toggle">
            <span className="sp5__wc-toggle-label">Billing</span>
            <div className="sp5__wc-pricing-toggle-inner" id="billingToggle">
              <button
                className={`sp5__wc-toggle-option ${billingMode === 'one-time' ? 'sp5__wc-toggle-option--active' : ''}`}
                onClick={() => setBillingMode('one-time')}
              >
                One-time setup
              </button>
              <button
                className={`sp5__wc-toggle-option ${billingMode === 'monthly' ? 'sp5__wc-toggle-option--active' : ''}`}
                onClick={() => setBillingMode('monthly')}
              >
                Monthly plan
              </button>
            </div>
            <span className="sp5__wc-toggle-hint">
              Monthly option for ongoing maintenance & support.
            </span>
          </div>

      {/* PRICING SECTIONS */}

      {/* WEBSITES: Ready-made & Customizable */}
      <section className={`sp5__wc-pricing-section ${activeCategory === 'websites' ? 'sp5__wc-pricing-section--active' : ''}`} data-section="websites">
        <header className="sp5__wc-service-section-header">
          <div>
            <h2>Website Packages</h2>
            <p>
              Launch fast with ready-made templates or go flexible with customizable websites. 
              All include hosting setup, security and support.
            </p>
          </div>
          <div className="sp5__wc-section-badge">Websites & Landing Pages</div>
        </header>

        {/* Website type toggle */}
        <div className="sp5__wc-pricing-subtoggle" id="websiteTypeToggle">
          <button
            className={`sp5__wc-subtoggle-option ${websiteType === 'ready' ? 'sp5__wc-subtoggle-option--active' : ''}`}
            onClick={() => setWebsiteType('ready')}
          >
            Ready-made templates
          </button>
          <button
            className={`sp5__wc-subtoggle-option ${websiteType === 'custom' ? 'sp5__wc-subtoggle-option--active' : ''}`}
            onClick={() => setWebsiteType('custom')}
          >
            Customizable websites
          </button>
        </div>

        {/* Ready-made templates pricing cards */}
        <div className={`sp5__wc-pricing-grid sp5__wc-pricing-grid--web ${websiteType === 'ready' ? 'sp5__wc-pricing-grid--visible' : ''}`} data-webtype="ready">
          {pricingData.websites.ready.map((pkg) => (
            <article
              key={pkg.id}
              className={`sp5__wc-pricing-card ${pkg.popular ? 'sp5__wc-pricing-card--highlight' : ''}`}
              data-package-id={pkg.id}
            >
              <div className="sp5__wc-pricing-tag">
                {pkg.tier === 'pro' ? 'Pro Business' : pkg.tier === 'ecommerce-plus' ? 'E-commerce Plus' : 'Starter Essential'}
              </div>
              {pkg.popular && <div className="sp5__wc-pricing-popular">Most popular</div>}
              <h3>{pkg.title}</h3>
              <p className="sp5__wc-pricing-subtitle">{pkg.subtitle}</p>

              <div className="sp5__wc-pricing-price">
                <span className="sp5__wc-price-main">
                  <span className="sp5__wc-price-currency">$</span>
                  <span className="sp5__wc-price-value">
                    {billingMode === 'monthly' ? pkg.billingMonthly : pkg.billingOneTime}
                  </span>
                </span>
                <span className="sp5__wc-price-note">
                  {billingMode === 'monthly' ? 'Monthly • Maintenance & support plan' : 'One-time setup • Main build included'}
                </span>
              </div>

              <ul className="sp5__wc-pricing-features">
                {pkg.features.map((feature, index) => (
                  <li key={index}><i className="fas fa-check"></i> {feature}</li>
                ))}
              </ul>

           
              
{/* FIXED: Changed 'service' to 'template' and 'source' to 'templates' */}
            <AddToQuoteButton 
              item={pkg} 
              source="templates" 
              className="sp5__wc-btn-ghost sp5__wc-btn-customize"
            />

              {pkg.footnote && <div className="sp5__wc-pricing-footnote">{pkg.footnote}</div>}
            </article>
          ))}
        </div>

        {/* Customizable websites pricing cards */}
        <div className={`sp5__wc-pricing-grid sp5__wc-pricing-grid--web ${websiteType === 'custom' ? 'sp5__wc-pricing-grid--visible' : ''}`} data-webtype="custom">
          {pricingData.websites.custom.map((pkg) => (
            <article
              key={pkg.id}
              className={`sp5__wc-pricing-card ${pkg.popular || pkg.bestValue ? 'sp5__wc-pricing-card--highlight' : ''}`}
              data-package-id={pkg.id}
            >
              <div className="sp5__wc-pricing-tag">
                {pkg.tier === 'pro' ? 'Pro Business' : pkg.tier === 'ecommerce-plus' ? 'E-commerce Plus' : 'Starter Essential'}
              </div>
              {pkg.popular && <div className="sp5__wc-pricing-popular">Most popular</div>}
              {pkg.bestValue && <div className="sp5__wc-pricing-popular">Best value</div>}
              <h3>{pkg.title}</h3>
              <p className="sp5__wc-pricing-subtitle">{pkg.subtitle}</p>

              <div className="sp5__wc-pricing-price">
                <span className="sp5__wc-price-main">
                  <span className="sp5__wc-price-currency">$</span>
                  <span className="sp5__wc-price-value">
                    {billingMode === 'monthly' ? pkg.billingMonthly : pkg.billingOneTime}
                  </span>
                </span>
                <span className="sp5__wc-price-note">
                  {billingMode === 'monthly' ? 'Monthly • Maintenance & support plan' : 'One-time setup • Main build included'}
                </span>
              </div>

              <ul className="sp5__wc-pricing-features">
                {pkg.features.map((feature, index) => (
                  <li key={index}><i className="fas fa-check"></i> {feature}</li>
                ))}
              </ul>


              {/* FIXED: Changed 'service' to 'template' and 'source' to 'templates' */}
            <AddToQuoteButton 
              item={pkg} 
              source="templates" 
              className="sp5__wc-btn-ghost sp5__wc-btn-customize"
              onClick={() => handlePackageSelect(pkg)}
            />

              {pkg.footnote && <div className="sp5__wc-pricing-footnote">{pkg.footnote}</div>}
            </article>



          ))}
        </div>
      </section>

      {/* APPS section */}
      <section className={`sp5__wc-pricing-section ${activeCategory === 'apps' ? 'sp5__wc-pricing-section--active' : ''}`} data-section="apps">
        <header className="sp5__wc-service-section-header">
          <div>
            <h2>Web & Mobile App Packages</h2>
            <p>
              From simple MVPs to full dashboards and client portals, choose the app package that matches your idea.
            </p>
          </div>
          <div className="sp5__wc-section-badge">Apps & Dashboards</div>
        </header>

        <div className="sp5__wc-pricing-grid">
          {pricingData.apps.map((pkg) => (
            <article
              key={pkg.id}
              className={`sp5__wc-pricing-card ${pkg.popular ? 'sp5__wc-pricing-card--highlight' : ''}`}
              data-package-id={pkg.id}
            >
              <div className="sp5__wc-pricing-tag">
                {pkg.tier === 'pro' ? 'Pro Business' : pkg.tier === 'ecommerce-plus' ? 'Scale Plus' : 'Starter Essential'}
              </div>
              {pkg.popular && <div className="sp5__wc-pricing-popular">Popular</div>}
              <h3>{pkg.title}</h3>
              <p className="sp5__wc-pricing-subtitle">{pkg.subtitle}</p>

              <div className="sp5__wc-pricing-price">
                <span className="sp5__wc-price-main">
                  <span className="sp5__wc-price-currency">$</span>
                  <span className="sp5__wc-price-value">
                    {billingMode === 'monthly' ? pkg.billingMonthly : pkg.billingOneTime}
                  </span>
                </span>
                <span className="sp5__wc-price-note">
                  {billingMode === 'monthly' ? 'Monthly • Maintenance & support plan' : 'One-time • Core app'}
                </span>
              </div>

              <ul className="sp5__wc-pricing-features">
                {pkg.features.map((feature, index) => (
                  <li key={index}><i className="fas fa-check"></i> {feature}</li>
                ))}
              </ul>

             

              
{/* FIXED: Changed 'service' to 'template' and 'source' to 'templates' */}
            <AddToQuoteButton 
              item={pkg} 
              source="templates" 
              className="sp5__wc-btn-ghost sp5__wc-btn-customize"
            />
            </article>
          ))}
        </div>
      </section>

      {/* AI section */}
      <section className={`sp5__wc-pricing-section ${activeCategory === 'ai' ? 'sp5__wc-pricing-section--active' : ''}`} data-section="ai">
        <header className="sp5__wc-service-section-header">
          <div>
            <h2>AI Automation Packages</h2>
            <p>
              Connect your website, apps and tools to smart automations that save time and close more deals.
            </p>
          </div>
          <div className="sp5__wc-section-badge">AI & Workflows</div>
        </header>

        <div className="sp5__wc-pricing-grid">
          {pricingData.ai.map((pkg) => (
            <article
              key={pkg.id}
              className={`sp5__wc-pricing-card ${pkg.popular ? 'sp5__wc-pricing-card--highlight' : ''}`}
              data-package-id={pkg.id}
            >
              <div className="sp5__wc-pricing-tag">
                {pkg.tier === 'pro' ? 'Pro Business' : pkg.tier === 'ecommerce-plus' ? 'E-commerce Plus' : 'Starter Essential'}
              </div>
              {pkg.popular && <div className="sp5__wc-pricing-popular">Popular</div>}
              <h3>{pkg.title}</h3>
              <p className="sp5__wc-pricing-subtitle">{pkg.subtitle}</p>

              <div className="sp5__wc-pricing-price">
                <span className="sp5__wc-price-main">
                  <span className="sp5__wc-price-currency">$</span>
                  <span className="sp5__wc-price-value">
                    {billingMode === 'monthly' ? pkg.billingMonthly : pkg.billingOneTime}
                  </span>
                </span>
                <span className="sp5__wc-price-note">
                  {billingMode === 'monthly' ? 'Monthly • Maintenance & support plan' : 'One-time • Setup & handover'}
                </span>
              </div>

              <ul className="sp5__wc-pricing-features">
                {pkg.features.map((feature, index) => (
                  <li key={index}><i className="fas fa-check"></i> {feature}</li>
                ))}
              </ul>

             
{/* FIXED: Changed 'service' to 'template' and 'source' to 'templates' */}
            <AddToQuoteButton 
              item={pkg} 
              source="templates" 
              className="sp5__wc-btn-ghost sp5__wc-btn-customize"
            />


            </article>
          ))}
        </div>
      </section>

      {/* BUILDER SECTION - Separate Component */}
      <BuilderSection 
        onPackageSelect={handlePackageSelection}
        onDashboardNavigate={goToCheckout}
      />
    </main>
  );
}