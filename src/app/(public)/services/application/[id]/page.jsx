"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getServicesByType, getServicesByCategory } from "@/data/app-services";
import AddToQuoteButton from '@/components/common/AddToQuoteButton';
import "./styles.css";


export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const fetchServiceDetails = () => {
      setLoading(true);
      
      // Search in all services first
      const allServices = getServicesByType("all");
      const foundService = allServices.find(s => s.id === params.id);
      
      // If not found in services, search in blueprints
      if (!foundService) {
        const blueprints = getServicesByCategory('blueprint');
        const foundBlueprint = blueprints.find(b => b.id === params.id);
        setService(foundBlueprint || null);
      } else {
        setService(foundService);
      }
      
      setLoading(false);
      // Trigger fade-in animation
      setTimeout(() => setFadeIn(true), 100);
    };
    
    fetchServiceDetails();
  }, [params.id]);

  const handleAddToCart = () => {
    // Add to cart functionality
    console.log("Added to cart:", service);
    // Show success notification
    alert(`${service.title} added to cart!`);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Handle booking submission
    alert("Consultation booked successfully! We'll contact you shortly.");
    setShowBookingModal(false);
  };

  const renderTabContent = () => {
    const isBlueprint = service?.category === 'blueprint';
    const features = service?.features || [];
    
    switch(activeTab) {
      case 'overview':
        return (
          <div className="wc-service-tab-content wc-tab-animate">
            <div className="wc-service-overview">
              <div className="wc-service-overview-main">
                <h2>Service Overview</h2>
                <p>{service.longDescription || service.description}</p>
                
                {service.deliverables && (
                  <div className="wc-service-deliverables">
                    <h3>What's Included</h3>
                    <ul className="wc-service-deliverables-list">
                      {service.deliverables.map((item, index) => (
                        <li key={index} className="wc-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                         
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="wc-service-overview-sidebar">
                <div className="wc-service-tech-stack">
                  <h3>Technology Stack</h3>
                  <div className="wc-tech-stack-items">
                    {(service.techStack || ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']).map((tech, index) => (
                      <span key={index} className="wc-tech-stack-item wc-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="wc-service-timeline">
                  <h3>
              
                    Estimated Timeline
                  </h3>
                  <p>{service.timeline || '4-8 weeks'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="wc-service-tab-content wc-tab-animate">
            <div className="wc-service-features">
              <h2>Features & Capabilities</h2>
              
              {isBlueprint ? (
                <div className="wc-blueprint-features">
                  <div className="wc-blueprint-features-list">
                    {features.map((feature, index) => (
                      <div 
                        key={index}
                        className={`wc-blueprint-feature-item wc-fade-in-up ${selectedFeatureIndex === index ? 'wc-blueprint-feature-item--active' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => setSelectedFeatureIndex(index)}
                      >
                        <div className="wc-blueprint-feature-header">
                          <span className="wc-blueprint-feature-number">0{index + 1}</span>
                          <h4>{feature.title || feature}</h4>
                        </div>
                        <p>{feature.description || 'Comes with this blueprint'}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="wc-blueprint-feature-preview">
                    <div className="wc-feature-preview-card">
                      <h3>Feature Preview</h3>
                      <p>{features[selectedFeatureIndex]?.description || features[selectedFeatureIndex]}</p>
                      <div className="wc-feature-preview-image">
                        <div className="wc-feature-image-placeholder">
                         
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="wc-service-features-grid">
                  {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="wc-service-feature-card wc-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="wc-service-feature-icon">
                        {feature.icon && <i className={feature.icon}></i>}
                      </div>
                      <h4>{feature.title || feature}</h4>
                      <p>{feature.description || 'Standard feature included'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'delivery':
        return (
          <div className="wc-service-tab-content wc-tab-animate">
            <div className="wc-service-delivery">
              <h2>Development Process</h2>
              
              <div className="wc-service-process">
                {[
                  { step: 1, title: 'Discovery & Planning', desc: 'We understand your requirements and create a detailed project plan.' },
                  { step: 2, title: 'Design & Prototyping', desc: 'Wireframes and prototypes to visualize the final product.' },
                  { step: 3, title: 'Development', desc: 'Agile development with regular updates and demos.' },
                  { step: 4, title: 'Testing & Quality Assurance', desc: 'Comprehensive testing across devices and browsers.' },
                  { step: 5, title: 'Deployment & Launch', desc: 'Smooth deployment with post-launch support.' }
                ].map((process, index) => (
                  <div 
                    key={process.step} 
                    className="wc-process-step wc-fade-in-left"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="wc-process-step-number">{process.step}</div>
                    <div className="wc-process-step-content">
                      <h4>{process.title}</h4>
                      <p>{process.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="wc-service-tab-content wc-tab-animate">
            <div className="wc-service-faq">
              <h2>Frequently Asked Questions</h2>
              
              <div className="wc-faq-list">
                {[
                  { q: 'Can I customize this service?', a: 'Yes, all our services are customizable to fit your specific needs.' },
                  { q: 'What support is included?', a: 'We provide 6 months of technical support and maintenance.' },
                  { q: 'Do you offer payment plans?', a: 'Yes, we offer flexible payment options for larger projects.' },
                  { q: 'What is your revision policy?', a: 'We include up to 3 rounds of revisions in our standard package.' }
                ].map((faq, index) => (
                  <div 
                    key={index} 
                    className="wc-faq-item wc-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h4>{faq.q}</h4>
                    <p>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="wc-loading-container">
        <div className="wc-loading-spinner"></div>
        <p>Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="wc-not-found">
        <h2>Service Not Found</h2>
        <p>The service you're looking for doesn't exist or has been moved.</p>
        <Link href="/services/application" className="wc-btn-primary">
         
          Back to Services
        </Link>
      </div>
    );
  }

  const isBlueprint = service.category === 'blueprint';
  const metaItems = service.meta || [];

  return (
    <main className={`wc-service-details-page ${fadeIn ? 'wc-page-loaded' : ''}`}>
      {/* Navigation */}
      <nav className="wc-service-details-nav wc-fade-in-down">
        <button 
          onClick={() => router.back()} 
          className="wc-btn-ghost"
        >
          
          Back to Services
        </button>
        <div className="wc-service-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/services/application">Apps & Services</Link>
          <span>/</span>
          <span className="wc-breadcrumb-current">{service.title}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="wc-service-details-hero wc-fade-in-up">
        <div className="wc-service-details-hero-content">
          <div className="wc-service-badge">
            <span className={`wc-service-tag ${service.tag === 'Popular' ? 'wc-service-tag--accent' : ''}`}>
              {service.tag || (isBlueprint ? 'Blueprint' : 'Service')}
            </span>
            <span className="wc-service-type">
              {service.type || (isBlueprint ? 'Template' : 'Custom')}
            </span>
          </div>
          
          <h1 className="wc-service-details-title">{service.title}</h1>
          <p className="wc-service-details-subtitle">{service.description}</p>
          
          <div className="wc-service-details-meta">
            {metaItems.map((item, index) => (
              <div key={index} className="wc-service-meta-item wc-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <i className={item.icon}></i>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="wc-service-details-pricing wc-fade-in-right">
          <div className="wc-service-price-display">
            <span className="wc-service-price-label">Starting at</span>
            <div className="wc-service-price-amount">
              ${service.price?.toLocaleString()}
              {service.priceNote && (
                <span className="wc-service-price-note">{service.priceNote}</span>
              )}
            </div>
          </div>
          
          <div className="wc-service-actions">
             {/* FIXED: Changed 'service' to 'template' and 'source' to 'templates' */}
            <AddToQuoteButton 
              item={service} 
              source="templates" 
              className="wc-btn-secondary wc-btn-large"
            />
          
            <button 
              className="wc-btn-secondary wc-btn-large"
             
            >
                <Link href={'/contact'}>
              Book Free Consultation
              </Link>
            </button>
          

            
          </div>
          
          <div className="wc-service-guarantee">
           
            <span>30-day money-back guarantee • Premium support included</span>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="wc-service-details-tabs wc-fade-in">
        {['overview', 'features', 'delivery', 'faq'].map((tab, index) => (
          <button
            key={tab}
            className={`wc-service-tab ${activeTab === tab ? 'wc-service-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="wc-service-details-content">
        {renderTabContent()}
      </div>

      {/* CTA Section */}
      <section className="wc-service-details-cta wc-fade-in-up">
        <div className="wc-service-cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Book a free 30-minute consultation to discuss your project requirements</p>
          
          <div className="wc-cta-actions">
            <button 
              className="wc-btn-primary wc-btn-xlarge wc-pulse-on-hover"
              onClick={() => setShowBookingModal(true)}
            >
              
              Schedule Consultation
            </button>
            <button 
              className="wc-btn-secondary wc-btn-xlarge"
              onClick={handleAddToCart}
            >
             
              Purchase Now
            </button>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {!isBlueprint && (
        <section className="wc-related-services wc-fade-in">
          <h2>Related Services</h2>
          <div className="wc-related-services-grid">
            {getServicesByType(service.type || 'web')
              .filter(s => s.id !== service.id)
              .slice(0, 3)
              .map((relatedService, index) => (
                <Link 
                  key={relatedService.id} 
                  href={`/services/application/${relatedService.id}`}
                  className="wc-related-service-card wc-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="wc-related-service-icon">
                    <i className={relatedService.icon}></i>
                  </div>
                  <h4>{relatedService.title}</h4>
                  <p className="wc-related-service-desc">{relatedService.description}</p>
                  <div className="wc-related-service-price">
                    From ${relatedService.price?.toLocaleString()}
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="wc-modal-overlay wc-modal-open">
          <div className="wc-booking-modal wc-modal-slide-in">
            <div className="wc-modal-header">
              <h3>Book a Consultation</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="wc-modal-close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="wc-booking-form">
              <div className="wc-form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your name" required />
              </div>
              
              <div className="wc-form-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" required />
              </div>
              
              <div className="wc-form-group">
                <label>Project Type</label>
                <select>
                  <option value="">Select project type</option>
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile App</option>
                  <option value="fullstack">Full Stack</option>
                  <option value="saas">SaaS Platform</option>
                </select>
              </div>
              
              <div className="wc-form-group">
                <label>Preferred Date & Time</label>
                <input type="datetime-local" required />
              </div>
              
              <div className="wc-form-group">
                <label>Additional Notes</label>
                <textarea 
                  placeholder="Tell us about your project requirements..." 
                  rows="4"
                ></textarea>
              </div>
              
              <div className="wc-form-actions">
                <button type="button" className="wc-btn-ghost" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="wc-btn-primary">
                  Book Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}