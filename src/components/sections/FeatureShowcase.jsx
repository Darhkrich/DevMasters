"use client";
import { useEffect, useRef } from "react";
import "./feature-showcase.css";

export default function FeatureShowcase() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      /* STAGGERED REVEAL */
      card.style.animationDelay = `${index * 120}ms`;

      if (prefersReducedMotion) return;

      /* TILT EFFECT */
      const handleMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * 18;
        const rotateY = ((x / rect.width) - 0.5) * -18;

        card.style.transform = `
          perspective(1200px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-10px)
          scale(1.02)
        `;
      };

      const reset = () => {
        card.style.transform =
          "perspective(1200px) rotateX(0) rotateY(0) translateY(0) scale(1)";
      };

      card.addEventListener("mousemove", handleMove);
      card.addEventListener("mouseleave", reset);

      return () => {
        card.removeEventListener("mousemove", handleMove);
        card.removeEventListener("mouseleave", reset);
      };
    });
  }, []);

  const features = [
    {
      title: "Application Development",
      desc: "High-performance mobile & web applications engineered for scale.",
      items: [
        "iOS & Android Apps",
        "Web Apps & SaaS",
        "Pixel-perfect UI/UX",
      ],
    },
    {
      title: "AI Automation",
      desc: "Intelligent automation systems that work while you sleep.",
      items: [
        "AI Chatbots",
        "Workflow Automation",
        "Smart Analytics",
      ],
    },
    {
      title: "Website Development",
      desc: "ready-made and customizable templates available to get you going.",
      items: [
        "Landing websites",
        "E-commerce Websites",
        "portfolio Websites",
        "Business Websites",
        "And Many More"
      ],
    },
  ];

  return (
    <section className="fs-section">
      <div className="fs-glow" />

      <div className="fs-container">
        {/* HEADER */}
        <div className="fs-header reveal">
          <h2>Next-Gen Digital Services</h2>
          <p>
            Premium <strong>Websites, Apps</strong>, intelligent <strong>AI</strong>, your 
            future-ready <strong>Platforms</strong>.
          </p>
        </div>

        {/* CARDS */}
        <div className="fs-grid">
          {features.map((f, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="fs-card reveal"
            >
              <div className="fs-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <ul>
                {f.items.map((item, idx) => (
                  <li key={idx}>✔ {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="fs-banner reveal">
          <h3> Build Faster. Scale Smarter.</h3>
          <p>Let’s create technology that puts your brand ahead.</p>
        </div>
      </div>
    </section>
  );
}