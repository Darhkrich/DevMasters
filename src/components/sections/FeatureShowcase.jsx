"use client";
import Link from "next/link";
import './feature-showcase.css';
export default function FeatureShowcase() {
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
    <section className="simple-features">
      <div className="simple-container">
        <div className="simple-header">
          <h2>Next-Gen Digital Services</h2>
          <p>
            Premium <strong>Websites, Apps</strong>, intelligent <strong>AI</strong>, your 
            future-ready <strong>Platforms</strong>.
          </p>
        </div>

        <div className="simple-grid">
          {features.map((f, i) => (
            <div key={i} className="simple-card">
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

        <Link href={'/services'}>
          <div className="simple-banner">
            <h3>Build Faster. Scale Smarter.</h3>
            <p>Let's create technology that puts your brand ahead.</p>
          </div>
        </Link>
      </div>
    </section>
  );
}