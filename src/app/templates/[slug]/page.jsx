import Link from "next/link";

import { templatesData } from "@/data/templates";
import styles from "./template.module.css";

export default async function TemplateDetailPage({ params }) {
  const { slug } = await params; // ✅ REQUIRED in Next 15+

  const template = templatesData[slug];

  if (!template) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h2>Template not found</h2>
        <Link href="/">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="template-page">
      {/* Header */}
      <header className="template-header">
        <div>
          <h1>{template.name}</h1>
          <p>{template.tagline}</p>
        </div>

        <span className="preview-badge live">LIVE</span>
      </header>

      {/* Preview */}
      <div className="template-preview">
        <iframe
          src={template.previewUrl}
          title={`${template.name} Preview`}
          loading="lazy"
        />
      </div>

      {/* Info */}
      <section className="template-info">
        <h2>About this template</h2>
        <p>{template.description}</p>

        <h3>Features</h3>
        <ul>
          {template.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <div className="template-actions">
          <button className="btn-primary">
            Save to Dashboard
          </button>

          <Link href="/" className="btn-secondary">
            Back to Templates
          </Link>
        </div>
      </section>
    </div>
  );
}