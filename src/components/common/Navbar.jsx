"use client";
import '@/styles/Navbar.css';
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function DevMastersNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();

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

        {/* LOGO */}
        <div className="dm-nav__logo">
          <Link href="/">DevMasters</Link>
        </div>

        {/* DESKTOP LINKS */}
        <nav className="dm-nav__links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`dm-nav__link ${isActive(link.href) ? "active" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE (IMPORTANT FIX) */}
        <div className="dm-nav__right">

          {/* QUOTE / CART (ALWAYS VISIBLE) */}
          <Link href="/Checkout" className="dm-cart">
            <span className="dm-cart__icon">🧾</span>
            {cartCount > 0 && (
              <span className="dm-cart__badge">{cartCount}</span>
            )}
          </Link>

          {/* DESKTOP ACTIONS */}
          <div className="dm-nav__actions">
            <Link href="/dashboard" className="dm-btn dm-btn--ghost">
              Client Portal
            </Link>

            <Link href="/register" className="dm-btn dm-btn--primary">
              Get Started
            </Link>
          </div>

          {/* HAMBURGER */}
          <button
            className={`dm-nav__hamburger ${open ? "active" : ""}`}
            onClick={() => setOpen(!open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
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

          {/* QUOTE (MOBILE) */}
          <Link
            href="/Checkout"
            className="dm-cart dm-cart--mobile"
            onClick={() => setOpen(false)}
          >
            <span>🧾</span>
            <span>Your Quote ({cartCount})</span>
          </Link>

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