"use client";
import SelectedServicesSummary from '@/components/common/SelectedServicesSummary';
import Link from "next/link";
export default function Navbar() {
  return (
    <header className="dc-navbar">
      <div className="dc-navbar__container">
        {/* Logo */}
        <div className="dc-navbar__logo">
          <Link href="/">DevMasters</Link>
        </div>

        {/* Links */}
        <ul className="dc-navbar__links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/packages">Packages</Link></li>
          <li><Link href="/how-it-work">How It Works</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li> <Link href={'/Checkout'}><SelectedServicesSummary /> </Link></li>
        </ul>

        {/* Actions */}
        <div className="dc-navbar__actions">
          <Link href="/login" className="dc-btn dc-btn--ghost">
            Client Portal
          </Link>

          <Link href="/register" className="dc-btn dc-btn--primary">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}