"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/dashboardStore";
import "./dashboard.css";

export default function DashboardOverview() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    setDashboard(getDashboard());
  }, []);

  if (!dashboard) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  const { templates, aiAutomation, mobileApps, pricingPlans } = dashboard.items;

  return (
    <main className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Your selected services and ongoing projects</p>
      </header>

      {/* Summary Stats */}
      <section className="dashboard-stats">
        <Stat title="Templates" value={templates.length} />
        <Stat title="AI Automation" value={aiAutomation.length} />
        <Stat title="Mobile Apps" value={mobileApps.length} />
        <Stat title="Pricing Plans" value={pricingPlans.length} />
      </section>

      {/* Templates */}
      <DashboardSection
        title="Website Templates"
        items={templates}
        empty="No templates added yet."
        render={(item) => (
          <ItemCard
            title={item.name}
            subtitle={item.price}
            image={item.image}
          />
        )}
      />

      {/* AI Automation */}
      <DashboardSection
        title="AI Automation Services"
        items={aiAutomation}
        empty="No AI automation selected."
        render={(item) => (
          <ItemCard
            title={item.name}
            subtitle="AI Service"
          />
        )}
      />

      {/* Mobile Apps */}
      <DashboardSection
        title="Mobile App Development"
        items={mobileApps}
        empty="No mobile app projects yet."
        render={(item) => (
          <ItemCard
            title={item.name}
            subtitle="Mobile Application"
          />
        )}
      />

      {/* Pricing Plans */}
      <DashboardSection
        title="Subscription Plans"
        items={pricingPlans}
        empty="No active pricing plan."
        render={(item) => (
          <ItemCard
            title={item.name}
            subtitle={`${item.price}/month`}
          />
        )}
      />
    </main>
  );
}

/* ---------- Small UI Components ---------- */

function Stat({ title, value }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <span>{value}</span>
    </div>
  );
}

function DashboardSection({ title, items, empty, render }) {
  return (
    <section className="dashboard-section">
      <h2>{title}</h2>

      {items.length === 0 ? (
        <p className="empty-state">{empty}</p>
      ) : (
        <div className="items-grid">
          {items.map((item, index) => (
            <div key={index}>{render(item)}</div>
          ))}
        </div>
      )}
    </section>
  );
}

function ItemCard({ title, subtitle, image }) {
  return (
    <div className="item-card">
      {image && <img src={image} alt={title} />}
      <div className="item-content">
        <h4>{title}</h4>
        <p className="price">{subtitle}</p>
      </div>
    </div>
  );
}