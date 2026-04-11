import Image from "next/image";
import TemplatesShowcase from "@/components/sections/Templatesshowcase";
import '@/styles/public.css';
import Link from "next/link"
import FeatureShowcase from "@/components/sections/FeatureShowcase";
import ServiceCard from "@/components/sections/ServiceCard";
import AIAutomationPage from "@/components/sections/AiShowCase";
export default function HomePage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero__container container">
          <div className="hero__content">
            <h2 className="hero__title">
              Launch Your Online Presence{" "}
              <span className="gradient-text">Now</span>
            </h2>

            <p className="hero__description">
              Your Digital Toolkit For The Modern Age is <b>Here.</b> With our
              stunning services, you are ready to go live in few hours. No
              technical skills needed.
            </p>

            {/* SERVICES */}
  
<div className="cta-services-grid">
  <Link href={'/services/templates'} className="cta-service-link">
    <div className="cta-service-card">
      <i className="fas fa-globe cta-service-icon"></i>
      <h3 className="cta-service-title">Ready-Made Websites</h3>
      <p className="cta-service-description">Launch professional websites in minutes.</p>
    </div>
  </Link>
  
  <Link href={'/services/templates'} className="cta-service-link">
    <div className="cta-service-card">
      <i className="fas fa-paint-brush cta-service-icon"></i>
      <h3 className="cta-service-title">Customizable  Websites</h3>
      <p className="cta-service-description">Tailor templates to match your brand.</p>
    </div>
  </Link>
  
  <Link href={'/services/application'} className="cta-service-link">
    <div className="cta-service-card">
      <i className="fas fa-mobile-alt cta-service-icon"></i>
      <h3 className="cta-service-title">Web & Mobile Apps</h3>
      <p className="cta-service-description">Create applications that suit your needs.</p>
    </div>
  </Link>
  
  <Link href={'/services/ai-automation'} className="cta-service-link">
    <div className="cta-service-card">
      <i className="fas fa-robot cta-service-icon"></i>
      <h3 className="cta-service-title">AI Automation</h3>
      <p className="cta-service-description">Automate tasks and save valuable time.</p>
    </div>
  </Link>
</div>

            {/* CTA BUTTONS */}
            <div className="hero__buttons">
              <Link href="/services" className="btn btn--primary btn--large">
                Browse Our Services
              </Link>
              <Link href="/how-it-work" className="btn btn--secondary btn--large btn--primary">
                How It Works
              </Link>
            </div>

            {/* STATS */}
            <div className="hero__stats">
              <div className="stat">
                <span className="stat__number">100+</span>
                <span className="stat__label">Websites Launched</span>
              </div>

              <div className="stat">
                <span className="stat__number">24+</span>
                <span className="stat__label">Web & Mobile Apps Running</span>
              </div>

              <div className="stat">
                <span className="stat__number">4.9</span>
                <span className="stat__label">Star Rating</span>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="hero__visual">
  <div className="mockup-stack">
    <Image
      src="/desktopnew.png"
      alt="Desktop Preview"
      className="mockup mockup--desktop"
      width={1200}
      height={820}
      priority
    />
    <div className="mockup mockup--tablet" >
      <div>
    <Image
      src="/download.jpg"
      alt="Tablet Preview"
     className="one"
     width={720}
     height={900}
    />
    </div></div>
    <div className="mockup mockup--mobile">
      <div >
    <Image
      src="/m1.jpg"
      alt="Mobile Preview"
      className="come"
      width={480}
      height={960}
    />
    </div>
</div>
  </div>
</div>
        </div>
      </section>

      
   
   <FeatureShowcase />
   <TemplatesShowcase />
   <ServiceCard />
   <AIAutomationPage />
      

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="container1">
          <h2 className="cta__title">Ready to Launch Your Website?</h2>
          <p className="cta__description">
            Join 500+ businesses with stunning online presence
          </p>
          <Link href="/register" className="btn btn--primary btn--large">
            Get Started Today
          </Link>
        </div>
      </section>
    </>
  )
}
