// app/(user)/layout.jsx
'use client';

import Sidebar from './components/Sidebar';
import MobileMenu from './components/MobileMenu';
import './components/sidebar.css';
import UserLayoutContent from './components/UserLayoutContent';
import './styles.css';
// Preload all dashboard page CSS so layout renders correctly on client navigation
import './dashboard/dashboard.css';
import './dashboard/dashboardProject/dashboardproject.css';

import './dashboard/UploadFile/upload.css';
import './dashboard/Settings/setting.css';
import './dashboard/Messages/message.css';
import './dashboard/Support/styles.css';
import './dashboard/Project-progress/styles.css';


export default function UserLayout({ children }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <MobileMenu />
      <UserLayoutContent>{children}</UserLayoutContent>
    </div>
  );
}