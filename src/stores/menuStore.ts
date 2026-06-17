import { create } from 'zustand';
import { MenuItem, MenuStore } from '../types/index';
import { api } from '../lib/api';

function computeFilteredItems(
  items: MenuItem[],
  activeCategory: string,
  searchQuery: string
): MenuItem[] {
  return items.filter((item) => {
    const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const searchMatch =
      searchLower === '' ||
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower);
    return categoryMatch && searchMatch && item.available;
  });
}

export const useMenuStore = create<MenuStore>()((set, get) => ({
  items: [],
  categories: [],
  loading: false,
  error: null,
  activeCategory: 'All',
  searchQuery: '',
  filteredItems: [],

  fetchMenu: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.getMenu();
      if (response.error !== null || response.data === null) {
        set({
          error: 'Could not load the menu. Please try again.',
          loading: false,
        });
        return;
      }

      const items = response.data.filter((item) => item.available);
      const categories = Array.from(
        new Set(items.map((item) => item.category))
      ).sort();

      const { activeCategory, searchQuery } = get();
      const filteredItems = computeFilteredItems(items, activeCategory, searchQuery);

      set({
        items,
        categories,
        filteredItems,
        loading: false,
      });
    } catch {
      set({
        error: 'Could not load the menu. Please try again.',
        loading: false,
      });
    }
  },

  setCategory: (category: string) => {
    const { items, activeCategory, searchQuery } = get();
    const newCategory = category === activeCategory ? 'All' : category;
    const filteredItems = computeFilteredItems(items, newCategory, searchQuery);
    set({ activeCategory: newCategory, filteredItems });
  },

  setSearch: (query: string) => {
    const { items, activeCategory } = get();
    const filteredItems = computeFilteredItems(items, activeCategory, query);
    set({ searchQuery: query, filteredItems });
  },

  clearFilters: () => {
    const { items } = get();
    const filteredItems = computeFilteredItems(items, 'All', '');
    set({ activeCategory: 'All', searchQuery: '', filteredItems });
  },
}));
