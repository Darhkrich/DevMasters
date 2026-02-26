export default function TemplatesFilters({
  search,
  setSearch,
  setCategory,
  setTypeMode
}) {
  return (
    <section className="wc-templates-controls">

      {/* SEARCH */}
      <div className="wc-templates-search">
        <div className="wc-input-chip">
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* CATEGORY */}
      <div className="wc-templates-filter-chips">
        {["all", "business", "ecommerce", "portfolio", "blog", "landing"].map(
          cat => (
            <button
              key={cat}
              className="wc-t-chip"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* TYPE */}
      <div className="wc-templates-toggle">
        {["all", "ready", "custom"].map(mode => (
          <button
            key={mode}
            className="wc-t-view"
            onClick={() => setTypeMode(mode)}
          >
            {mode === "ready"
              ? "Ready-Made"
              : mode === "custom"
              ? "Customizable"
              : "All"}
          </button>
        ))}
      </div>

    </section>
  );
}