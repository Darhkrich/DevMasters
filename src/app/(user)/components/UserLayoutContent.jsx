'use client';

import { usePathname } from 'next/navigation';

/**
 * Wraps dashboard content with pathname key for clean remount on route change.
 */
export default function UserLayoutContent({ children }) {
  const pathname = usePathname();
  return (
    <div className="user-main-content" key={pathname}>
      {children}
    </div>
  );
}
