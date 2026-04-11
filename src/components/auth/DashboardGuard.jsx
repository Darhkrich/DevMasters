'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { clearSession, fetchCurrentUser, getStoredUser } from '@/lib/boemApi';

function getLoginRoute(requireAdmin) {
  return requireAdmin ? '/admin-login' : '/login';
}

function isAllowedStaffAdminPath(pathname) {
  return (
    pathname === '/dashboard-admin'
    || pathname.startsWith('/dashboard-admin/workspace')
    || pathname.startsWith('/dashboard-admin/Settings')
  );
}

export default function DashboardGuard({ children, requireAdmin = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function validateSession() {
      const storedUser = getStoredUser();
      if (!storedUser) {
        clearSession();
        router.replace(getLoginRoute(requireAdmin));
        return;
      }

      try {
        const user = await fetchCurrentUser();
        if (!isActive) return;

        if (requireAdmin && !user.is_staff) {
          clearSession();
          router.replace('/admin-login');
          return;
        }

        if (
          requireAdmin
          && user.is_staff
          && !user.can_manage_staff_workspace
          && !isAllowedStaffAdminPath(pathname)
        ) {
          router.replace('/dashboard-admin/workspace');
          return;
        }

        if (!requireAdmin && user.is_staff && pathname === '/dashboard') {
          router.replace('/dashboard-admin');
          return;
        }

        setChecking(false);
      } catch (error) {
        clearSession();
        if (isActive) {
          router.replace(getLoginRoute(requireAdmin));
        }
      }
    }

    validateSession();

    return () => {
      isActive = false;
    };
  }, [pathname, requireAdmin, router]);

  if (checking) {
    return <div style={{ padding: '2rem' }}>Checking your session...</div>;
  }

  return children;
}
