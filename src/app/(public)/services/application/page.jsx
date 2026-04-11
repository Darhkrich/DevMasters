"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./services.css";
import "@/styles/apps.css";
import AddToQuoteButton from "@/components/common/AddToQuoteButton";
import { fetchAppServices } from "@/lib/boemApi";
import { getServicesByCategory, getServicesByType } from "@/data/app-services";

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
          {(service.meta || []).map((metaItem, index) => (
            <li key={index}>
              <i className={metaItem.icon}></i> {metaItem.text}
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
          source="appServices"
          className="sp4__wc-btn-secondary sp4__wc-btn-large"
        />
      </div>
    </div>
  );
}

function BlueprintCard({ blueprint }) {
  return (
    <article className="sp4__wc-apps-bundle">
      <div
        className={`sp4__wc-apps-bundle-tag ${
          blueprint.tag === "Popular" ? "sp4__wc-apps-bundle-tag--accent" : ""
        }`}
      >
        {blueprint.tag}
      </div>
      <h3>{blueprint.title}</h3>
      <p>{blueprint.description}</p>
      <ul className="sp4__wc-apps-bundle-list">
        {(blueprint.features || []).map((feature, index) => (
          <li key={index}>
            <i className="fas fa-check-circle"></i> {feature}
          </li>
        ))}
      </ul>
      <div className="sp4__blueprint-actions">
        <Link href={`/services/application/${blueprint.id}`} className="sp4__wc-btn-secondary">
          View Blueprint
        </Link>
        <AddToQuoteButton
          item={blueprint}
          source="appServices"
          className="sp4__wc-btn-secondary sp4__wc-btn-large"
        />
      </div>
    </article>
  );
}

export default function AppsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [services, setServices] = useState([]);
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        // Build parameters for services: include type only if not "all"
        const serviceParams = { category: "service", flat: true };
        if (activeFilter !== "all") {
          serviceParams.type = activeFilter;
        }
        // Blueprints don't need type filter, but we still request flat array
        const blueprintParams = { category: "blueprint", flat: true };

        const [serviceResults, blueprintResults] = await Promise.all([
          fetchAppServices(serviceParams),
          fetchAppServices(blueprintParams),
        ]);

        if (!isMounted) return;

        setServices(serviceResults);
        setBlueprints(blueprintResults);
        setDataError("");
      } catch (error) {
        if (!isMounted) return;

        // Fallback to local mockup if API fails
        setServices(
          getServicesByType(activeFilter).filter((service) => service.category === "service")
        );
        setBlueprints(getServicesByCategory("blueprint"));
        setDataError("Live app services could not be loaded, so DevMasters is showing local service data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadServices();
    return () => {
      isMounted = false;
    };
  }, [activeFilter]);

  // Since the API already filters by type when we pass the parameter,
  // we can use services directly. If you prefer client-side filtering for consistency,
  // you can keep the useMemo but it's unnecessary here.
  const visibleServices = services;

  return (
    <main className="sp4__wc-services-page sp4__wc-apps-page">
      <section className="sp4__wc-services-hero sp4__wc-apps-hero">
        <div className="sp4__wc-services-hero-text">
          <span className="sp4__wc-pill">
            <i className="fas fa-mobile-alt"></i>
            Web & Mobile Apps
          </span>
          <h1>Apps that feel premium on every device.</h1>
          <p>
            We design and build fast, modern web and mobile apps that look and feel like native
            experiences. From MVPs to full products, we handle design, development and launch.
          </p>
          {dataError && <p className="error-message">{dataError}</p>}
        </div>

        <div className="sp4__wc-services-hero-demo">
          <div className="sp4__wc-hero-demo-card sp4__wc-apps-hero-card">
            <Link href={"/contact"}>
              <button className="sp4__wc-btn-primary">Free Consultation</button>
            </Link>
          </div>
        </div>
      </section>

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

      <section className="sp4__wc-service-section">
        <div className="sp4__wc-service-cards sp4__wc-apps-cards">
          {visibleServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        {loading && <p style={{ textAlign: "center" }}>Loading live app services...</p>}
      </section>

      {blueprints.length > 0 && (
        <section className="sp4__wc-service-section">
          <header className="sp4__wc-service-section-header">
            <div>
              <h2>Application Blueprints</h2>
              <p>These reusable blueprints are backed by the DevMasters backend and can be quoted directly.</p>
            </div>
          </header>
          <div className="sp4__wc-apps-cards">
            {blueprints.map((blueprint) => (
              <BlueprintCard key={blueprint.id} blueprint={blueprint} />
            ))}
          </div>
        </section>
      )}

      <aside className="sp4__wc-service-demo sp4__wc-apps-demo">
        <h3>App Flow Preview</h3>
        <p>
          A quick visual of how users move through a typical app that we design: from onboarding
          to dashboard and settings.
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
                  Simple welcome screens that explain your product and collect basic info without
                  overwhelming users.
                </div>
              </div>
              <div className="sp4__wc-apps-flow-step">
                <span className="sp4__wc-apps-step-label">2 · Main Experience</span>
                <div className="sp4__wc-apps-step-card sp4__wc-apps-step-card--accent">
                  Clean layout, clear actions, and a design system that stays consistent across
                  web and mobile.
                </div>
              </div>
              <div className="sp4__wc-apps-flow-step">
                <span className="sp4__wc-apps-step-label">3 · Settings & Profiles</span>
                <div className="sp4__wc-apps-step-card">
                  Profile, notifications, themes and more organized so users don’t get lost.
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