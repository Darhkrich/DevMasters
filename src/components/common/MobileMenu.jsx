"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SelectedServicesSummary from '@/components/common/SelectedServicesSummary';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Lock scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mm-topbar">
        <Link href="/" className="mm-logo">
          DevMasters
        </Link>
      
  <ul className="dc-navbar__links">
    <li>  <Link href={'/Checkout'}>
        <SelectedServicesSummary /></Link></li>
  </ul>
        <button
          className={`mm-toggle ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`mm-overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Menu Panel */}
      <aside className={`mm-panel ${open ? "open" : ""}`}>
        <nav className="mm-nav">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/how-it-work" onClick={() => setOpen(false)}>How It Works</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
        </nav>

        <div className="mm-actions">
          <Link
            href="/login"
            className="mm-btn mm-btn--ghost"
            onClick={() => setOpen(false)}
          >
            Client Portal
          </Link>

          <Link
            href="/register"
            className="mm-btn mm-btn--primary"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </aside>
    </>
  );
}