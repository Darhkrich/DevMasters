import Sidebar from './components/Sidebar';
import MobileMenu from './components/MobileMenu';
export default function Layout({ children }) {
  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Menu - Hidden on desktop */}
      <div className="block lg:hidden">
        <MobileMenu />
      </div>
      
      <main>
        {children}
      </main>
    </>
  );
}