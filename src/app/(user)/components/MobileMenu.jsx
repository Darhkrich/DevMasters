"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./MobileMenu.css";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: "fas fa-home" },
  { label: "Project", href: "/dashboard/project", icon: "fas fa-folder" },
  { label: "Pricing", href: "/dashboard/pricing", icon: "fas fa-tag" },
  { label: "Checkout", href: "/dashboard/checkout", icon: "fas fa-credit-card" },
  { label: "Progress", href: "/dashboard/progress", icon: "fas fa-chart-line" },
  { label: "Files", href: "/dashboard/files-upload", icon: "fas fa-upload" },
  { label: "Messages", href: "/dashboard/messages", icon: "fas fa-comments" },
  { label: "Billing", href: "/dashboard/billing", icon: "fas fa-file-invoice" },
  { label: "Support", href: "/dashboard/support", icon: "fas fa-life-ring" },
  { label: "Settings", href: "/dashboard/settings", icon: "fas fa-cog" }
];

export default function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="mobile-header mobile-only">
        <button
          className="hamburger-btn"
          onClick={() => setOpen(true)}
        >
          <i className="fas fa-bars"></i>
        </button>
        <span className="mobile-brand">YourBrand</span>
      </header>

      {open && (
        <>
          <div className="mobile-overlay" onClick={() => setOpen(false)} />

          <aside className="mobile-sidebar">
            <div className="mobile-sidebar-header">
              <span>YourBrand</span>
              <button onClick={() => setOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <nav className="sidebar-nav">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`sidebar-link ${
                    pathname === item.href ? "active" : ""
                  }`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}