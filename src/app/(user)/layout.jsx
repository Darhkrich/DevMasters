// app/(user)/layout.jsx
'use client';

import Sidebar from './components/Sidebar';
import MobileMenu from './components/MobileMenu';
import './components/sidebar.css';
import UserLayoutContent from './components/UserLayoutContent';
import './styles.css';
// Preload all dashboard page CSS so layout renders correctly on client navigation


import NotificationBell from '@/components/NotificationBell';
import DashboardGuard from '@/components/auth/DashboardGuard';


export default function UserLayout({ children }) {
  return (
    <DashboardGuard>
      <div className="dashboard-container">
        <Sidebar />
        <MobileMenu />
        <NotificationBell />
        <UserLayoutContent>{children}</UserLayoutContent>
      </div>
    </DashboardGuard>
  );
}


