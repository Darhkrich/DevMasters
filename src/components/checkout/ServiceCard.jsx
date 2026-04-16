// src/components/checkout/ServiceCard.jsx
'use client';

import { useState } from 'react';
import './servicecard.css';

export default function ServiceCard({ item, index, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  
  const getCategoryColor = (category) => {
    switch(category) {
      case 'ai': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'web': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'app': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      case 'template': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'ai-automation': return 'AI Automation';
      case 'web': return 'Web Development';
      case 'application': return 'Mobile App';
      case 'template': return 'Website Template';
      default: return category;
    }
  };

  return (
    <div className="chk-service">
      <div className="chk-service-header">
        <div className="chk-service-info">
          <div 
            className="chk-service-icon"
            style={{ background: getCategoryColor(item.category) }}
          >
            {item.icon ? (
              <i className={item.icon}></i>
            ) : (
              <span className="chk-service-icon-text">
                {item.category?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="chk-service-content">
            <div className="chk-service-meta">
              <span className="chk-service-category">
                {getCategoryLabel(item.category)}
              </span>
              <span className="chk-service-badge"></span>
            </div>
            
            <h4 className="chk-service-title">{item.title}</h4>
            <p className="chk-service-desc">{item.description}</p>
          </div>
        </div>
        
        <button
          onClick={onRemove}
          className="chk-service-remove"
          title="Remove service"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      {/* Features & Details */}
      <div className="chk-service-expand">
        <button
          onClick={() => setExpanded(!expanded)}
          className="chk-service-toggle"
        >
          <span>{expanded ? 'Show less' : 'Show details'}</span>
          <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
        </button>
        
        {expanded && (
          <div className="chk-service-details">
            {item.features && item.features.length > 0 && (
              <div className="chk-service-features">
                <h5 className="chk-service-features-title">Features:</h5>
                <ul className="chk-service-features-list">
                  {item.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="chk-service-feature">
                      <i className="fas fa-check"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {item.features.length > 3 && (
                    <li className="chk-service-feature-more">
                      +{item.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            {item.deliveryTime && (
              <div className="chk-service-delivery">
                <div className="chk-service-delivery-info">
                  <span className="chk-service-delivery-label">Delivery:</span>
                  <span className="chk-service-delivery-value">{item.deliveryTime}</span>
                </div>
                {item.requiresDocuments && (
                  <div className="chk-service-docs-badge">
                    Requires documents
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bottom Bar */}
      <div className="chk-service-footer">
        <div>
          {item.price ? (
            <div className="chk-service-price">
              {item.priceType === 'monthly' ? '$' + item.price + '/mo' : '$' + item.price}
            </div>
          ) : (
            <div className="chk-service-price-custom">Custom quote required</div>
          )}
        </div>
        
        {item.previewUrl && item.previewUrl !== '#' && (
          <a
            href={item.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="chk-service-preview"
          >
            <i className="fas fa-external-link-alt"></i>
            Preview
          </a>
        )}
      </div>
    </div>
  );
}