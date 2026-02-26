"use client";
import "./services.css";
import { useState, useMemo } from "react";
import Link from 'next/link';
import { aiAutomations, aiBundles, sectors } from "@/data/aiAutomations";

export default function AIAutomationPage() {
  const [activeSector, setActiveSector] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter automations based on sector and search
  const filteredAutomations = useMemo(() => {
    return aiAutomations.filter(automation => {
      const matchesSector = activeSector === "all" || automation.sector === activeSector;
      const matchesSearch = 
        searchQuery === "" || 
        automation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        automation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        automation.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSector && matchesSearch;
    });
  }, [activeSector, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <main className="sp2__wc-services-page sp2__wc-ai-page">

      {/* HERO */}
      <section className="sp2__wc-services-hero sp2__wc-ai-hero">
        <div className="sp2__wc-services-hero-text">
          <span className="sp2__wc-pill">
            <i className="fas fa-robot" /> AI Automation
          </span>
          <h1>Automate your workflows, not your customers.</h1>
          <p>
            We build AI automations for businesses — from chatbots and lead
            qualification to email workflows and internal tools.
          </p>
        </div>

        <div className="sp2__wc-services-hero-demo">
          <div className="sp2__wc-hero-demo-card sp2__wc-ai-hero-card">
            <div className="sp2__wc-hero-label">Automation Flow Preview</div>

            <div className="sp2__wc-hero-window">
              <div className="sp2__wc-hero-window-header">
                <span /><span /><span />
              </div>
              <div className="sp2__wc-hero-window-body">
                <p>A customer message triggers smart actions:</p>
                <div className="sp2__wc-demo-automation">
                  <div className="sp2__wc-demo-bubble sp2__wc-demo-bubble--user">
                    "Hi, I want a website for my shop."
                  </div>
                  <div className="sp2__wc-demo-bubble sp2__wc-demo-bubble--bot">
                    "Great! What type of products do you sell?"
                  </div>
                  <div className="sp2__wc-demo-bubble sp2__wc-demo-bubble--system">
                    Lead created · Email sent · Task assigned
                  </div>
                </div>
              </div>
            </div>

            <Link href="/contact" className="sp2__wc-btn-primary">
              Book AI Automation Call
            </Link>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <section className="sp2__wc-ai-controls">
        <div className="sp2__wc-ai-search">
          <div className="sp2__wc-input-chip">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search automations (e.g. 'chatbot', 'email', 'scheduling')"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="sp2__wc-ai-filters">
          <div className="sp2__wc-ai-filters-header">
            <h2>Browse AI automations by sector</h2>
            <p>Pick your industry to see what we can automate.</p>
          </div>

          <div className="sp2__wc-ai-filter-chips">
            {sectors.map(sector => (
              <button
                key={sector.id}
                className={`sp2__wc-ai-chip ${
                  activeSector === sector.id ? "sp2__wc-ai-chip--active" : ""
                }`}
                onClick={() => setActiveSector(sector.id)}
              >
                {sector.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AUTOMATIONS GRID */}
      <section className="sp2__wc-service-section sp2__wc-ai-section">
        <header className="sp2__wc-service-section-header">
          <div>
            <h2>AI Automation Solutions</h2>
            <p>
              Choose from our pre-built AI automations or request a custom solution.
              Each automation includes setup, training, and ongoing support.
            </p>
          </div>
          <div className="sp2__wc-section-badge">No-code setup available</div>
        </header>

        <div className="sp2__wc-ai-automations-grid">
          {filteredAutomations.map(automation => (
            <article key={automation.id} className="sp2__wc-ai-automation-card">
              <div className="sp2__wc-ai-automation-header">
                <div className="sp2__wc-ai-automation-icon">
                  <i className={automation.icon}></i>
                </div>
                <div className="sp2__wc-ai-automation-badge">
                  <span className={`sp2__wc-sector-badge sp2__wc-sector-${automation.sector}`}>
                    {automation.sector.replace("-", " ")}
                  </span>
                </div>
              </div>
              
              <div className="sp2__wc-ai-automation-body">
                <h3>{automation.title}</h3>
                <p>{automation.description}</p>
                
                <div className="sp2__wc-ai-automation-features">
                  <h4>Key Features:</h4>
                  <ul>
                    {automation.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check-circle" /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="sp2__wc-ai-automation-meta">
                  <div className="sp2__wc-ai-automation-price">
                    <span className="sp2__wc-price-main">{automation.price}</span>
                    <span className="sp2__wc-price-note">{automation.priceNote}</span>
                  </div>
                  <div className="sp2__wc-ai-automation-delivery">
                    <i className="fas fa-clock"></i>
                    <span>{automation.deliveryTime} setup</span>
                  </div>
                </div>
              </div>
              
              <div className="sp2__wc-ai-automation-footer">
                <div className="sp2__wc-ai-automation-actions">
                  <Link 
                    href={`/services/ai-automation/${automation.id}`}
                    className="sp2__wc-btn-primary sp2__wc-btn-view-details"
                  >
                    <i className="fas fa-eye"></i> View Details
                  </Link>
                  <Link 
                    href={`/contact?automation=${automation.id}`}
                    className="sp2__wc-btn-ghost sp2__wc-btn-customize"
                  >
                    <i className="fas fa-cog"></i> Customize
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredAutomations.length === 0 && (
          <div className="sp2__wc-ai-empty-state">
            <div className="sp2__wc-ai-empty-inner">
              <i className="fas fa-search"></i>
              <h3>No automations found for "{searchQuery}"</h3>
              <p>
                Can't find what you're looking for? We can build a custom AI automation
                specifically for your business needs.
              </p>
              <Link href="/contact" className="sp2__wc-btn-primary">
                Request Custom Automation
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* READY-MADE BUNDLES */}
      <section className="sp2__wc-service-section sp2__wc-ai-bundles-section">
        <header className="sp2__wc-service-section-header">
          <div>
            <h2>Ready-Made AI Automation Bundles</h2>
            <p>Complete solutions for specific business needs. Fast setup, proven results.</p>
          </div>
        </header>

        <div className="sp2__wc-ai-bundles-grid">
          {aiBundles.map(bundle => (
            <article key={bundle.id} className="sp2__wc-ai-bundle-card">
              <div className="sp2__wc-ai-bundle-header">
                <div className="sp2__wc-ai-bundle-tag">{bundle.tag}</div>
                <h3>{bundle.title}</h3>
                <p>{bundle.description}</p>
              </div>
              
              <div className="sp2__wc-ai-bundle-body">
                <div className="sp2__wc-ai-bundle-includes">
                  <h4>Includes:</h4>
                  <ul>
                    {bundle.items.slice(0, 4).map((item, index) => (
                      <li key={index}>
                        <i className="fas fa-check" /> {item}
                      </li>
                    ))}
                    {bundle.items.length > 4 && (
                      <li className="sp2__wc-ai-bundle-more">
                        <i className="fas fa-plus" /> +{bundle.items.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="sp2__wc-ai-bundle-features">
                  <div className="sp2__wc-ai-bundle-feature">
                    <i className="fas fa-rocket"></i>
                    <span>{bundle.deliveryTime} setup</span>
                  </div>
                  <div className="sp2__wc-ai-bundle-feature">
                    <i className="fas fa-chart-line"></i>
                    <span>Proven results</span>
                  </div>
                </div>
              </div>
              
              <div className="sp2__wc-ai-bundle-footer">
                <div className="sp2__wc-ai-bundle-pricing">
                  <div className="sp2__wc-ai-bundle-price">
                    <span className="sp2__wc-price-main">{bundle.price}</span>
                    <span className="sp2__wc-price-note">{bundle.priceNote}</span>
                  </div>
                  <Link 
                    href={`/services/ai-automation/bundle/${bundle.id}`}
                    className="sp2__wc-btn-primary sp2__wc-btn-bundle"
                  >
                    View Bundle Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="sp2__wc-ai-cta">
        <div className="sp2__wc-ai-cta-card">
          <h2>Need a Custom AI Solution?</h2>
          <p>
            Tell us about your business challenges, and we'll design a custom AI automation
            that saves you time and money.
          </p>
          <div className="sp2__wc-ai-cta" >
            <div className="sp2__wc-ai-cta-buttons">
              <Link href="/contact" className="sp2__wc-btn-primary sp2__wc-btn-cta-primary">
                <i className="sp2__cta-primary">
                  <i className="fas fa-calendar"></i> Schedule Consultation
                </i>
              </Link>
              <Link href="/services/ai-autom/ai-automation/custom" className="sp2__wc-btn-ghost sp2__wc-btn clas">
                <i className="fas fa-lightbulb"></i> Learn About Custom Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}