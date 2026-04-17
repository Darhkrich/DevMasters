"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AddToQuoteButton from "@/components/common/AddToQuoteButton";
import { fetchAppService } from "@/lib/boemApi";
import { getServicesByCategory, getServicesByType } from "@/data/app-services";
import "./styles.css"; // new isolated CSS file

function getFallbackService(id) {
  const allServices = getServicesByType("all");
  return allServices.find((service) => service.id === id) || getServicesByCategory("blueprint").find((service) => service.id === id) || null;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadServiceDetails = async () => {
      try {
        const result = await fetchAppService(params.id);
        if (!isMounted) return;
        setService(result);
        setDataError("");
      } catch (error) {
        if (!isMounted) return;
        setService(getFallbackService(params.id));
        setDataError("Live service details could not be loaded, so DevMasters is showing local content.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadServiceDetails();
    return () => { isMounted = false; };
  }, [params.id]);

  const renderTabContent = () => {
    const isBlueprint = service?.category === "blueprint";
    const features = service?.features || [];

    switch (activeTab) {
      case "overview":
        return (
          <div className="apd-tab-content">
            <div className="apd-overview">
              <div className="apd-overview-main">
                <h2>Service Overview</h2>
                <p>{service.longDescription || service.description}</p>
                {dataError && <p>{dataError}</p>}
              </div>

              <div className="apd-overview-sidebar">
                <div className="apd-tech-stack">
                  <h3>Delivery Highlights</h3>
                  <div className="apd-tech-items">
                    {(service.meta || []).map((metaItem, index) => (
                      <span key={index} className="apd-tech-item">
                        {metaItem.text}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="apd-timeline">
                  <h3>Estimated Timeline</h3>
                  <p>{service.timeline || "4-8 weeks"}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "features":
        return (
          <div className="apd-tab-content">
            <div className="apd-features">
              <h2>Features & Capabilities</h2>

              {isBlueprint ? (
                <div className="apd-blueprint-features">
                  <div className="apd-blueprint-features-list">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className={`apd-blueprint-feature-item ${selectedFeatureIndex === index ? "apd-blueprint-feature-item--active" : ""}`}
                        onClick={() => setSelectedFeatureIndex(index)}
                      >
                        <div className="apd-blueprint-feature-header">
                          <span className="apd-blueprint-feature-number">0{index + 1}</span>
                          <h4>{feature.title || feature}</h4>
                        </div>
                        <p>{feature.description || "Included in this blueprint package."}</p>
                      </div>
                    ))}
                  </div>

                  <div className="apd-blueprint-feature-preview">
                    <div className="apd-feature-preview-card">
                      <h3>Feature Preview</h3>
                      <p>{features[selectedFeatureIndex]?.description || features[selectedFeatureIndex]}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="apd-features-grid">
                  {features.map((feature, index) => (
                    <div key={index} className="apd-feature-card">
                      <div className="apd-feature-icon">
                        {feature.icon && <i className={feature.icon}></i>}
                      </div>
                      <h4>{feature.title || feature}</h4>
                      <p>{feature.description || "Standard feature included"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "delivery":
        return (
          <div className="apd-tab-content">
            <div className="apd-delivery">
              <h2>Development Process</h2>

              <div className="apd-process">
                {[
                  { step: 1, title: "Discovery & Planning", desc: "We understand your requirements and create a detailed project plan." },
                  { step: 2, title: "Design & Prototyping", desc: "Wireframes and prototypes to visualize the final product." },
                  { step: 3, title: "Development", desc: "Agile development with regular updates and demos." },
                  { step: 4, title: "Testing & Quality Assurance", desc: "Comprehensive testing across devices and browsers." },
                  { step: 5, title: "Deployment & Launch", desc: "Smooth deployment with post-launch support." },
                ].map((process) => (
                  <div key={process.step} className="apd-process-step">
                    <div className="apd-process-step-number">{process.step}</div>
                    <div className="apd-process-step-content">
                      <h4>{process.title}</h4>
                      <p>{process.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="apd-tab-content">
            <div className="apd-faq">
              <h2>Frequently Asked Questions</h2>

              <div className="apd-faq-list">
                {[
                  { q: "Can I customize this service?", a: "Yes, all our services are customizable to fit your specific needs." },
                  { q: "What support is included?", a: "We provide post-launch support and handover guidance on every DevMasters project." },
                  { q: "Do you offer payment plans?", a: "Yes, we can structure staged delivery and payment milestones for larger projects." },
                  { q: "What is your revision policy?", a: "Revision scope depends on the package, but every project includes a review cycle." },
                ].map((faq, index) => (
                  <div key={index} className="apd-faq-item">
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
      <div className="apd-loading">
        <div className="apd-loading-spinner"></div>
        <p>Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="apd-not-found">
        <h2>Service Not Found</h2>
        <p>The service you're looking for doesn't exist or has been moved.</p>
        <Link href="/services/application" className="apd-btn-primary">Back to Services</Link>
      </div>
    );
  }

  const isBlueprint = service.category === "blueprint";
  const metaItems = service.meta || [];

  return (
    <div className="apd-wrapper">
      <nav className="apd-nav">
        <button onClick={() => router.back()} className="apd-btn-ghost">Back to Services</button>
        <div className="apd-breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href="/services/application">Apps & Services</Link><span>/</span>
          <span className="apd-breadcrumb-current">{service.title}</span>
        </div>
      </nav>

      <section className="apd-hero">
        <div className="apd-hero-content">
          <div className="apd-badge-container">
            <span className={`apd-service-tag ${service.tag === "Popular" ? "apd-service-tag--accent" : ""}`}>
              {service.tag || (isBlueprint ? "Blueprint" : "Service")}
            </span>
            <span className="apd-service-type">{isBlueprint ? "Blueprint" : "Custom service"}</span>
          </div>

          <h1 className="apd-title">{service.title}</h1>
          <p className="apd-subtitle">{service.description}</p>

          <div className="apd-meta">
            {metaItems.map((item, index) => (
              <div key={index} className="apd-meta-item">
                <i className={item.icon}></i>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="apd-hero-pricing">
          <div className="apd-actions">
            <AddToQuoteButton item={service} source="appServices" className="apd-btn-secondary apd-btn-large" />
            <Link href="/contact" className="apd-btn-secondary apd-btn-large">Book Free Consultation</Link>
          </div>
          <div className="apd-guarantee">
            <span>Premium support included • Final scope confirmed after review</span>
          </div>
        </div>
      </section>

      <div className="apd-tabs">
        {["overview", "features", "delivery", "faq"].map((tab) => (
          <button
            key={tab}
            className={`apd-tab ${activeTab === tab ? "apd-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="apd-content">{renderTabContent()}</div>

      <section className="apd-cta">
        <div className="apd-cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Book a free consultation to discuss your project requirements.</p>
          <div className="apd-cta-actions">
            <button className="apd-btn-primary apd-btn-xlarge" onClick={() => setShowBookingModal(true)}>
              Schedule Consultation
            </button>
            <AddToQuoteButton item={service} source="appServices" className="apd-btn-secondary apd-btn-large" />
          </div>
        </div>
      </section>

      {showBookingModal && (
        <div className="apd-modal" onClick={() => setShowBookingModal(false)}>
          <div className="apd-modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Consultation Request</h4>
            <p>Use the contact page or checkout flow and we'll follow up with a project conversation.</p>
            <button className="apd-btn-primary" onClick={() => router.push("/contact")}>
              Go to Contact Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}