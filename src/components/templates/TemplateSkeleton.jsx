export default function TemplateSkeleton() {
  return (
    <div className="template-skeleton">
      <div className="skeleton-preview" />

      <div className="skeleton-content">
        <div className="skeleton-line title" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-line short" />

        <div className="skeleton-tags">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}