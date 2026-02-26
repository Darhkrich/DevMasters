"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { addTemplateToDashboard } from "@/lib/dashboardStore";
import { templatesData } from "@/data/templates";
import AddToQuoteButton from '@/components/common/AddToQuoteButton';
import "./service.css";

export default function TemplateDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [template, setTemplate] = useState(null);
  const [relatedTemplates, setRelatedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToDashboard, setAddedToDashboard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!id || !templatesData) {
        setLoading(false);
        return;
      }

      const foundTemplate = templatesData.find(t => t.id === id);

      if (foundTemplate) {
        setTemplate(foundTemplate);

        const related = templatesData
          .filter(tpl => {
            if (tpl.id === id) return false;

            const hasCommonCategory =
              Array.isArray(tpl.category) &&
              Array.isArray(foundTemplate.category) &&
              tpl.category.some(cat =>
                foundTemplate.category.includes(cat)
              );

            const sameType = tpl.type === foundTemplate.type;
            return hasCommonCategory || sameType;
          })
          .slice(0, 3);

        setRelatedTemplates(related);
      }

      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [id]);

  const handleBuyTemplate = () => {
    if (!template) return;
    
    addTemplateToDashboard(template);
    setAddedToDashboard(true);

    setTimeout(() => {
      setAddedToDashboard(false);
    }, 3000);
  };

  const handleContactForCustomization = () => {
    if (template?.id) {
      router.push(`/contact?template=${template.id}`);
    }
  };

  if (loading) {
    return (
      <div className="wc-loading">
        <div className="wc-loading-spinner"></div>
        <p>Loading Website details...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="wc-template-not-found">
        <div style={{ textAlign: "center", padding: "50px 20px" }}>
          <h2>Website Not Found</h2>

          <div>
            {templatesData.slice(0, 10).map(tpl => (
              <Link
                key={tpl.id}
                href={`/services/templates/${tpl.id}`}
              >
                {tpl.shortName || tpl.name}
              </Link>
            ))}
          </div>

          <Link href="/services/templates">
            Back to Website Service
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <main className="wc-template-detail-page">
      {/* Breadcrumb Navigation */}
      <nav className="wc-template-breadcrumb">
        <Link href="/services/templates" className="wc-breadcrumb-link">
          <i className="fas fa-arrow-left"></i> Back to Website Service
        </Link>
        <div className="wc-breadcrumb-path">
          <Link href="/services">Services</Link> / 
          <Link href="/services/templates">Websites</Link> / 
          <span>{template.shortName}</span>
        </div>
      </nav>

      {/* Template Header Section */}
      <section className="wc-template-detail-header">
        <div className="wc-template-detail-header-left">
          <div className="wc-template-badge-container">
            <span className={`wc-template-tag ${template.badgeClass}`}>
              {template.badge}
            </span>
            {template.category && Array.isArray(template.category) && template.category.map((cat, index) => (
              <span key={index} className="wc-category-chip">
                {cat}
              </span>
            ))}
          </div>
          <h1>{template.name}</h1>
          <p className="wc-template-detail-description">{template.description}</p>
          
          <div className="wc-template-detail-meta">
            <div className="wc-template-price-detail">
              <span className="wc-price-main">{template.price}</span>
              <span className="wc-price-note">{template.priceNote}</span>
            </div>
            
            <div className="wc-template-stats">
              <div className="wc-stat">
                <i className="fas fa-layer-group"></i>
                <span>{template.pages || '5-10'} Pages</span>
              </div>
              <div className="wc-stat">
                <i className="fas fa-mobile-alt"></i>
                <span>Fully Responsive</span>
              </div>
              <div className="wc-stat">
                <i className="fas fa-bolt"></i>
                <span>Optimized Performance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="wc-template-detail-header-right">
          <div className="wc-template-cta-card">
            <h3>Get This Website</h3>
            <p>Includes setup, basic customization, and 1 month support</p>
            
            <div className="wc-template-cta-actions">
              {template.previewUrl && template.previewUrl !== '#' ? (
                <a
                  href={template.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wc-btn-ghost wc-btn-preview-large"
                >
                  <i className="fas fa-eye"></i> Live Preview
                </a>
              ) : (
                <button className="wc-btn-ghost wc-btn-preview-large" disabled>
                  <i className="fas fa-eye"></i> Preview Coming Soon
                </button>
              )}
          {/* FIXED: Changed 'service' to 'template' and 'source' to 'templates' */}
            <AddToQuoteButton 
              item={template} 
              source="templates" 
              className="wc-btn-ghost wc-btn-customize"
            />
             
            </div>
            
            <div className="wc-template-cta-note">
              <i className="fas fa-info-circle"></i>
              <small>Need custom modifications? We can tailor this template to your exact needs.</small>
            </div>
            
         
          </div>
        </div>
      </section>

      {/* Template Gallery - FIXED: Use data URL fallback */}
      <section className="wc-template-gallery">
        <h2>Website Preview</h2>
        <div className="wc-template-gallery-main">
          <div className="wc-template-main-image">
            <img 
              src={template.image} 
              alt={`${template.shortName} full preview`}
              loading="lazy"
            />
            <div className="wc-image-overlay">
              <span>Template preview</span>
            </div>
          </div>
        </div>
        
        {template.previewUrl && template.previewUrl !== '#' && (
          <div className="wc-template-preview-note">
            <i className="fas fa-external-link-alt"></i>
            <p>Click "Live Preview" above to explore the fully functional Website.</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="wc-template-features">
        <h2>Website Features</h2>
        <div className="wc-template-features-grid">
          <div className="wc-feature-card">
            <div className="wc-feature-icon">
              <i className="fas fa-paint-brush"></i>
            </div>
            <h3>Design Features</h3>
            <ul className="wc-feature-list">
              <li><i className="fas fa-check"></i> Modern, clean design</li>
              <li><i className="fas fa-check"></i> Mobile-first responsive layout</li>
              <li><i className="fas fa-check"></i> Cross-browser compatibility</li>
              <li><i className="fas fa-check"></i> SEO-friendly structure</li>
              <li><i className="fas fa-check"></i> Fast loading animations</li>
            </ul>
          </div>
          
          <div className="wc-feature-card">
            <div className="wc-feature-icon">
              <i className="fas fa-cogs"></i>
            </div>
            <h3>Technical Features</h3>
            <ul className="wc-feature-list">
              <li><i className="fas fa-check"></i> Built with Next.js 15</li>
              <li><i className="fas fa-check"></i> React components</li>
              <li><i className="fas fa-check"></i> Tailwind CSS</li>
              <li><i className="fas fa-check"></i> Optimized images</li>
              <li><i className="fas fa-check"></i> Clean, documented code</li>
            </ul>
          </div>
          
          <div className="wc-feature-card">
            <div className="wc-feature-icon">
              <i className="fas fa-tools"></i>
            </div>
            <h3>What's Included</h3>
            <ul className="wc-feature-list">
              <li><i className="fas fa-check"></i> Complete source code</li>
              <li><i className="fas fa-check"></i> All assets & images</li>
              <li><i className="fas fa-check"></i> Documentation</li>
              <li><i className="fas fa-check"></i> 1 month support</li>
              <li><i className="fas fa-check"></i> Basic customization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="wc-template-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="wc-faq-grid">
          <div className="wc-faq-item">
            <h3>Can I customize this Website Template?</h3>
            <p>Yes! All templates come with basic customization (colors, text, images). For extensive modifications, you can request a custom quote.</p>
          </div>
          
          <div className="wc-faq-item">
            <h3>How long does setup take?</h3>
            <p>Standard setup takes 2-3 business days. Custom modifications may take additional time depending on complexity.</p>
          </div>
          
          <div className="wc-faq-item">
            <h3>What support is included?</h3>
            <p>All purchases include 1 month of technical support for setup and basic troubleshooting.</p>
          </div>
          
          <div className="wc-faq-item">
            <h3>Can I get a refund?</h3>
            <p>Due to the digital nature of templates, we offer refunds only in cases where the template is defective.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="wc-template-final-cta">
        <div className="wc-cta-card">
          <h2>Ready to launch with this template?</h2>
          <p>Get your website up and running quickly with our professional setup service.</p>
          <div className="wc-cta-buttons">
            <button
              className="wc-btn-primary wc-btn-buy-now"
              onClick={handleBuyTemplate}
            >
              <i className="fas fa-rocket"></i> Buy & Launch Now
            </button>
            <Link 
              href="/contact" 
              className="wc-btn-ghost wc-btn-talk"
            >
              <i className="fas fa-comments"></i> Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}