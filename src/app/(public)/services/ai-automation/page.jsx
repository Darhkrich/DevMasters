"use client";

import "./services.css";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AddToQuoteButton from "@/components/common/AddToQuoteButton";
import { fetchAIAutomations, fetchAIBundles } from "@/lib/boemApi";
import { aiAutomations as fallbackAutomations, aiBundles as fallbackBundles, sectors } from "@/data/aiAutomations";

export default function AIAutomationPage() {
  const [activeSector, setActiveSector] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [automations, setAutomations] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const timer = window.setTimeout(async () => {
      try {
        const [automationResults, bundleResults] = await Promise.all([
          fetchAIAutomations({
            search: searchQuery || undefined,
            sector: activeSector === "all" ? undefined : activeSector,
          }),
          fetchAIBundles(),
        ]);

        if (!isMounted) {
          return;
        }

        setAutomations(automationResults);
        setBundles(bundleResults);
        setDataError("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setAutomations(fallbackAutomations);
        setBundles(fallbackBundles);
        setDataError("Live AI service data could not be loaded, so DevMasters is showing local content.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [activeSector, searchQuery]);

  const filteredAutomations = useMemo(() => {
    return automations.filter((automation) => {
      const matchesSector = activeSector === "all" || automation.sector === activeSector;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === "" ||
        automation.title.toLowerCase().includes(query) ||
        automation.description.toLowerCase().includes(query) ||
        (automation.features || []).some((feature) => feature.toLowerCase().includes(query));

      return matchesSector && matchesSearch;
    });
  }, [activeSector, automations, searchQuery]);

  return (
    <main className="sp2__wc-services-page sp2__wc-ai-page">
      <section className="sp2__wc-services-hero sp2__wc-ai-hero">
        <div className="sp2__wc-services-hero-text">
          <span className="sp2__wc-pill">
            <i className="fas fa-robot" /> AI Automation
          </span>
          <h1>Automate your workflows, not your customers.</h1>
          <p>
            We build AI automations for businesses from chatbots and lead qualification to email
            workflows and internal tools.
          </p>
          {dataError && <p>{dataError}</p>}
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
                    &quot;Hi, I want a website for my shop.&quot;
                  </div>
                  <div className="sp2__wc-demo-bubble sp2__wc-demo-bubble--bot">
                    &quot;Great! What type of products do you sell?&quot;
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

      <section className="sp2__wc-ai-controls">
        <div className="sp2__wc-ai-search">
          <div className="sp2__wc-input-chip">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search automations (e.g. 'chatbot', 'email', 'scheduling')"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="sp2__wc-ai-filters">
          <div className="sp2__wc-ai-filters-header">
            <h2>Browse AI automations by sector</h2>
            <p>Pick your industry to see what we can automate.</p>
          </div>

          <div className="sp2__wc-ai-filter-chips">
            {sectors.map((sector) => (
              <button
                key={sector.id}
                className={`sp2__wc-ai-chip ${activeSector === sector.id ? "sp2__wc-ai-chip--active" : ""}`}
                onClick={() => setActiveSector(sector.id)}
              >
                {sector.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="sp2__wc-service-section sp2__wc-ai-section">
        <header className="sp2__wc-service-section-header">
          <div>
            <h2>AI Automation Solutions</h2>
            <p>
              Choose from our pre-built AI automations or request a custom solution. Each
              automation includes setup, training, and ongoing support.
            </p>
          </div>
          <div className="sp2__wc-section-badge">No-code setup available</div>
        </header>

        <div className="sp2__wc-ai-automations-grid">
          {filteredAutomations.map((automation) => (
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
                    {(automation.features || []).slice(0, 3).map((feature, index) => (
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
                  <AddToQuoteButton
                    item={automation}
                    source="aiAutomations"
                    className="sp2__wc-btn-ghost sp2__wc-btn-customize"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && filteredAutomations.length === 0 && (
          <div className="sp2__wc-ai-empty-state">
            <div className="sp2__wc-ai-empty-inner">
              <i className="fas fa-search"></i>
              <h3>No automations found for &quot;{searchQuery}&quot;</h3>
              <p>
                Can&apos;t find what you&apos;re looking for? We can build a custom AI automation
                specifically for your business needs.
              </p>
              <Link href="/contact" className="sp2__wc-btn-primary">
                Request Custom Automation
              </Link>
            </div>
          </div>
        )}

        {loading && <p style={{ textAlign: "center" }}>Loading live AI services...</p>}
      </section>

      <section className="sp2__wc-service-section sp2__wc-ai-bundles-section">
        <header className="sp2__wc-service-section-header">
          <div>
            <h2>Ready-Made AI Automation Bundles</h2>
            <p>Complete solutions for specific business needs. Fast setup, proven results.</p>
          </div>
        </header>

        <div className="sp2__wc-ai-bundles-grid">
          {bundles.map((bundle) => (
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
                    {(bundle.items || []).slice(0, 4).map((item, index) => (
                      <li key={index}>
                        <i className="fas fa-check" /> {item}
                      </li>
                    ))}
                    {(bundle.items || []).length > 4 && (
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
                  <Link href={`/services/ai-automation/${bundle.id}`} className="sp2__wc-btn-primary sp2__wc-btn-bundle">
                    View Bundle Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sp2__wc-ai-cta">
        <div className="sp2__wc-ai-cta-card">
          <h2>Need a Custom AI Solution?</h2>
          <p>
            Tell us about your business challenges, and we&apos;ll design a custom AI automation that
            saves you time and money.
          </p>
          <div className="sp2__wc-ai-cta">
            <div className="sp2__wc-ai-cta-buttons">
              <Link href="/contact" className="sp2__wc-btn-primary sp2__wc-btn-cta-primary">
                <i className="sp2__cta-primary">
                  <i className="fas fa-calendar"></i> Schedule Consultation
                </i>
              </Link>
              <Link href="/services/ai-automation" className="sp2__wc-btn-ghost sp2__wc-btn clas">
                <i className="fas fa-lightbulb"></i> Learn About Custom Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
