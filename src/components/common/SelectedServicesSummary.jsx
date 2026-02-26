// src/components/common/SelectedServicesSummary.jsx
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function SelectedServicesSummary() {
  const { cart, cartCount, getCartTotal, getCartByCategory } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [recentlyAdded, setRecentlyAdded] = useState(null);

  const total = getCartTotal();
  const categorizedCart = getCartByCategory();

  // Show notification when item is added
  useEffect(() => {
    const handleCartUpdated = (event) => {
      setRecentlyAdded(event.detail.item);
      setIsVisible(true);
      
      // Auto-hide the "recently added" message after 3 seconds
      setTimeout(() => {
        setRecentlyAdded(null);
      }, 3000);
    };

    const handleCartCleared = () => {
      setRecentlyAdded(null);
    };

    window.addEventListener('cartUpdated', handleCartUpdated);
    window.addEventListener('cartCleared', handleCartCleared);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
      window.removeEventListener('cartCleared', handleCartCleared);
    };
  }, []);

  // Calculate category counts
  const categoryCounts = {
    web: categorizedCart['web']?.length || 0,
    app: categorizedCart['app']?.length || 0,
    ai: categorizedCart['ai']?.length || 0,
    template: categorizedCart['template']?.length || 0,
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'web': return 'Websites';
      case 'app': return 'Apps';
      case 'ai': return 'AI Automation';
      case 'template': return 'Templates';
      default: return category;
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'web': return 'fas fa-globe';
      case 'app': return 'fas fa-mobile-alt';
      case 'ai': return 'fas fa-robot';
      case 'template': return 'fas fa-layer-group';
      default: return 'fas fa-cube';
    }
  };

  if (cartCount === 0) {
    return (
      <div className="wc-services-summary wc-services-summary-empty">
        <div className="wc-summary-header">
          <div className="wc-summary-title">
            <i className="fas fa-shopping-cart"></i>
            Request
          </div>
        
        </div>
        
      
        
       
      </div>
    );
  }

  return (
    <div className={`wc-services-summary ${recentlyAdded ? 'wc-services-summary-highlight' : ''}`}>
      <div className="wc-summary-header">
        <div className="wc-summary-title">
          <i className="fas fa-shopping-cart"></i>
          
          <span className="wc-summary-count"> {cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
        </div>
        {/* Summary Footer */}
          
      </div>


     
    </div>
  );
}