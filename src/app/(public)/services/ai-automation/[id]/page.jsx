"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { aiAutomations, aiBundles } from '@/data/aiAutomations';
import AddToQuoteButton from '@/components/common/AddToQuoteButton';
import './styles.css';

export default function AIAutomationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    if (params?.id) {
      // Try to find in automations first
      let foundItem = aiAutomations.find(item => item.id === params.id);
      let itemType = 'automation';
      
      // If not found in automations, try bundles
      if (!foundItem) {
        foundItem = aiBundles.find(item => item.id === params.id);
        itemType = 'bundle';
      }
      
      if (foundItem) {
        setItem({ ...foundItem, type: itemType });
        
        // Find related items (same sector or type)
        const source = itemType === 'automation' ? aiAutomations : aiBundles;
        const related = source
          .filter(i => i.id !== params.id && i.sector === foundItem.sector)
          .slice(0, 3);
        setRelatedItems(related);
      }
      setLoading(false);
    }
  }, [params?.id]);

  const handleContact = () => {
    if (item) {
      router.push(`/contact?ai=${item.id}&type=${item.type}`);
    }
  };

  if (loading) {
    return (
      <div className="wc-ai-loading">
        <div className="wc-ai-loading-spinner"></div>
        <p>Loading automation details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="wc-ai-not-found">
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <i className="fas fa-robot" style={{ fontSize: '3rem', color: '#ff6b6b', marginBottom: '20px' }}></i>
          <h2>Automation Not Found</h2>
          <p style={{ marginBottom: '20px' }}>The automation or bundle with ID "{params?.id}" was not found.</p>
          <Link 
            href="/services/ai-automation" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#0070f3',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to AI Automations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="wc-ai-detail-page">
      {/* Breadcrumb Navigation */}
      <nav className="wc-ai-breadcrumb">
        <Link href="/services/ai-automation" className="wc-ai-breadcrumb-link">
          <i className="fas fa-arrow-left"></i> Back to AI Automations
        </Link>
        <div className="wc-ai-breadcrumb-path">
          <Link href="/services">Services</Link> / 
          <Link href="/services/ai-automation">AI Automation</Link> / 
          <span>{item.title}</span>

       
        </div>

      </nav>
   

      {/* Item Header */}
      <section className="wc-ai-detail-header">
        <div className="wc-ai-detail-header-left">
          <div className="wc-ai-badge-container">
            <span className={`wc-ai-type-badge ${item.type === 'bundle' ? 'wc-ai-bundle-badge' : 'wc-ai-automation-badge'}`}>
              {item.type === 'bundle' ? 'Bundle' : 'Automation'}
            </span>
            {item.sector && (
              <span className={`wc-sector-badge wc-sector-${item.sector}`}>
                {item.sector.replace("-", " ")}
              </span>
            )}
            {item.tag && (
              <span className="wc-ai-tag-badge">{item.tag}</span>
            )}
          </div>
          
          <h1>{item.title}</h1>
          <p className="wc-ai-detail-description">{item.description}</p>
          
          <div className="wc-ai-detail-meta">
            <div className="wc-ai-price-section">
              <div className="wc-ai-price">
                <span className="wc-price-main">{item.price}</span>
                <span className="wc-price-note">{item.priceNote}</span>
              </div>
              <div className="wc-ai-delivery">
                <i className="fas fa-clock"></i>
                <span>{item.deliveryTime} setup</span>
              </div>
            </div>
            
            <div className="wc-ai-stats">
              <div className="wc-ai-stat">
                <i className="fas fa-check-circle"></i>
                <span>{item.features?.length || item.items?.length || 0} Features</span>
              </div>
              <div className="wc-ai-stat">
                <i className="fas fa-plug"></i>
                <span>{item.integration?.length || 'Multiple'} Integrations</span>
              </div>
              <div className="wc-ai-stat">
                <i className="fas fa-rocket"></i>
                <span>Ready to Deploy</span>
              </div>
            </div>
          </div>
        </div>

        <div className="wc-ai-detail-header-right">
          <div className="wc-ai-cta-card">
            <h3>Get This {item.type === 'bundle' ? 'Bundle' : 'Automation'}</h3>
            <p>Includes setup, configuration, and 3 months support</p>
            
            <div className="wc-ai-cta-actions">
       
{/* FIXED: Changed 'service' to 'template' and 'source' to 'templates' */}
            <AddToQuoteButton 
              item={item} 
              source="templates" 
              className="wc-btn-ghost wc-btn-customize"
            />
              <Link 
                href="/contact" 
                className="wc-btn-ghost wc-ai-consult-btn"
              >
                <i className="fas fa-calendar"></i> Schedule Consultation
              </Link>


            </div>
            
            <div className="wc-ai-cta-note">
              <i className="fas fa-info-circle"></i>
              <small>Includes 3 months of updates and priority support</small>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="wc-ai-features">
        <h2>What's Included</h2>
        <div className="wc-ai-features-grid">
          {(item.type === 'automation' ? item.features : item.items)?.map((feature, index) => (
            <div key={index} className="wc-ai-feature-item">
              <div className="wc-ai-feature-icon">
                <i className="fas fa-check"></i>
              </div>
              <h4>{feature}</h4>
              {item.type === 'automation' && item.useCases?.[index] && (
                <p className="wc-ai-feature-desc">{item.useCases[index]}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      {item.benefits && (
        <section className="wc-ai-benefits">
          <h2>Key Benefits</h2>
          <div className="wc-ai-benefits-grid">
            {item.benefits.map((benefit, index) => (
              <div key={index} className="wc-ai-benefit-card">
                <div className="wc-ai-benefit-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h4>{benefit}</h4>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Integration Section */}
      {item.integration && (
        <section className="wc-ai-integration">
          <h2>Integration & Compatibility</h2>
          <div className="wc-ai-integration-grid">
            {item.integration.map((integration, index) => (
              <div key={index} className="wc-ai-integration-item">
                <div className="wc-ai-integration-icon">
                  <i className="fas fa-plug"></i>
                </div>
                <span>{integration}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ideal For Section (for bundles) */}
      {item.idealFor && (
        <section className="wc-ai-ideal-for">
          <h2>Ideal For</h2>
          <div className="wc-ai-ideal-for-grid">
            {item.idealFor.map((ideal, index) => (
              <div key={index} className="wc-ai-ideal-item">
                <i className="fas fa-check"></i>
                <span>{ideal}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <section className="wc-ai-related">
          <h2>Related {item.type === 'bundle' ? 'Bundles' : 'Automations'}</h2>
          <div className="wc-ai-related-grid">
            {relatedItems.map((related) => (
              <div key={related.id} className="wc-ai-related-card">
                <div className="wc-ai-related-header">
                  <i className={related.icon || "fas fa-robot"}></i>
                  <span className={`wc-sector-badge wc-sector-${related.sector}`}>
                    {related.sector.replace("-", " ")}
                  </span>
                </div>
                <div className="wc-ai-related-body">
                  <h4>{related.title}</h4>
                  <p>{related.description.substring(0, 100)}...</p>
                  <div className="wc-ai-related-footer">
                    <span className="wc-ai-related-price">{related.price}</span>
                    <Link 
                      href={`/services/ai-automation/${related.id}`}
                      className="wc-btn-ghost wc-ai-related-btn"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="wc-ai-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="wc-ai-faq-grid">
          <div className="wc-ai-faq-item">
            <h3>How long does setup take?</h3>
            <p>Most automations are set up within {item.deliveryTime}. Complex customizations may take additional time.</p>
          </div>
          
          <div className="wc-ai-faq-item">
            <h3>Is training included?</h3>
            <p>Yes! We provide comprehensive training for your team on how to use and manage the automation.</p>
          </div>
          
          <div className="wc-ai-faq-item">
            <h3>Can I customize this further?</h3>
            <p>Absolutely! We offer customization services to tailor the automation to your specific workflow.</p>
          </div>
          
          <div className="wc-ai-faq-item">
            <h3>What support is included?</h3>
            <p>All purchases include 3 months of priority support and regular updates.</p>
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="wc-ai-final-cta">
        <div className="wc-ai-final-cta-card">
          <h2>Ready to automate your workflows?</h2>
          <p>Start saving time and increasing efficiency with AI automation.</p>
          <div className="wc-ai-final-cta-buttons">
            <button className="wc-btn-primary wc-ai-final-buy" onClick={handleContact}>
              <i className="fas fa-rocket"></i> Get Started Now
            </button>
            <Link 
              href="/contact" 
              className="wc-btn-ghost wc-ai-final-talk"
            >
              <i className="fas fa-comments"></i> Talk to Our AI Experts
            </Link>
      

          </div>
        
        </div>
      </section>
    </main>
  );
}