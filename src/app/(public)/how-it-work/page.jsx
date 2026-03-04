'use client';
import Link from 'next/link';
import { useState } from 'react';
import './how-it-work.css';

const FILTERS = [
  'All',
  'Websites',
  'Applications',
  'AI Automation',
  'Packages',
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

      {isVisible('Websites') && (
          <div className="how-card">
            <div className="icon"></div>
            <h2>For Ready-made Websites</h2>
           
            <ul>
              <li>Choose from Over 30+ industry-specific ready-made website templates
              </li>
              <li>Go to the packages section and choose plan that suits your needs</li>
              <li>Go to the Checkout/Qoute page, fill in the required details and submit the form</li>
              <li>A Staff member will contact you for additional information and assist you with any form of help</li>
                <li>For Ready-made websites it usally takes less than 24 hours to setup</li>
                 <li>We also build websites from scratch just contact us for what you need</li>
            </ul>
                 <Link href="/services/templates">
            <button className="primary-btn">Browse Templates</button>
            </Link>
          </div>
        )}


        {isVisible('Websites') && (
          <div className="how-card">
            <div className="icon"></div>
            <h2>For Customizable Website</h2>
        
            <ul>
              <li>Choose from our Customizable website templates
              </li>
                <li>Go to the packages section and choose from avialiable plans or build your plan that suits your needs</li>
                <li>Go to the Checkout/Qoute page, fill in the required details and submit the form</li>
              <li>A Staff member will contact you for additional information and assist you with any form of help</li>
                <li>For Customize websites readyness depends on complexity and customization needs</li>
                <li>We also build websites from scratch just contact us for what you need</li>
         
            </ul>
            <Link href="/services/templates">
            <button className="primary-btn">Browse Templates</button>
            </Link>
          </div>
        )}

      

        {isVisible('Applications') && (
          <div className="how-card">
            <div className="icon"></div>
            <h2>Applications</h2>
           
            <ul>
              <li>For Applications checkout our appplication category to see if what you whant is in our list</li>
              <li></li>
              <li>Go through our application plan package which you can choose from or build your own plan</li>
              <li>Create an account and get access to your dashboard</li>

            </ul>
                 <Link href="/services/application">
            <button className="primary-btn">Explore Apps</button>
            </Link>
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
              <li>Choose from our available AI automation solutions or tell us what you need</li>
              <li>visit the packages section to see available AI automation packages</li>
              
              
            </ul>
            <Link href="/services/ai-automation">
              <button className="primary-btn">View AI Solutions</button>
            </Link>
          </div>
        )}

        {isVisible('Packages') && (
          <div className="how-card pricing">
            <div className="icon"></div>
            <h2>Packages</h2>
            <p>
              Transparent packages that scales with your needs.
            </p>
            <ul>
              <li>See our available packages</li>
              <li>choose from our available packages or customize your own</li>
              <li> flexible pricing</li>
            <li>only pay for what you need</li>
            <li>Only One-time payment or Monthly-payment</li>
            <li>For customize packages, we have a dedicated teams to assist you</li>
            
              <li>No hidden fees</li>
            </ul>
                 <Link href="packages">
            <button className="secondary-btn">View Packages</button>
            </Link>
          </div>
        )}

      </section>
    </main>
  );
}