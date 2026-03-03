import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ✅ App Router hook
;
import './sidebar.css';

const navItems = [
  { name: 'Overview', path: '/dashboard', },
  { name: 'Project', path: '/dashboard/Project', },
  { name: 'Package', path: '/dashboard/package',},
  { name: 'Messages', path: '/dashboard/Messages', },
  { name: 'FileUpload', path: '/dashboard/UploadFile', },
  { name: 'Support', path: '/dashboard/Support', },
  { name: 'Settings', path: '/dashboard/Settings', },
  { name: 'Profile', path: '/dashboard/Profile', },
];

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // ✅ get current path

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]); // ✅ dependency on pathname

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <div className="dashboard-layout">
      {/* Mobile header with hamburger */}
      <header className="mobile-header">
        <button 
          className="hamburger" 
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
     
        </button>
        <div className="mobile-logo">Dashboard</div>
      </header>

      {/* Desktop sidebar (always visible) */}
      <aside className="desktop-sidebar">
        <div className="sidebar-header">Dashboard</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-link ${pathname === item.path ? 'active' : ''}`} // ✅ active class using pathname
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span>Dashboard</span>
          <button 
            className="close-btn" 
            onClick={() => setIsMobileMenuOpen(false)}
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
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay when mobile drawer is open */}
      {isMobileMenuOpen && (
        <div 
          className="drawer-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}