

"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import '@/styles/Navbar.css';
import SelectedServicesSummary from '@/components/common/SelectedServicesSummary';


export default function DevMastersNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Packages", href: "/packages" },
    { name: "How It Works", href: "/how-it-work" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <header className="dm-nav">
      <div className="dm-nav__inner">
        
        {/* Logo */}
        <div className="dm-nav__logo">
          <Link href="/">DevMasters</Link>
        </div>

        {/* Desktop Links */}
        <nav className="dm-nav__links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`dm-nav__link ${
                isActive(link.href) ? "active" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
                    <li> <Link href={'/Checkout'}><SelectedServicesSummary /> </Link></li>
        </nav>

        {/* Actions */}
        <div className="dm-nav__actions">


          <Link href="/dashboard" className="dm-btn dm-btn--ghost">
            Client Portal
          </Link>

          <Link href="/register" className="dm-btn dm-btn--primary">
            Get Started
          </Link>
        </div>

        {/* Hamburger */}
                  <li> <Link href={'/Checkout'}><SelectedServicesSummary /> </Link></li>
        <button
          className={`dm-nav__hamburger ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>

      {/* Mobile Menu */}
      <div className={`dm-nav__mobile ${open ? "show" : ""}`}>
        
        <div className="dm-nav__mobile-content">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`dm-nav__mobile-link ${
                isActive(link.href) ? "active" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="dm-nav__mobile-actions">
            <Link href="/dashboard" className="dm-btn dm-btn--ghost">
              Client Portal
            </Link>

            <Link href="/register" className="dm-btn dm-btn--primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}