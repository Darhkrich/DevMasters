/* eslint-disable @next/next/no-img-element */
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
    <main className="sp3__wc-services-page sp3__wc-templates-page">

      {/* HERO */}
      <section className="sp3__wc-services-hero sp3__wc-templates-hero">
        <div className="sp3__wc-services-hero-text">
          
          <h1>Launch fast with Websites built to sell.</h1>
          <p>
            Pick a ready-made website or choose a Customizable Website and launch TODAY.
 
          </p>
        </div>

        <div className="sp3__wc-services-hero-demo">
          
            
          
        </div>
      </section>

      
     

      {/* TEMPLATES GRID */}
      <section className="sp3__wc-service-section sp3__wc-templates-section">
       

        {/* PRIMARY GRID */}
        <div className="sp3__wc-templates-grid" id="templatesGrid">
          {templatesData.slice(0, ).map((tpl) => (
            <article
              key={tpl.id}
              className="sp3__wc-template-card"
              data-id={tpl.id}
              data-name={tpl.shortName}
              data-category={tpl.category.join(' ')}
              data-type={tpl.type}
              data-preview={tpl.previewUrl}
            >
              <div className="sp3__wc-template-thumb">
                <div>
                  <img src={tpl.image} alt={`${tpl.shortName} template preview`} />
                </div>
              </div>
              <div className="sp3__wc-template-body">
                <div className="sp3__wc-template-header">
                  <h3>{tpl.name}</h3>
                  <span className={`sp3__wc-template-tag ${tpl.badgeClass}`}>
                    {tpl.badge}
                  </span>
                </div>
                <p>{tpl.description}</p>
                <ul className="sp3__wc-template-meta">
                  <li><i className={tpl.icons[0]}></i> {tpl.tags[0]}</li>
                  <li><i className={tpl.icons[1]}></i> {tpl.tags[1]}</li>
                </ul>
                <div className="sp3__wc-template-footer">
                  <div className="sp3__wc-template-price">
                    <span className="sp3__wc-price-main">{tpl.price}</span>
                    <span className="sp3__wc-price-note">{tpl.priceNote}</span>
                  </div>
                  <div className="sp3__wc-template-actions">
                    <a
                      href={tpl.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sp3__wc-btn-ghost sp3__wc-btn-previewe"
                      style={{ position: 'relative', zIndex: 999, pointerEvents: 'auto' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fas fa-eye"></i> Preview
                    </a>
                    
                    {/* FIXED LINK - Use backticks and correct path */}
                    <Link href={`/services/templates/${tpl.id}`}>
                      <button
                        className="sp3__wc-btn-primary sp3__wc-btn-buys"
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
    </main>
  );
};



export default Templatesshowcase;



