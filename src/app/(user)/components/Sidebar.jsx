'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, FaProjectDiagram, FaBox, FaEnvelope, 
  FaUpload, FaHeadset, FaCog, FaUser 
} from 'react-icons/fa';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: <FaHome /> },
  { name: 'Project', path: '/dashboard/Project', icon: <FaProjectDiagram /> },
  { name: 'Package', path: '/dashboard/Project-progress', icon: <FaBox /> },
  { name: 'Messages', path: '/dashboard/Messages', icon: <FaEnvelope /> },
  { name: 'FileUpload', path: '/dashboard/UploadFile', icon: <FaUpload /> },
  { name: 'Support', path: '/dashboard/Support', icon: <FaHeadset /> },
  { name: 'Settings', path: '/dashboard/Settings', icon: <FaCog /> },

];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <>
    
    <aside className="desktop-sidebar">

<div className="returns">
        <Link href="/" className="aa-logo">
          DevMasters
        </Link>
        </div>

      <div className="sidebar-header">Dashboard</div>
      <nav className="sidebar-nav">
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
    </aside>

      
        </>
  );
}