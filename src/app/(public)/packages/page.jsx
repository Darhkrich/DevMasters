'use client';

import "./pricing.css";

import { useEffect, useState } from "react";
import BuilderSection from "./BuilderSection";
import AddToQuoteButton from "@/components/common/AddToQuoteButton";
import { fetchPricingData } from "@/lib/boemApi";
import { pricingData as fallbackPricingData } from "@/data/pricing";

const emptyPricingState = {
  websites: {
    ready: [],
    custom: [],
  },
  apps: [],
  ai: [],
};

function getTierLabel(tier) {
  if (tier === "pro") {
    return "Pro Business";
  }
  if (tier === "ecommerce-plus") {
    return "E-commerce Plus";
  }
  return "Starter Essential";
}

export default function PricingPage() {
  const [activeCategory, setActiveCategory] = useState("websites");
  const [websiteType, setWebsiteType] = useState("ready");
  const [billingMode, setBillingMode] = useState("one-time");
  const [pricingData, setPricingData] = useState(emptyPricingState);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadPricing = async () => {
      try {
        const data = await fetchPricingData();
        if (!isMounted) return;
        // Ensure the response has the expected structure; fallback to empty arrays if missing
        setPricingData({
          websites: {
            ready: data.websites?.ready || [],
            custom: data.websites?.custom || [],
          },
          apps: data.apps || [],
          ai: data.ai || [],
        });
        setDataError("");
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load pricing from API", error);
        // Fallback to local mockup data
        setPricingData(fallbackPricingData);
        setDataError("Live pricing could not be loaded, so local pricing data is being shown.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPricing();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleItemAdded = (packageItem) => {
    setNotification({
      visible: true,
      message: `"${packageItem.title}" has been added to your quote request.`,
    });

    window.setTimeout(() => {
      setNotification({
        visible: false,
        message: "",
      });
    }, 5000);
  };

  const goToCheckout = () => {
    window.location.href = "/Checkout";
  };

  const renderPricingCard = (pkg) => {
    const oneTimePrice = pkg.billing_one_time || "Custom";
    const monthlyPrice = pkg.billing_monthly || "Custom";

    return (
      <article
        key={pkg.id}
        className={`sp5__wc-pricing-card ${
          pkg.popular || pkg.best_value ? "sp5__wc-pricing-card--highlight" : ""
        }`}
        data-package-id={pkg.id}
      >
        <div className="sp5__wc-pricing-tag">{getTierLabel(pkg.tier)}</div>
        {pkg.popular && <div className="sp5__wc-pricing-popular">Most popular</div>}
        {pkg.best_value && <div className="sp5__wc-pricing-popular">Best value</div>}
        <h3>{pkg.title}</h3>
        <p className="sp5__wc-pricing-subtitle">{pkg.subtitle}</p>

        <div className="sp5__wc-pricing-price">
          <span className="sp5__wc-price-main">
            <span className="sp5__wc-price-currency"> Starting from $</span>
            <span className="sp5__wc-price-value">
              {billingMode === "monthly" ? monthlyPrice : oneTimePrice}
            </span>
          </span>
          <span className="sp5__wc-price-note">
            {billingMode === "monthly"
              ? "Monthly • Maintenance & support plan"
              : "One-time setup • Main build included"}
          </span>
        </div>

        <ul className="sp5__wc-pricing-features">
          {(pkg.features || []).map((feature, index) => (
            <li key={index}>
              <i className="fas fa-check"></i> {feature}
            </li>
          ))}
        </ul>

        <AddToQuoteButton
          item={pkg}
          source="pricingData"
          className="sp5__wc-btn-ghost sp5__wc-btn-customize"
          onAdded={handleItemAdded}
        />

        {pkg.footnote && (
          <div className="sp5__wc-pricing-footnote">{pkg.footnote}</div>
        )}
      </article>
    );
  };

  return (
    <main className="sp5__wc-services-page sp5__wc-pricing-page">
      <div
        id="packageNotification"
        className={`sp5__wc-package-notification ${
          notification.visible ? "sp5__wc-package-notification--visible" : ""
        }`}
        aria-live="polite"
      >
        {notification.message && (
          <>
            <span>{notification.message}</span>
            <br />
            <span>
              Continue to your <a href="/Checkout">quote checkout</a> when you&apos;re ready.
            </span>
          </>
        )}
      </div>

      <section className="sp5__wc-services-hero sp5__wc-pricing-hero">
        <div className="sp5__wc-services-hero-text">
          <span className="sp5__wc-pill">
            <i className="fas fa-tags" style={{ fontSize: "0.8rem" }}></i>
            Transparent pricing
          </span>
          <h1>Packages that grows with your ideas.</h1>
          <p>
            Choose a ready-made package or build your own mix of websites, apps and AI automation.
            We keep everything simple, clear and scalable.
          </p>
          {dataError && <p className="sp5__wc-toggle-hint">{dataError}</p>}
        </div>

        <div className="sp5__wc-services-hero-demo"></div>
      </section>

      <section className="sp5__wc-pricing-categories">
        <div className="sp5__wc-pricing-tabs" id="pricingTabs">
          <button
            className={`sp5__wc-pricing-tab ${
              activeCategory === "websites" ? "sp5__wc-pricing-tab--active" : ""
            }`}
            onClick={() => setActiveCategory("websites")}
          >
            <i className="fas fa-globe"></i> Websites
          </button>
          <button
            className={`sp5__wc-pricing-tab ${
              activeCategory === "apps" ? "sp5__wc-pricing-tab--active" : ""
            }`}
            onClick={() => setActiveCategory("apps")}
          >
            <i className="fas fa-mobile-alt"></i> Web & Mobile Apps
          </button>
          <button
            className={`sp5__wc-pricing-tab ${
              activeCategory === "ai" ? "sp5__wc-pricing-tab--active" : ""
            }`}
            onClick={() => setActiveCategory("ai")}
          >
            <i className="fas fa-robot"></i> AI Automations
          </button>
        </div>
      </section>

      <div className="sp5__wc-pricing-toggle">
        <span className="sp5__wc-toggle-label">Billing</span>
        <div className="sp5__wc-pricing-toggle-inner" id="billingToggle">
          <button
            className={`sp5__wc-toggle-option ${
              billingMode === "one-time" ? "sp5__wc-toggle-option--active" : ""
            }`}
            onClick={() => setBillingMode("one-time")}
          >
            One-time setup
          </button>
          <button
            className={`sp5__wc-toggle-option ${
              billingMode === "monthly" ? "sp5__wc-toggle-option--active" : ""
            }`}
            onClick={() => setBillingMode("monthly")}
          >
            Monthly plan
          </button>
        </div>
        <span className="sp5__wc-toggle-hint">
          Monthly option for ongoing maintenance & support.
        </span>
      </div>

      <section
        className={`sp5__wc-pricing-section ${
          activeCategory === "websites" ? "sp5__wc-pricing-section--active" : ""
        }`}
        data-section="websites"
      >
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

        <div className="sp5__wc-pricing-subtoggle" id="websiteTypeToggle">
          <button
            className={`sp5__wc-subtoggle-option ${
              websiteType === "ready" ? "sp5__wc-subtoggle-option--active" : ""
            }`}
            onClick={() => setWebsiteType("ready")}
          >
            Ready-made templates
          </button>
          <button
            className={`sp5__wc-subtoggle-option ${
              websiteType === "custom" ? "sp5__wc-subtoggle-option--active" : ""
            }`}
            onClick={() => setWebsiteType("custom")}
          >
            Customizable websites
          </button>
        </div>

        <div
          className={`sp5__wc-pricing-grid sp5__wc-pricing-grid--web ${
            websiteType === "ready" ? "sp5__wc-pricing-grid--visible" : ""
          }`}
          data-webtype="ready"
        >
          {pricingData.websites.ready.map(renderPricingCard)}
        </div>

        <div
          className={`sp5__wc-pricing-grid sp5__wc-pricing-grid--web ${
            websiteType === "custom" ? "sp5__wc-pricing-grid--visible" : ""
          }`}
          data-webtype="custom"
        >
          {pricingData.websites.custom.map(renderPricingCard)}
        </div>
      </section>

      <section
        className={`sp5__wc-pricing-section ${
          activeCategory === "apps" ? "sp5__wc-pricing-section--active" : ""
        }`}
        data-section="apps"
      >
        <header className="sp5__wc-service-section-header">
          <div>
            <h2>Web & Mobile App Packages</h2>
            <p>
              From simple MVPs to full dashboards and client portals, choose the app package
              that matches your idea.
            </p>
          </div>
          <div className="sp5__wc-section-badge">Apps & Dashboards</div>
        </header>

        <div className="sp5__wc-pricing-grid">
          {pricingData.apps.map(renderPricingCard)}
        </div>
      </section>

      <section
        className={`sp5__wc-pricing-section ${
          activeCategory === "ai" ? "sp5__wc-pricing-section--active" : ""
        }`}
        data-section="ai"
      >
        <header className="sp5__wc-service-section-header">
          <div>
            <h2>AI Automation Packages</h2>
            <p>
              Connect your website, apps and tools to smart automations that save time and
              close more deals.
            </p>
          </div>
          <div className="sp5__wc-section-badge">AI & Workflows</div>
        </header>

        <div className="sp5__wc-pricing-grid">
          {pricingData.ai.map(renderPricingCard)}
        </div>
      </section>

      {loading && (
        <div className="sp5__wc-toggle-hint" style={{ textAlign: "center", marginTop: "1rem" }}>
          Loading live pricing packages...
        </div>
      )}

      <BuilderSection onDashboardNavigate={goToCheckout} />
    </main>
  );
}