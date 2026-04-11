'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaUsers, FaEnvelope, 
  FaCog, FaHeadset, FaShoppingCart, FaFileSignature, 
  FaFolderOpen, FaBars, FaTimes, FaTasks, FaUserCog
} from 'react-icons/fa';
import { getStoredUser } from '@/lib/boemApi';
import './MobileMenu.css'; // adjust path

const managerNavItems = [
  { name: 'Dashboard-Overview', path: '/dashboard-admin', icon: <FaHeadset /> },
  { name: 'Team-Control', path: '/dashboard-admin/team', icon: <FaUserCog /> },
  { name: 'My-Workspace', path: '/dashboard-admin/workspace', icon: <FaTasks /> },
  { name: 'Orders', path: '/dashboard-admin/orders', icon: <FaShoppingCart /> },
  { name: 'Inquiries', path: '/dashboard-admin/inquiries', icon: <FaFileSignature /> },
  { name: 'Clients', path: '/dashboard-admin/clients', icon: <FaUsers /> },
  { name: 'Messages', path: '/dashboard-admin/Messages', icon: <FaEnvelope /> },

  { name: 'Automation-sevices', path: '/dashboard-admin/automation', icon: <FaCog /> },
  { name: 'Pricing-Packages', path: '/dashboard-admin/pricing', icon: <FaHeadset /> },
  { name: 'Websites-Templates', path: '/dashboard-admin/templates', icon: <FaCog /> },
  { name: 'Applications-Services', path: '/dashboard-admin/services', icon: <FaHeadset /> },

  { name: 'Files-Receive', path: '/dashboard-admin/FilesReceive', icon: <FaFolderOpen /> },
 

  { name: 'Settings', path: '/dashboard-admin/Settings', icon: <FaCog /> },
  { name: 'Support', path: '/dashboard-admin/Support', icon: <FaHeadset /> },
  { name: 'Notifications', path: '/dashboard-admin/notifications', icon: <FaHeadset /> },
 
];

const staffNavItems = [
  { name: 'Dashboard-Overview', path: '/dashboard-admin', icon: <FaHeadset /> },
  { name: 'My-Workspace', path: '/dashboard-admin/workspace', icon: <FaTasks /> },
  { name: 'Settings', path: '/dashboard-admin/Settings', icon: <FaCog /> },
];

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const currentUser = getStoredUser();
  const navItems = currentUser?.can_manage_staff_workspace ? managerNavItems : staffNavItems;

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile header with hamburger */}
      <header className="admin-mobile-header">
        <button
          className="admin-hamburger"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
        <div className="admin-mobile-logo">Admin Panel</div>
      </header>

      {/* Desktop sidebar */}
      <aside className="admin-desktop-sidebar">
        <div className="admin-sidebar-header">Admin Panel</div>
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`admin-nav-link ${pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="admin-icon">{item.icon}</span>
              <span className="admin-label">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile drawer */}
      <div className={`admin-mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-drawer-header">
          <span>Admin Panel</span>
          <button
            className="admin-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="admin-drawer-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`admin-nav-link ${pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-icon">{item.icon}</span>
              <span className="admin-label">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="admin-drawer-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

