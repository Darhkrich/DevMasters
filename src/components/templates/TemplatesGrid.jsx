import TemplateCard from "./TemplateCard";

export default function TemplatesGrid({
  templates,
  search,
  category,
  typeMode,
  visibleCount,
  onBuy
}) {
  const filtered = templates
    .filter(t => t.isActive)
    .filter(t => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.title.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || t.categories.includes(category);

      const matchesType =
        typeMode === "all" || t.type === typeMode;

      return matchesSearch && matchesCategory && matchesType;
    })
    .slice(0, visibleCount);

  if (filtered.length === 0) {
    return (
      <div className="wc-templates-empty">
        <div className="wc-templates-empty-inner">
          <h3>No templates found</h3>
          <p>Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wc-templates-grid">
      {filtered.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          onBuy={onBuy}
        />
      ))}
    </div>
  );
}