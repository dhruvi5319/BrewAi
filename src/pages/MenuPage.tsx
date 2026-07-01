import { useState, useEffect } from 'react';
import { useMenuStore } from '../stores/menuStore';
import { CategoryFilter } from '../components/menu/CategoryFilter';
import { SearchInput } from '../components/menu/SearchInput';
import { ProductCard } from '../components/menu/ProductCard';
import { SkeletonGrid } from '../components/menu/SkeletonGrid';
import { CustomizationModal } from '../components/customization/CustomizationModal';
import { useCartStore } from '../stores/cartStore';
import { toast } from 'sonner';
import type { MenuItem } from '../types/index';

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

  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleCustomize = (item: MenuItem) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (item: MenuItem) => {
    // Default options: first size, first milk (or null if none), first temp (or null if none)
    const firstSize = item.options.sizes[0];
    const unitPrice = item.basePrice + (firstSize?.delta ?? 0);
    const cartItem = {
      cartItemId: crypto.randomUUID(),
      menuItemId: item.id,
      name: item.name,
      unitPrice,
      quantity: 1,
      customizations: {
        size: firstSize?.label ?? '',
        milk: item.options.milks.length > 0 ? item.options.milks[0] : null,
        temperature: item.options.temperatures.length > 0 ? item.options.temperatures[0] : null,
        shots: null,
        addons: [],
        specialInstructions: '',
      },
    };
    addItem(cartItem);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
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

      <CustomizationModal
        item={modalItem}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setModalItem(null); }}
      />
    </main>
  );
}
