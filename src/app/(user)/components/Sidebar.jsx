"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard" },
    { name: "Project", href: "/dashboard/project" },
    { name: "Pricing", href: "/dashboard/pricing" },
    { name: "Checkout", href: "/dashboard/checkout" },
    { name: "Files Upload", href: "/dashboard/files-upload" },
    { name: "Messages", href: "/dashboard/messages" },
    { name: "Billing", href: "/dashboard/billing" },
    { name: "Progress", href: "/dashboard/progress" },
    { name: "Support", href: "/dashboard/support" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar__header">
        <h2>Dashboard</h2>
      </div>

      <nav className="dashboard-sidebar__nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dashboard-sidebar__link ${
                isActive ? "active" : ""
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}