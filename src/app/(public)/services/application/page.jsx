"use client";

import { useState } from "react";
import Link from "next/link";
import { getServicesByType, getServicesByCategory } from "@/data/app-services";
import "./services.css";
import "@/styles/apps.css";
import AddToQuoteButton from '@/components/common/AddToQuoteButton';

// Service Card Component
function ServiceCard({ service }) {
  return (
    <div className="sp4__service-card sp4__wc-accent-left">
      <div className="sp4__service-card-header">
        <i className={service.icon}></i>
        {service.tag && <span className="sp4__service-tag">{service.tag}</span>}
      </div>
      <div className="sp4__service-card-body">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <ul className="sp4__wc-service-meta">
          {service.meta?.map((m, i) => (
            <li key={i}>
              <i className={m.icon}></i> {m.text}
            </li>
          ))}
        </ul>
        
      </div>
      <div className="sp4__service-card-actions">
        <Link href={`/services/application/${service.id}`} className="sp4__wc-btn-secondary">
          View Details
        </Link>
        <AddToQuoteButton 
          item={service} 
          source="templates" 
          className="sp4__wc-btn-secondary sp4__wc-btn-large"
        />
      </div>
    </div>
  );
}

// Blueprint Card Component
function BlueprintCard({ blueprint }) {
  return (
    <article className="sp4__wc-apps-bundle">
      <div className={`sp4__wc-apps-bundle-tag ${blueprint.tag === 'Popular' ? 'sp4__wc-apps-bundle-tag--accent' : ''}`}>
        {blueprint.tag}
      </div>
      <h3>{blueprint.title}</h3>
      <p>{blueprint.description}</p>
      <ul className="sp4__wc-apps-bundle-list">
        {blueprint.features?.map((f, i) => (
          <li key={i}>
            <i className="fas fa-check-circle"></i> {f}
          </li>
        ))}
      </ul>
      <div className="sp4__blueprint-price">${blueprint.price?.toLocaleString()}</div>
      <div className="sp4__blueprint-actions">
        <Link href={`/services/application/${blueprint.id}`} className="sp4__wc-btn-secondary">
          View Blueprint
        </Link>
        <AddToQuoteButton 
          item={blueprint} 
          source="templates" 
          className="sp4__wc-btn-secondary sp4__wc-btn-large"
        />
      </div>
    </article>
  );
}

// Main Page Component
export default function AppsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredServices = getServicesByType(activeFilter);
  const blueprints = getServicesByCategory('blueprint');

  return (
    <main className="sp4__wc-services-page sp4__wc-apps-page">

      {/* Hero Section */}
      <section className="sp4__wc-services-hero sp4__wc-apps-hero">
        <div className="sp4__wc-services-hero-text">
          <span className="sp4__wc-pill">
            <i className="fas fa-mobile-alt"></i>
            Web & Mobile Apps
          </span>
          <h1>Apps that feel premium on every device.</h1>
          <p>
            We design and build fast, modern web and mobile apps that look and feel like 
            native iOS experiences. From MVPs to full products, we handle design, 
            development and launch.
          </p>
        </div>

        <div className="sp4__wc-services-hero-demo">
          <div className="sp4__wc-hero-demo-card sp4__wc-apps-hero-card">
            <Link href={"/contact"}>
              <button className="sp4__wc-btn-primary">Free Consultation</button>
            </Link>
          </div>
        </div>
      </section>

      {/* FILTER CHIPS */}
      <section className="sp4__wc-apps-filters">
        <div className="sp4__wc-apps-filter-chips">
          {["all", "web", "mobile", "fullstack", "saas"].map((type) => (
            <button
              key={type}
              className={`sp4__wc-apps-chip ${activeFilter === type ? "sp4__wc-apps-chip--active" : ""}`}
              onClick={() => setActiveFilter(type)}
            >
              {type === "all" ? "All Services" : type}
            </button>
          ))}
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="sp4__wc-service-section">
        <div className="sp4__wc-service-cards sp4__wc-apps-cards">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <aside className="sp4__wc-service-demo sp4__wc-apps-demo">
        <h3>App Flow Preview</h3>
        <p>
          A quick visual of how users move through a typical app that we design: from 
          onboarding to dashboard and settings.
        </p>

        <div className="sp4__wc-demo-window sp4__wc-apps-demo-window">
          <div className="sp4__wc-demo-window-header">
            <span></span><span></span><span></span>
          </div>
          <div className="sp4__wc-demo-window-body sp4__wc-demo-window-body--plain">
            <div className="sp4__wc-apps-flow">
              <div className="sp4__wc-apps-flow-step">
                <span className="sp4__wc-apps-step-label">1 · Onboarding</span>
                <div className="sp4__wc-apps-step-card">
                  Simple welcome screens that explain your product and collect 
                  basic info without overwhelming users.
                </div>
              </div>
              <div className="sp4__wc-apps-flow-step">
                <span className="sp4__wc-apps-step-label">2 · Main Experience</span>
                <div className="sp4__wc-apps-step-card sp4__wc-apps-step-card--accent">
                  Clean layout, clear actions, and a design system that stays consistent 
                  across web and mobile.
                </div>
              </div>
              <div className="sp4__wc-apps-flow-step">
                <span className="sp4__wc-apps-step-label">3 · Settings & Profiles</span>
                <div className="sp4__wc-apps-step-card">
                  Profile, notifications, themes and more — organized so users don’t get lost.
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="sp4__wc-btn-ghost">Talk about your next app</button>
      </aside>

    </main>
  );
}