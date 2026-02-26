"use client";
import "@/styles/services.css";
import { useState, useMemo } from "react";
import Link from 'next/link';
import { aiAutomations, aiBundles, sectors } from "./templates";

export default function AIAutomationPage() {
  const [activeSector, setActiveSector] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter automations based on sector and search
  const filteredAutomations = useMemo(() => {
    return aiAutomations.filter(automation => {
      const matchesSector = activeSector === "all" || automation.sector === activeSector;
      const matchesSearch = 
        searchQuery === "" || 
        automation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        automation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        automation.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSector && matchesSearch;
    });
  }, [activeSector, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <main className="wc-services-page wc-ai-page">

      


      {/* AUTOMATIONS GRID */}
      <section className="wc-service-section wc-ai-section">
        <header className="wc-service-section-header">
          <div>
            <h2>AI Automation Solutions</h2>
        
          </div>
        
        </header>

        <div className="wc-ai-automations-grid">
          {filteredAutomations.map(automation => (
            <article key={automation.id} className="wc-ai-automation-card">
              <div className="wc-ai-automation-header">
                <div className="wc-ai-automation-icon">
                  <i className={automation.icon}></i>
                </div>
                <div className="wc-ai-automation-badge">
                  <span className={`wc-sector-badge wc-sector-${automation.sector}`}>
                    {automation.sector.replace("-", " ")}
                  </span>
                </div>
              </div>
              
              <div className="wc-ai-automation-body">
                <h3>{automation.title}</h3>
                <p>{automation.description}</p>
                
                <div className="wc-ai-automation-features">
                  <h4>Key Features:</h4>
                  <ul>
                    {automation.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check-circle" /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="wc-ai-automation-meta">
                  
                  <div className="wc-ai-automation-delivery">
                    <i className="fas fa-clock"></i>
                    <span>{automation.deliveryTime} setup</span>
                  </div>
                </div>
              </div>
              
              <div className="wc-ai-automation-footer">
                <div className="wc-ai-automation-actions">
                  <Link 
                    href={`/services/ai-automation/${automation.id}`}
                    className="wc-btn-primary wc-btn-view-details"
                  >
                    <i className="fas fa-eye"></i> View Details
                  </Link>
                  <Link 
                    href={`/contact?automation=${automation.id}`}
                    className="wc-btn-ghost wc-btn-customize"
                  >
                    <i className="fas fa-cog"></i> Customize
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
   <div className="applink">
          <Link href={'/services/ai-automation'}>
          AI Automation Services
          </Link>
          </div>
      
      </section>

    


    </main>
  );
}
