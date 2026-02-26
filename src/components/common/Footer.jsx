import Link from "next/link";

export default function Footer() {
  return (
    <footer className="pf-footer">
      <div className="pf-footer__container">
        <div className="pf-footer__content">
          
          {/* Brand */}
          <div className="pf-footer__section">
            <h3 className="pf-footer__logo">DevMasters</h3>
            <p className="pf-footer__description">
              Beautiful websites, apps, and AI automation — built fast
              without technical complexity.
            </p>

            <div className="pf-footer__socials">
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
            </div>
          </div>

          {/* Navigation */}
          <div className="pf-footer__section">
            <h4>Navigation</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/pricing">Packages</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="pf-footer__section">
            <h4>Support</h4>
            <ul>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="pf-footer__bottom">
          <p>© 2026 DevMasters. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}