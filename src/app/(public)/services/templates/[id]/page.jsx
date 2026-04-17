/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AddToQuoteButton from "@/components/common/AddToQuoteButton";
import { fetchTemplate, fetchTemplates } from "@/lib/boemApi";
import { templatesData as fallbackTemplates } from "@/data/templates";
import "./service.css"; // new isolated CSS file

function normalizeFallbackTemplate(template) {
  return {
    ...template,
    title: template.name,
    price: template.price || null,
    priceLabel: template.price ? `$${template.price}` : "Custom Quote",
    priceNote: template.priceNote || "Website package",
    badge: template.badge || (template.type === "custom" ? "Customizable" : "Ready-Made"),
    badgeClass:
      template.badgeClass ||
      (template.type === "custom" ? "tpd-template-tag--custom" : "tpd-template-tag--ready"),
  };
}

export default function TemplateDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [template, setTemplate] = useState(null);
  const [relatedTemplates, setRelatedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTemplate = async () => {
      try {
        const [templateResult, relatedResult] = await Promise.all([
          fetchTemplate(id),
          fetchTemplates(),
        ]);

        if (!isMounted) return;

        setTemplate(templateResult);
        setRelatedTemplates(
          relatedResult
            .filter((item) => item.id !== id)
            .filter(
              (item) =>
                item.type === templateResult.type ||
                (item.category || []).some((category) =>
                  (templateResult.category || []).includes(category),
                ),
            )
            .slice(0, 3),
        );
        setDataError("");
      } catch (error) {
        if (!isMounted) return;

        const fallbackTemplate = fallbackTemplates.find((item) => item.id === id);
        setTemplate(fallbackTemplate ? normalizeFallbackTemplate(fallbackTemplate) : null);
        setRelatedTemplates(
          fallbackTemplates
            .filter((item) => item.id !== id)
            .map(normalizeFallbackTemplate)
            .slice(0, 3),
        );
        setDataError("Live template details could not be loaded, so DevMasters is showing local content.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTemplate();
    return () => { isMounted = false; };
  }, [id]);

  const related = useMemo(() => relatedTemplates.slice(0, 3), [relatedTemplates]);

  if (loading) {
    return (
      <div className="tpd-loading">
        <div className="tpd-loading-spinner"></div>
        <p>Loading Website details...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="tpd-not-found">
        <div style={{ textAlign: "center", padding: "50px 20px" }}>
          <h2>Website Not Found</h2>
          <Link href="/services/templates">Back to Website Service</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tpd-wrapper">
      <nav className="tpd-breadcrumb">
        <Link href="/services/templates" className="tpd-breadcrumb-link">
          <i className="fas fa-arrow-left"></i> Back to Website Service
        </Link>
        <div className="tpd-breadcrumb-path">
          <Link href="/services">Services</Link> /
          <Link href="/services/templates">Websites</Link> /
          <span>{template.shortName}</span>
        </div>
      </nav>

      <section className="tpd-header">
        <div className="tpd-header-left">
          <div className="tpd-badge-container">
            <span className={`tpd-template-tag ${template.badgeClass}`}>{template.badge}</span>
            {(template.category || []).map((category, index) => (
              <span key={index} className="tpd-category-chip">{category}</span>
            ))}
          </div>
          <h1 className="tpd-title">{template.name}</h1>
          <p className="tpd-description">{template.description}</p>
          {dataError && <p className="tpd-description">{dataError}</p>}

          <div className="tpd-meta">
            <div className="tpd-price-detail">
              <span className="tpd-price-main">{template.priceLabel}</span>
              <span className="tpd-price-note">{template.priceNote}</span>
            </div>

            <div className="tpd-stats">
              <div className="tpd-stat">
                <i className="fas fa-layer-group"></i>
                <span>{template.pages || "5-10"} Pages</span>
              </div>
              <div className="tpd-stat">
                <i className="fas fa-mobile-alt"></i>
                <span>Fully Responsive</span>
              </div>
              <div className="tpd-stat">
                <i className="fas fa-bolt"></i>
                <span>Optimized Performance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tpd-header-right">
          <div className="tpd-cta-card">
            <h3>Get This Website</h3>
            <p>Includes setup, basic customization, and 1 month support</p>

            <div className="tpd-cta-actions">
              {template.previewUrl && template.previewUrl !== "#" ? (
                <a
                  href={template.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tpd-btn-ghost tpd-btn-preview-large"
                >
                  <i className="fas fa-eye"></i> Live Preview
                </a>
              ) : (
                <button className="tpd-btn-ghost tpd-btn-preview-large" disabled>
                  <i className="fas fa-eye"></i> Preview Coming Soon
                </button>
              )}

              <AddToQuoteButton
                item={template}
                source="templates"
                className="tpd-btn-ghost tpd-btn-customize"
              />
            </div>

            <div className="tpd-cta-note">
              <i className="fas fa-info-circle"></i>
              <small>Need custom modifications? We can tailor this template to your exact needs.</small>
            </div>
          </div>
        </div>
      </section>

      <section className="tpd-gallery">
        <h2 className="tpd-section-title">Website Preview</h2>
        <div className="tpd-gallery-main">
          <div className="tpd-main-image">
            <img src={template.image} alt={`${template.shortName} full preview`} loading="lazy" />
            <div className="tpd-image-overlay">
              <span>Template preview</span>
            </div>
          </div>
        </div>
      </section>

      <section className="tpd-section">
        <h2 className="tpd-section-title">Website Features</h2>
        <div className="tpd-features-grid">
          <div className="tpd-feature-card">
            <div className="tpd-feature-icon">
              <i className="fas fa-paint-brush"></i>
            </div>
            <h3>Design Features</h3>
            <ul className="tpd-feature-list">
              <li><i className="fas fa-check"></i> Modern, clean design</li>
              <li><i className="fas fa-check"></i> Mobile-first responsive layout</li>
              <li><i className="fas fa-check"></i> Cross-browser compatibility</li>
              <li><i className="fas fa-check"></i> SEO-friendly structure</li>
              <li><i className="fas fa-check"></i> Fast loading animations</li>
            </ul>
          </div>

          <div className="tpd-feature-card">
            <div className="tpd-feature-icon">
              <i className="fas fa-cogs"></i>
            </div>
            <h3>Technical Features</h3>
            <ul className="tpd-feature-list">
              <li><i className="fas fa-check"></i> Built for production launch</li>
              <li><i className="fas fa-check"></i> Clean component structure</li>
              <li><i className="fas fa-check"></i> Performance-aware assets</li>
              <li><i className="fas fa-check"></i> Optimized images</li>
              <li><i className="fas fa-check"></i> Clean, documented code</li>
            </ul>
          </div>

          <div className="tpd-feature-card">
            <div className="tpd-feature-icon">
              <i className="fas fa-tools"></i>
            </div>
            <h3>What's Included</h3>
            <ul className="tpd-feature-list">
              <li><i className="fas fa-check"></i> Setup assistance</li>
              <li><i className="fas fa-check"></i> Basic customization</li>
              <li><i className="fas fa-check"></i> Launch guidance</li>
              <li><i className="fas fa-check"></i> Post-launch support</li>
              <li><i className="fas fa-check"></i> Delivery handover</li>
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="tpd-section">
          <h2 className="tpd-section-title">Related Templates</h2>
          <div className="tpd-features-grid">
            {related.map((item) => (
              <article key={item.id} className="tpd-feature-card">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <Link href={`/services/templates/${item.id}`} className="tpd-btn-ghost tpd-btn-talk">
                  View Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="tpd-final-cta">
        <div className="tpd-cta-card-full">
          <h2>Ready to launch with this template?</h2>
          <p>Get your website up and running quickly with our professional setup service.</p>
          <div className="tpd-cta-buttons">
            <button className="tpd-btn-primary tpd-btn-buy-now" onClick={() => router.push("/Checkout")}>
              <i className="fas fa-rocket"></i> Continue to Quote
            </button>
            <Link href="/contact" className="tpd-btn-ghost tpd-btn-talk">
              <i className="fas fa-comments"></i> Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}