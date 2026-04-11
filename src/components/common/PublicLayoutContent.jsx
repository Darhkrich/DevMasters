'use client';

import { usePathname } from 'next/navigation';

export default function PublicLayoutContent({ children }) {
  const pathname = usePathname();

  return <main key={pathname}>{children}</main>;
}
