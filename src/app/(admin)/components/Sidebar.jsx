'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './sidebar.css';

const Sidebar = () => {
  const pathname = usePathname();
  
  // Navigation items with their respective routes
  const navItems = [
    { id: 1, name: 'Dashboard', icon: '📊', href: '/dashboard' },
    { id: 2, name: 'Orders', icon: '📦', href: '/orders' },
    { id: 3, name: 'Templates', icon: '🎨', href: '/templates' },
    { id: 4, name: 'Clients', icon: '👥', href: '/clients' },
    { id: 5, name: 'Team', icon: '👨‍💼', href: '/team' },
    { id: 6, name: 'Settings', icon: '⚙', href: '/settings' },
  ];

  return (
    <nav className="sidebar">
      <div className="logo">
        <h2>Admin Panel</h2>
      </div>
      <ul className="nav-links">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <li 
              key={item.id} 
              className={isActive ? 'active' : ''}
            >
              <Link href={item.href}>
                <span>{item.icon}</span> {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;