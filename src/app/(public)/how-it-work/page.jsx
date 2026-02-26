'use client';

import { useState } from 'react';
import './how-it-work.css';

const FILTERS = [
  'All',
  'Templates',
  'Applications',
  'AI Automation',
  'Pricing',
];

export default function HowItWorksPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const isVisible = (type) =>
    activeFilter === 'All' || activeFilter === type;

  return (
    <main className="how">

      {/* HERO */}
      <section className="how-hero">
        <h1>How It Works</h1>
        <p>
          Quickly find what matters to you — templates, apps,
          AI automation, or pricing.
        </p>
      </section>

      {/* FILTER BAR */}
      <nav className="how-filter">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${
              activeFilter === filter ? 'active' : ''
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <section className="how-sections">

        {isVisible('Templates') && (
          <div className="how-card">
            <div className="icon"></div>
            <h2>Website Templates</h2>
            <p>
              Premium, customizable templates built for speed,
              scalability, and real businesses.
            </p>
            <ul>
              <li>Modern & responsive design</li>
              <li>SEO & performance optimized</li>
              <li>Easy customization</li>
              <li>One-time purchase</li>
            </ul>
            <button className="primary-btn">Browse Templates</button>
          </div>
        )}

        {isVisible('Applications') && (
          <div className="how-card">
            <div className="icon"></div>
            <h2>Applications</h2>
            <p>
              Fully built web applications ready to deploy
              or customize for your business.
            </p>
            <ul>
              <li>Admin dashboards</li>
              <li>Client portals</li>
              <li>Secure architecture</li>
              <li>Scalable backend</li>
            </ul>
            <button className="primary-btn">Explore Apps</button>
          </div>
        )}

        {isVisible('AI Automation') && (
          <div className="how-card">
            <div className="icon"></div>
            <h2>AI Automation</h2>
            <p>
              Intelligent automation that reduces workload
              and increases efficiency.
            </p>
            <ul>
              <li>AI workflows</li>
              <li>Chatbots & assistants</li>
              <li>Smart integrations</li>
              <li>Custom AI logic</li>
            </ul>
            <button className="primary-btn">View AI Solutions</button>
          </div>
        )}

        {isVisible('Pricing') && (
          <div className="how-card pricing">
            <div className="icon"></div>
            <h2>Pricing</h2>
            <p>
              Transparent pricing that scales with your needs.
            </p>
            <ul>
              <li>Templates: pay once</li>
              <li>Apps: flexible pricing</li>
              <li>AI: custom plans</li>
              <li>No hidden fees</li>
            </ul>
            <button className="secondary-btn">View Pricing</button>
          </div>
        )}

      </section>
    </main>
  );
}