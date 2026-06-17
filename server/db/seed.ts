import type Database from 'better-sqlite3';

const espressoOptions = JSON.stringify({
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

const coldBrewOptions = JSON.stringify({
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

const pourOverOptions = JSON.stringify({
  sizes: [
    { label: '8oz', delta: 0.00 },
    { label: '12oz', delta: 0.50 },
  ],
  milks: [],
  temperatures: ['Hot'],
  shots: null,
  extras: [],
});

const teaOptions = JSON.stringify({
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

export function seedMenu(db: InstanceType<typeof Database>): void {
  const count = (db.prepare('SELECT COUNT(*) as count FROM menu_items').get() as { count: number }).count;
  if (count > 0) return; // Already seeded — do not re-run

  const insert = db.prepare(`
    INSERT INTO menu_items (name, description, base_price, category, drink_type, has_customizations, available, sort_order, options_json)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

  const insertMany = db.transaction((items: Array<[string, string, number, string, string, number, number, string]>) => {
    for (const item of items) {
      insert.run(...item);
    }
  });

  insertMany([
    // Espresso (6 items)
    ['Signature Latte', 'Velvety espresso with steamed micro-foam', 4.75, 'Espresso', 'espresso', 1, 1, espressoOptions],
    ['Flat White', 'Double ristretto with silky whole milk', 4.50, 'Espresso', 'espresso', 1, 2, espressoOptions],
    ['Cortado', 'Equal parts espresso and warm milk', 3.75, 'Espresso', 'espresso', 1, 3, espressoOptions],
    ['Oat Cappuccino', 'Double shot with thick oat milk foam', 5.00, 'Espresso', 'espresso', 1, 4, espressoOptions],
    ['Vanilla Bean Latte', 'Espresso with house-made vanilla syrup and steamed milk', 5.25, 'Espresso', 'espresso', 1, 5, espressoOptions],
    ['Ristretto Shot', 'Concentrated half-shot for the purist', 2.50, 'Espresso', 'espresso', 1, 6, espressoOptions],

    // Cold Brew (4 items)
    ['Classic Cold Brew', '20-hour steep, smooth and bold', 4.25, 'Cold Brew', 'cold_brew', 1, 1, coldBrewOptions],
    ['Vanilla Cold Brew', 'Cold brew with vanilla syrup over ice', 4.75, 'Cold Brew', 'cold_brew', 1, 2, coldBrewOptions],
    ['Nitro Cold Brew', 'Nitrogen-infused cold brew on tap', 5.00, 'Cold Brew', 'cold_brew', 1, 3, coldBrewOptions],
    ['Cold Brew Tonic', 'Cold brew over sparkling tonic water', 5.50, 'Cold Brew', 'cold_brew', 1, 4, coldBrewOptions],

    // Pour-Over (4 items)
    ['Ethiopia Yirgacheffe', 'Bright blueberry and jasmine notes', 6.00, 'Pour-Over', 'pour_over', 0, 1, pourOverOptions],
    ['Colombia Huila', 'Caramel sweetness with a clean finish', 5.50, 'Pour-Over', 'pour_over', 0, 2, pourOverOptions],
    ['Guatemala Antigua', 'Dark chocolate and walnut', 5.75, 'Pour-Over', 'pour_over', 0, 3, pourOverOptions],
    ['Kenya AA', 'Winey acidity with blackcurrant', 6.25, 'Pour-Over', 'pour_over', 0, 4, pourOverOptions],

    // Tea (4 items)
    ['Matcha Latte', 'Ceremonial grade matcha with steamed milk', 5.00, 'Tea', 'tea', 1, 1, teaOptions],
    ['Hojicha Latte', 'Roasted green tea with a toasty finish', 4.75, 'Tea', 'tea', 1, 2, teaOptions],
    ['Earl Grey Latte', 'London Fog style with bergamot and vanilla', 4.50, 'Tea', 'tea', 1, 3, teaOptions],
    ['Chamomile Honey', 'Calming chamomile with local honey', 3.75, 'Tea', 'tea', 1, 4, teaOptions],

    // Seasonal (3 items)
    ['Lavender Honey Latte', 'Espresso with house lavender syrup and oat milk', 5.75, 'Seasonal', 'espresso', 1, 1, espressoOptions],
    ['Cardamom Rose Latte', 'Spiced espresso with rose water and oat foam', 5.50, 'Seasonal', 'espresso', 1, 2, espressoOptions],
    ['Brown Sugar Cold Brew', 'Cold brew with brown sugar syrup and oat milk', 5.25, 'Seasonal', 'cold_brew', 1, 3, coldBrewOptions],
  ]);
}
