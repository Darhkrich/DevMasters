
import MobileMenu from './components/MobileMenu';
import DashboardGuard from '@/components/auth/DashboardGuard';
export default function Layout({ children }) {
  return (
    <DashboardGuard requireAdmin>
      <>
       
        {/* Mobile Menu - Hidden on desktop */}
        <div className="block lg:hidden">
          <MobileMenu />
        </div>
        
        <main>
          {children}
        </main>
      </>
    </DashboardGuard>
  );
}
