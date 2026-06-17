import { useEffect } from 'react';
import { useMenuStore } from '../stores/menuStore';
import { CategoryFilter } from '../components/menu/CategoryFilter';
import { SearchInput } from '../components/menu/SearchInput';
import { ProductCard } from '../components/menu/ProductCard';
import { SkeletonGrid } from '../components/menu/SkeletonGrid';
import { MenuItem } from '../types/index';

export function MenuPage() {
  const {
    filteredItems,
    categories,
    loading,
    error,
    activeCategory,
    searchQuery,
    fetchMenu,
    setCategory,
    setSearch,
    clearFilters,
  } = useMenuStore();

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleCustomize = (item: MenuItem) => {
    // TODO Phase 3: open CustomizationModal
    console.log('Customize:', item.name);
  };

  const handleAddToCart = (item: MenuItem) => {
    // TODO Phase 3: add to cartStore with default options
    console.log('Add to cart:', item.name);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header area */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-primary mb-2">Our Menu</h1>
        <p className="text-secondary text-sm">Specialty coffee, crafted to order</p>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <SearchInput value={searchQuery} onChange={setSearch} />
      </div>

      {/* Category filter bar */}
      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setCategory}
        />
      </div>

      {/* Content area — three branches */}
      {loading ? (
        <SkeletonGrid />
      ) : error !== null ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-primary text-lg mb-2">Could not load the menu.</p>
          <p className="text-secondary text-sm mb-6">Please try again.</p>
          <button
            onClick={fetchMenu}
            className="px-6 py-3 bg-accent text-canvas font-semibold rounded-input hover:bg-accent-hover transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            aria-label="Retry loading menu"
          >
            Retry
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center" role="status">
          <p className="text-primary text-lg mb-2">No drinks match your search.</p>
          <p className="text-secondary text-sm mb-6">
            Try &#x27;cold brew&#x27; or browse All.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-surface-raised text-primary border border-border font-semibold rounded-input hover:border-border-hover transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onCustomize={handleCustomize}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </main>
  );
}
