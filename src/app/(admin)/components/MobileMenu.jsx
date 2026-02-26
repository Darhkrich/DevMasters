'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './MobileMenu.css';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const navItems = [
    { id: 1, name: 'Dashboard', icon: '📊', href: '/dashboard' },
    { id: 2, name: 'Orders', icon: '📦', href: '/orders' },
    { id: 3, name: 'Templates', icon: '🎨', href: '/templates' },
    { id: 4, name: 'Clients', icon: '👥', href: '/clients' },
    { id: 5, name: 'Team', icon: '👨‍💼', href: '/team' },
    { id: 6, name: 'Settings', icon: '⚙', href: '/settings' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <div className={`hamburger ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Menu Container */}
      <nav className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo">
            <h2>Admin Panel</h2>
          </div>
          <button 
            className="mobile-menu-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <span>✕</span>
          </button>
        </div>

        <ul className="mobile-nav-links">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <li 
                key={item.id} 
                className={isActive ? 'active' : ''}
                onClick={closeMenu}
              >
                <Link href={item.href}>
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-text">{item.name}</span>
                  {isActive && (
                    <span className="mobile-nav-indicator">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <circle cx="4" cy="4" r="4" fill="currentColor" />
                      </svg>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom Safe Area for iOS */}
        <div className="mobile-menu-safe-area" />
      </nav>
    </>
  );
};

export default MobileMenu;