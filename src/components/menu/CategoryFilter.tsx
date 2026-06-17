interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
  const allCategories = ['All', ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {allCategories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            aria-pressed={isActive}
            className={[
              'flex-shrink-0 px-4 py-2 rounded-pill text-sm font-semibold',
              'min-h-[44px]',
              'transition-colors duration-150 ease-in-out',
              'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
              'focus-visible:outline-none',
              isActive
                ? 'bg-accent text-canvas border border-accent'
                : 'bg-surface text-secondary border border-border hover:border-border-hover hover:text-primary',
            ].join(' ')}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
