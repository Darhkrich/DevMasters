
"use client";

import { useState } from "react";
import Link from "next/link";
import { getServicesByType, getServicesByCategory } from "./templates";
import '@/styles/apps.css';
import AddToQuoteButton from '@/components/common/AddToQuoteButton';

// Service Card Component
function ServiceCard({ service }) {
  return (
    <div className="service-card wc-accent-left">
      <div className="service-card-header1">
        <i className={service.icon}></i>
        {service.tag && <span className="service-tag">{service.tag}</span>}
      </div>
      <div className="service-card-body">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <ul className="wc-service-meta">
          {service.meta?.map((m, i) => (
            <li key={i}>
              <i className={m.icon}></i> {m.text}
            </li>
          ))}
        </ul>
       
      </div>
      <div className="service-card-actions">
        <Link href={`/services/application/${service.id}`} className="wc-btn-secondary">
          View Details
        </Link>
         {/* FIXED: Changed 'service' to 'template' and 'source' to 'templates' */}
        <AddToQuoteButton 
           item={service} 
          source="templates" 
           className="wc-btn-secondary wc-btn-large"
          />
      </div>
    </div>
  );
}



// Main Page Component
export default function AppsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredServices = getServicesByType(activeFilter);
  const blueprints = getServicesByCategory('blueprint');

  return (
    <main className="wc-services-page wc-apps-page">
    
<header className="wc-service-section-header">
          <div>
            <h2>Ready-Made App Blueprints</h2>
            
          </div>
   
        </header>
      
  


      {/* SERVICES GRID */}
      <section className="wc-service-section">
        <div className="wc-service-cards wc-apps-cards">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="applink">
          <Link href={'/services/application'}>
          Application Services
          </Link>
          </div>
      </section>

      

    </main>
  );
}




















      