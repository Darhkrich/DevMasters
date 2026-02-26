// src/components/checkout/ServiceCard.jsx
'use client';

import { useState } from 'react';

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
    <div className="service-card">
      <div className="service-card-header">
        <div className="flex items-start gap-3">
          <div 
            className="service-icon"
            style={{ background: getCategoryColor(item.category) }}
          >
            {item.icon ? (
              <i className={item.icon}></i>
            ) : (
              <span className="font-bold text-sm">
                {item.category?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="service-category">
                {getCategoryLabel(item.category)}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                
              </span>
            </div>
            
            <h4 className="service-title">{item.title}</h4>
            <p className="service-description">
              {item.description}
            </p>
          </div>
        </div>
        
        <button
          onClick={onRemove}
          className="remove-service-btn"
          title="Remove service"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      {/* Features & Details */}
      <div className="mt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="service-details-toggle"
        >
          <span>{expanded ? 'Show less' : 'Show details'}</span>
          <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-xs`}></i>
        </button>
        
        {expanded && (
          <div className="mt-3 space-y-3 animate-fadeIn">
            {item.features && item.features.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">Features:</h5>
                <ul className="space-y-1">
                  {item.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="service-feature">
                      <i className="fas fa-check text-green-500 mt-0.5"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {item.features.length > 3 && (
                    <li className="text-xs text-gray-500">
                      +{item.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            {item.deliveryTime && (
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Delivery:</span>
                  <span className="ml-2 font-medium">{item.deliveryTime}</span>
                </div>
                {item.requiresDocuments && (
                  <div className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-xs">
                    Requires documents
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bottom Bar */}
      <div className="service-footer">
        <div>
          {item.price ? (
            <div className="service-price">
              {item.priceType === 'monthly' ? '$' + item.price + '/mo' : '$' + item.price}
            </div>
          ) : (
            <div className="text-gray-400 italic">Custom quote required</div>
          )}
        </div>
        
        {item.previewUrl && item.previewUrl !== '#' && (
          <a
            href={item.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <i className="fas fa-external-link-alt mr-1"></i>
            Preview
          </a>
        )}
      </div>
    </div>
  );
}