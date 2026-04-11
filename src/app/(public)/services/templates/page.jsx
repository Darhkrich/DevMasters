/* eslint-disable @next/next/no-img-element */
"use client";

import "./services.css";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { fetchTemplates } from "@/lib/boemApi";
import { templatesData as fallbackTemplates } from "@/data/templates";

export default function TemplatesPage() {
  const INITIAL_VISIBLE_COUNT = 6;
  const LOAD_MORE_INCREMENT = 6;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const timer = window.setTimeout(async () => {
      try {
        const results = await fetchTemplates({
          search: searchQuery || undefined,
          category: activeCategory === "all" ? undefined : activeCategory,
          type: activeType === "all" ? undefined : activeType,
        });

        if (!isMounted) {
          return;
        }

        setTemplates(results);
        setDataError("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setTemplates(fallbackTemplates);
        setDataError("Live template data could not be loaded, so Devmasters is showing the local catalog.");
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
  }, [activeCategory, activeType, searchQuery]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === "" ||
        template.name.toLowerCase().includes(query) ||
        template.shortName.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        (template.category || []).some((cat) => cat.includes(query));

      const matchesCategory =
        activeCategory === "all" || (template.category || []).includes(activeCategory);

      const matchesType = activeType === "all" || template.type === activeType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [activeCategory, activeType, searchQuery, templates]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleTypeClick = (type) => {
    setActiveType(type);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleToggleLoad = () => {
    if (visibleCount < filteredTemplates.length) {
      setVisibleCount((previousCount) => previousCount + LOAD_MORE_INCREMENT);
      return;
    }

    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const totalItems = filteredTemplates.length;
  const allLoaded = visibleCount >= totalItems;
  const showButton = totalItems > INITIAL_VISIBLE_COUNT;

  return (
    <main className="sp3__wc-services-page sp3__wc-templates-page">
      <section className="sp3__wc-services-hero sp3__wc-templates-hero">
        <div className="sp3__wc-services-hero-text">
          <span className="sp3__wc-pill">
            <i className="fas fa-globe" style={{ fontSize: "0.8rem" }}></i>
            Ready-Made & Customizable
          </span>
          <h1>Launch fast with Websites built to sell.</h1>
          <p>
            Pick a ready-made website or choose a Customizable Website as a starting point for
            something unique. All Websites are responsive on all devices and optimized for speed.
          </p>
          {dataError && <p>{dataError}</p>}
        </div>

        <div className="sp3__wc-services-hero-demo">
          <Link href="/contact">
            <button className="sp3__wc-btn-primary1"> Contact Us</button>
          </Link>
        </div>
      </section>

      <section className="sp3__wc-templates-controls">
        <div className="sp3__wc-templates-search">
          <div className="sp3__wc-input-chip">
            <i className="fas fa-search"></i>
            <input
              type="text"
              id="templateSearch"
              placeholder="Search website (e.g. 'restaurant', 'agency', 'portfolio')"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="sp3__wc-templates-filters">
          <div className="sp3__wc-templates-filter-chips" id="templateFilterChips">
            {[
              { id: "all", label: "All", icon: "fas fa-border-all" },
              { id: "business", label: "Business", icon: "fas fa-briefcase" },
              { id: "ecommerce", label: "E-commerce", icon: "fas fa-shopping-bag" },
              { id: "portfolio", label: "Portfolio", icon: "fas fa-id-card" },
              { id: "blog", label: "Blog", icon: "fas fa-newspaper" },
              { id: "landing", label: "Landing Page", icon: "fas fa-rocket" },
            ].map((category) => (
              <button
                key={category.id}
                className={`sp3__wc-t-chip ${
                  activeCategory === category.id ? "sp3__wc-t-chip--active" : ""
                }`}
                onClick={() => handleCategoryClick(category.id)}
                data-category={category.id}
              >
                <i className={category.icon}></i> {category.label}
              </button>
            ))}
          </div>

          <div className="sp3__wc-templates-toggle" id="templateTypeToggle">
            {[
              { id: "all", label: "All" },
              { id: "ready", label: "Ready-Made" },
              { id: "custom", label: "Customizable" },
            ].map((typeMode) => (
              <button
                key={typeMode.id}
                className={`sp3__wc-t-view ${
                  activeType === typeMode.id ? "sp3__wc-t-view--active" : ""
                }`}
                onClick={() => handleTypeClick(typeMode.id)}
                data-mode={typeMode.id}
              >
                {typeMode.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="sp3__wc-service-section sp3__wc-templates-section">
        <header className="sp3__wc-service-section-header">
          <div>
            <h2>Ready-Made Websites & Customizable Templates</h2>
            <p>
              Choose a template, see the price and what&apos;s included. You can always ask for extra
              pages, integrations or a fully custom layout on top.
            </p>
          </div>
          <div className="sp3__wc-section-badge">Instant launch options</div>
        </header>

        <div className="sp3__wc-templates-grid" id="templatesGrid">
          {filteredTemplates.slice(0, visibleCount).map((template) => (
            <article
              key={template.id}
              className="sp3__wc-template-card"
              data-id={template.id}
              data-name={template.shortName}
              data-category={(template.category || []).join(" ")}
              data-type={template.type}
              data-preview={template.previewUrl}
            >
              <div className="sp3__wc-template-thumb">
                <div>
                  <img src={template.image} alt={`${template.shortName} template preview`} />
                </div>
              </div>
              <div className="sp3__wc-template-body">
                <div className="sp3__wc-template-header">
                  <h3>{template.name}</h3>
                  <span className={`sp3__wc-template-tag ${template.badgeClass}`}>
                    {template.badge}
                  </span>
                </div>
                <p>{template.description}</p>
                <ul className="sp3__wc-template-meta">
                  <li>
                    <i className="fas fa-layer-group"></i>{" "}
                    {(template.category || []).join(", ") || "General"}
                  </li>
                  <li>
                    <i className="fas fa-tag"></i> {template.type === "ready" ? "Ready-made" : "Customizable"}
                  </li>
                </ul>
                <div className="sp3__wc-template-footer">
                  <div className="sp3__wc-template-price">
                    <span className="sp3__wc-price-main">{template.priceLabel}</span>
                    <span className="sp3__wc-price-note">{template.priceNote}</span>
                  </div>
                  <div className="sp3__wc-template-actions">
                    <a
                      href={template.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sp3__wc-btn-ghost sp3__wc-btn-previewe"
                      style={{ position: "relative", zIndex: 999, pointerEvents: "auto" }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <i className="fas fa-eye"></i> Preview
                    </a>

                    <Link href={`/services/templates/${template.id}`}>
                      <button
                        className="sp3__wc-btn-primary sp3__wc-btn-buys"
                        style={{
                          position: "relative",
                          zIndex: 999,
                          pointerEvents: "auto",
                          cursor: "pointer",
                        }}
                        data-template-id={template.id}
                      >
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && filteredTemplates.length === 0 && (
          <div className="sp3__wc-templates-empty" id="templatesEmpty" style={{ display: "block" }}>
            <div className="sp3__wc-templates-empty-inner">
              <i className="fas fa-search"></i>
              <h3>Didn&apos;t find the template you&apos;re looking for?</h3>
              <p>
                Tell us about your business, and we&apos;ll design a unique website or a new template
                just for you.
              </p>
              <Link href="/contact" className="sp3__wc-btn-ghost sp3__wc-btn-contact">
                Contact us for a custom website
              </Link>
            </div>
          </div>
        )}

        {showButton && (
          <div className="sp3__wc-templates-loadmore">
            <button className="sp3__wc-btn-ghost" id="btnLoadMoreTemplates" onClick={handleToggleLoad}>
              {allLoaded ? "Show Less" : "Load more websites"}
            </button>
          </div>
        )}

        {loading && <div className="sp3__wc-templates-loadmore">Loading live templates...</div>}
      </section>
    </main>
  );
}
