export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shimmer"></div>
      <div className="skeleton-body">
        <div className="skeleton-line short shimmer"></div>
        <div className="skeleton-line medium shimmer"></div>
        <div className="skeleton-line full shimmer"></div>
        <div className="skeleton-line last shimmer"></div>
      </div>
    </div>
  )
}