export function SkeletonGrid() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      aria-label="Loading menu items"
      aria-busy="true"
    >
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between bg-surface border border-border rounded-card p-4 min-h-[160px] animate-pulse"
        >
          {/* Top section */}
          <div>
            {/* Badge placeholder */}
            <div className="h-5 w-20 bg-surface-raised rounded-pill mb-3" />
            {/* Title placeholder */}
            <div className="h-5 w-3/4 bg-surface-raised rounded mb-2" />
            {/* Description line 1 */}
            <div className="h-4 w-full bg-surface-raised rounded mb-1" />
            {/* Description line 2 */}
            <div className="h-4 w-2/3 bg-surface-raised rounded mb-4" />
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-auto">
            {/* Price placeholder */}
            <div className="h-5 w-12 bg-surface-raised rounded" />
            {/* CTA placeholder */}
            <div className="h-10 w-24 bg-surface-raised rounded-input" />
          </div>
        </div>
      ))}
    </div>
  );
}
