import Image from "next/image";
export default function TemplateCard({ template, onBuy }) {
  return (
    <article className="wc-template-card">

      <div className="wc-template-body">
            <div className="wc-template-thumb">
      <Image
        src={template.image}
        alt={`${template.name} template preview`}
        width={420}
        height={260}
        className="wc-template-image"
      />
</div>

        <div className="wc-template-header">
          <h3>{template.title}</h3>
          <span
            className={`wc-template-tag wc-template-tag--${template.type}`}
          >
            {template.type === "ready" ? "Ready-Made" : "Customizable"}
          </span>
        </div>

        <p>{template.description}</p>

        <div className="wc-template-footer">
          <div className="wc-template-price">
            <span className="wc-price-main">${template.price}</span>
            <span className="wc-price-note">{template.priceNote}</span>
          </div>

          <div className="wc-template-actions">
            <a
              href={template.previewUrl}
              target="_blank"
              className="wc-btn-ghost wc-btn-preview"
            >
              Preview
            </a>

            <button
              className="wc-btn-primary wc-btn-buy"
              onClick={() => onBuy(template.id)}
            >
              Buy for Dashboard
            </button>
          </div>
        </div>

      </div>
    </article>
  );
}