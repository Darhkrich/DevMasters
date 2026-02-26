import TiltScriptLoader from '@/components/common/TiltscriptLoader';
import PublicLayoutContent from '@/components/common/PublicLayoutContent';

import '@/styles/publics.css';
// Import critical page CSS in layout so it loads before first paint on client navigation
import Navbar from '@/components/common/Navbar';
import MobileMenu from '@/components/common/MobileMenu';
import Footer from '@/components/common/Footer';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <MobileMenu />
      <PublicLayoutContent>{children}</PublicLayoutContent>
      <TiltScriptLoader />
      <Footer />
    </>
  );
}