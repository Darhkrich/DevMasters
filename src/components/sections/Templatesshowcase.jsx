"use client";

import React from "react";
import Link from "next/link";
import "./templates-showcase.css"; 
import  {templatesData, APP_BLUEPRINTS, APP_SERVICES
}  from './templates';



const Templatesshowcase = () => {

  const INITIAL_VISIBLE_COUNT = 6;
   
  const showcaseTemplates = templatesData.slice(0,
    INITIAL_VISIBLE_COUNT
  );



  
  return (
    <main>
    <section className="wc-services-page wc-templates-page" id="templates">
      <div className="showcase-container">
        
        {/* Header */}
        <div className="wc-services-hero-text1">
          <h1>Premium Websites</h1>
          <p>
            Explore our collection of high-quality, fully responsive templates
            built to help you launch your project faster.
          </p>
        </div>

         {/* PRIMARY GRID */}
         <section className="wc-service-section wc-template-section">
        <div className="wc-templates-grid" id="templatesGrid">
          {templatesData.slice(0, ).map((tpl) => (
              <article
              key={tpl.id}
              className="wc-template-card"
              data-id={tpl.id}
              data-name={tpl.shortName}
              data-category={tpl.category.join(' ')}
              data-type={tpl.type}
              data-preview={tpl.previewUrl}
            >
              <div className="wc-template-thumb">
                <div>
                  <img src={tpl.image} alt={`${tpl.shortName} template preview`} />
                </div>
              </div>
              <div className="wc-template-body">
                <div className="wc-template-header">
                  <h3>{tpl.name}</h3>
                  <span className={`wc-template-tag ${tpl.badgeClass}`}>
                    {tpl.badge}
                  </span>
                </div>
                <p>{tpl.description}</p>
                <ul className="wc-template-meta">
                  <li><i className={tpl.icons[0]}></i> {tpl.tags[0]}</li>
                  <li><i className={tpl.icons[1]}></i> {tpl.tags[1]}</li>
                </ul>
                <div className="wc-template-footer">
                 
                  <div className="wc-template-actions">
                    <a
                      href={tpl.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wc-btn-ghost wc-btn-previewe"
                      style={{ position: 'relative', zIndex: 999, pointerEvents: 'auto' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fas fa-eye"></i> Preview
                    </a>
                    
                    {/* FIXED LINK - Use backticks and correct path */}
                    <Link href={`/services/templates/${tpl.id}`}>
                      <button
                        className="wc-btn-primary wc-btn-buys"
                        style={{ 
                          position: 'relative', 
                          zIndex: 999, 
                          pointerEvents: 'auto',
                          cursor: 'pointer' 
                        }}
                        data-template-id={tpl.id}
                      >
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
         <div className="applink">
                <Link href={'/services/templates'}>
                Website Services
                </Link>
                </div>
        </section>
      </div>
    </section>
    <section>

    </section>
 
    </main>
  );
};



export default Templatesshowcase;




