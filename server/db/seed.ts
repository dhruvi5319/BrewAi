import type Database from 'better-sqlite3';

const ESPRESSO_OPTIONS = JSON.stringify({
  sizes: [
    { label: 'Small', delta: -0.50 },
    { label: 'Medium', delta: 0.00 },
    { label: 'Large', delta: 0.75 },
  ],
  milks: ['Whole', 'Oat', 'Almond', 'Coconut', 'Skim', 'None'],
  temperatures: ['Hot', 'Iced'],
  shots: ['Single', 'Double', 'Triple'],
  extras: [
    { label: 'Vanilla Syrup', price: 0.75 },
    { label: 'Caramel', price: 0.75 },
    { label: 'Hazelnut', price: 0.75 },
    { label: 'Extra Shot', price: 1.00 },
    { label: 'Whipped Cream', price: 0.50 },
  ],
});

const COLD_BREW_OPTIONS = JSON.stringify({
  sizes: [
    { label: 'Small', delta: -0.50 },
    { label: 'Medium', delta: 0.00 },
    { label: 'Large', delta: 0.75 },
  ],
  milks: ['None', 'Oat', 'Whole', 'Almond'],
  temperatures: ['Iced'],
  shots: null,
  extras: [
    { label: 'Vanilla Syrup', price: 0.75 },
    { label: 'Caramel', price: 0.75 },
    { label: 'Whipped Cream', price: 0.50 },
  ],
});

const POUR_OVER_OPTIONS = JSON.stringify({
  sizes: [
    { label: '8oz', delta: 0.00 },
    { label: '12oz', delta: 0.50 },
  ],
  milks: [],
  temperatures: ['Hot'],
  shots: null,
  extras: [],
});

const TEA_OPTIONS = JSON.stringify({
  sizes: [
    { label: 'Small', delta: -0.50 },
    { label: 'Medium', delta: 0.00 },
    { label: 'Large', delta: 0.75 },
  ],
  milks: ['Oat', 'Whole', 'Almond', 'Coconut', 'None'],
  temperatures: ['Hot', 'Iced'],
  shots: null,
  extras: [
    { label: 'Vanilla Syrup', price: 0.75 },
    { label: 'Extra Honey', price: 0.50 },
  ],
});

interface SeedItem {
  name: string;
  description: string;
  base_price: number;
  category: string;
  drink_type: string;
  has_customizations: number;
  sort_order: number;
  options_json: string;
}

