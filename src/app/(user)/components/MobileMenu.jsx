'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaHome, FaBox, FaEnvelope, FaUpload, FaHeadset, FaCog } from 'react-icons/fa';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: <FaHome /> },

  { name: 'Project Progress', path: '/dashboard/Project-progress', icon: <FaBox /> },
  { name: 'Messages', path: '/dashboard/Messages', icon: <FaEnvelope /> },
  { name: 'FileUpload', path: '/dashboard/UploadFile', icon: <FaUpload /> },
  { name: 'Support', path: '/dashboard/Support', icon: <FaHeadset /> },
  { name: 'Settings', path: '/dashboard/Settings', icon: <FaCog /> },
  { name: 'Notifications', path: '/dashboard/notifications', icon: <FaCog /> },


];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile header with hamburger */}
      <header className="mobile-header">
        <button 
          className="hamburger" 
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
        <div className="mobile-logo">Dashboard</div>

   {/* Mobile Top Bar */}
      <div className="return">
        <Link href="/" className="aa-logo">
          DevMasters
        </Link>
        </div>
      </header>

      {/* Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span>Dashboard</span>
          <button 
            className="close-btn" 
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="drawer-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-link ${pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="drawer-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
    </>
  );
}
