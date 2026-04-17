"use client";
import { useState } from "react";
import Link from "next/link";
import '@/styles/Navbar.css';
export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    "Home",
    "Services",
    "Packages",
    "How It Works",
    "Contact",
    "Client Portal",
  ];

  return (
    <header className="nav">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">DevMasters</div>

        {/* Desktop Nav */}
        <nav className="nav-links">
          {navLinks.map((link) => (
            <Link key={link} href="#" className="nav-link">
              {link}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="nav-cta">
          <button className="btn-primary">Get Started</button>
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${open ? "show" : ""}`}>
        {navLinks.map((link) => (
          <Link key={link} href="#" className="mobile-link">
            {link}
          </Link>
        ))}
        <button className="btn-primary mobile-btn">Get Started</button>
      </div>
    </header>
  );
}