const SEED_ITEMS: SeedItem[] = [
  // Espresso (6 items)
  {
    name: 'Signature Latte',
    description: 'Velvety espresso with steamed micro-foam',
    base_price: 4.75,
    category: 'Espresso',
    drink_type: 'espresso',
    has_customizations: 1,
    sort_order: 1,
    options_json: ESPRESSO_OPTIONS,
  },
  {
    name: 'Flat White',
    description: 'Double ristretto with silky whole milk',
    base_price: 4.50,
    category: 'Espresso',
    drink_type: 'espresso',
    has_customizations: 1,
    sort_order: 2,
    options_json: ESPRESSO_OPTIONS,
  },
  {
    name: 'Cortado',
    description: 'Equal parts espresso and warm milk',
    base_price: 3.75,
    category: 'Espresso',
    drink_type: 'espresso',
    has_customizations: 1,
    sort_order: 3,
    options_json: ESPRESSO_OPTIONS,
  },
  {
    name: 'Oat Cappuccino',
    description: 'Double shot with thick oat milk foam',
    base_price: 5.00,
    category: 'Espresso',
    drink_type: 'espresso',
    has_customizations: 1,
    sort_order: 4,
    options_json: ESPRESSO_OPTIONS,
  },
  {
    name: 'Vanilla Bean Latte',
    description: 'Espresso with house-made vanilla syrup and steamed milk',
    base_price: 5.25,
    category: 'Espresso',
    drink_type: 'espresso',
    has_customizations: 1,
    sort_order: 5,
    options_json: ESPRESSO_OPTIONS,
  },
  {
    name: 'Ristretto Shot',
    description: 'Concentrated half-shot for the purist',
    base_price: 2.50,
    category: 'Espresso',
    drink_type: 'espresso',
    has_customizations: 1,
    sort_order: 6,
    options_json: ESPRESSO_OPTIONS,
  },

  // Cold Brew (4 items)
  {
    name: 'Classic Cold Brew',
    description: '20-hour steep, smooth and bold',
    base_price: 4.25,
    category: 'Cold Brew',
    drink_type: 'cold_brew',
    has_customizations: 1,
    sort_order: 1,
    options_json: COLD_BREW_OPTIONS,
  },
  {
    name: 'Vanilla Cold Brew',
    description: 'Cold brew with vanilla syrup over ice',
    base_price: 4.75,
    category: 'Cold Brew',
    drink_type: 'cold_brew',
    has_customizations: 1,
    sort_order: 2,
    options_json: COLD_BREW_OPTIONS,
  },
  {
    name: 'Nitro Cold Brew',
    description: 'Nitrogen-infused cold brew on tap',
    base_price: 5.00,
    category: 'Cold Brew',
    drink_type: 'cold_brew',
    has_customizations: 1,
    sort_order: 3,
    options_json: COLD_BREW_OPTIONS,
  },
  {
    name: 'Cold Brew Tonic',
    description: 'Cold brew over sparkling tonic water',
    base_price: 5.50,
    category: 'Cold Brew',
    drink_type: 'cold_brew',
    has_customizations: 1,
    sort_order: 4,
    options_json: COLD_BREW_OPTIONS,
  },

  // Pour-Over (4 items)
  {
    name: 'Ethiopia Yirgacheffe',
    description: 'Bright blueberry and jasmine notes',
    base_price: 6.00,
    category: 'Pour-Over',
    drink_type: 'pour_over',
    has_customizations: 0,
    sort_order: 1,
    options_json: POUR_OVER_OPTIONS,
  },
  {
    name: 'Colombia Huila',
    description: 'Caramel sweetness with a clean finish',
    base_price: 5.50,
    category: 'Pour-Over',
    drink_type: 'pour_over',
    has_customizations: 0,
    sort_order: 2,
    options_json: POUR_OVER_OPTIONS,
  },
  {
    name: 'Guatemala Antigua',
    description: 'Dark chocolate and walnut',
    base_price: 5.75,
    category: 'Pour-Over',
    drink_type: 'pour_over',
    has_customizations: 0,
    sort_order: 3,
    options_json: POUR_OVER_OPTIONS,
  },
  {
    name: 'Kenya AA',
    description: 'Winey acidity with blackcurrant',
    base_price: 6.25,
    category: 'Pour-Over',
    drink_type: 'pour_over',
    has_customizations: 0,
    sort_order: 4,
    options_json: POUR_OVER_OPTIONS,
  },

  // Tea (4 items)
  {
    name: 'Matcha Latte',
    description: 'Ceremonial grade matcha with steamed milk',
    base_price: 5.00,
    category: 'Tea',
    drink_type: 'tea',
    has_customizations: 1,
    sort_order: 1,
    options_json: TEA_OPTIONS,
  },
  {
    name: 'Hojicha Latte',
    description: 'Roasted green tea with a toasty finish',
    base_price: 4.75,
    category: 'Tea',
    drink_type: 'tea',
    has_customizations: 1,
    sort_order: 2,
    options_json: TEA_OPTIONS,
  },
  {
    name: 'Earl Grey Latte',
    description: 'London Fog style with bergamot and vanilla',
    base_price: 4.50,
    category: 'Tea',
    drink_type: 'tea',
    has_customizations: 1,
    sort_order: 3,
    options_json: TEA_OPTIONS,
  },
  {
    name: 'Chamomile Honey',
    description: 'Calming chamomile with local honey',
    base_price: 3.75,
    category: 'Tea',
    drink_type: 'tea',
    has_customizations: 1,
    sort_order: 4,
    options_json: TEA_OPTIONS,
  },

  // Seasonal (3 items)
  {
    name: 'Lavender Honey Latte',
    description: 'Espresso with house lavender syrup and oat milk',
    base_price: 5.75,
    category: 'Seasonal',
    drink_type: 'espresso',
    has_customizations: 1,
    sort_order: 1,
    options_json: ESPRESSO_OPTIONS,
  },
  {
    name: 'Cardamom Rose Latte',
    description: 'Spiced espresso with rose water and oat foam',
    base_price: 5.50,
    category: 'Seasonal',
    drink_type: 'espresso',
    has_customizations: 1,
    sort_order: 2,
    options_json: ESPRESSO_OPTIONS,
  },
  {
    name: 'Brown Sugar Cold Brew',
    description: 'Cold brew with brown sugar syrup and oat milk',
    base_price: 5.25,
    category: 'Seasonal',
    drink_type: 'cold_brew',
    has_customizations: 1,
    sort_order: 3,
    options_json: COLD_BREW_OPTIONS,
  },
];

export function seedMenu(db: InstanceType<typeof Database>): void {
  const count = (db.prepare('SELECT COUNT(*) as count FROM menu_items').get() as { count: number }).count;
  if (count > 0) return; // Already seeded — do not re-run

  const insert = db.prepare(`
    INSERT INTO menu_items
      (name, description, base_price, category, drink_type, has_customizations, sort_order, options_json)
    VALUES
      (@name, @description, @base_price, @category, @drink_type, @has_customizations, @sort_order, @options_json)
  `);

  const insertMany = db.transaction((items: SeedItem[]) => {
    for (const item of items) {
      insert.run(item);
    }
  });

  insertMany(SEED_ITEMS);
}
