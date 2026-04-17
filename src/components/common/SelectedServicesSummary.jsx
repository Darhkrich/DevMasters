'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

const emptySubscribe = () => () => {};

export default function SelectedServicesSummary() {
  const { cart, cartCount, getCartTotal, getCartByCategory } = useCart();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isVisible, setIsVisible] = useState(true);
  const [recentlyAdded, setRecentlyAdded] = useState(null);

  const total = getCartTotal();
  const categorizedCart = getCartByCategory();

  useEffect(() => {
    const handleCartUpdated = (event) => {
      setRecentlyAdded(event.detail.item);
      setIsVisible(true);

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

  const categoryCounts = {
    web: categorizedCart.web?.length || 0,
    app: categorizedCart.app?.length || 0,
    ai: categorizedCart.ai?.length || 0,
    template: categorizedCart.template?.length || 0,
  };

 

 
  if (!mounted || cartCount === 0) {
    return (
      <div className="wc-services-summary wc-services-summary-empty">
        <div className="wc-summary-header">
          <div className="wc-summary-title">
            <i className="fas fa-shopping-cart"></i>
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
          <span className="wc-summary-count">
            {' '}
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

   

     
    </div>
  );
}
