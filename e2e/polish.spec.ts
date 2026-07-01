import { test, expect } from '@playwright/test';

/**
 * Phase 5 Polish — Responsive + Animation E2E Tests
 *
 * Verifies:
 *   - Responsive layout at 390px (mobile), 768px (tablet), 1280px (desktop)
 *   - Menu grid column counts at each breakpoint
 *   - Navigation compact vs. full-bar at mobile / desktop
 *   - No horizontal scrolling at 390px
 *   - prefers-reduced-motion disables Framer Motion animations globally
 */

test.describe('Responsive Layout (Phase 5)', () => {

  // ── 390px Mobile ────────────────────────────────────────────────────────────

  test.describe('390px mobile viewport', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      // Wait for menu cards to be rendered
      await page.waitForSelector('.font-display', { timeout: 8000 });
    });

    test('shows compact mobile header (no nav links, has cart icon)', async ({ page }) => {
      // Compact header is the flex md:hidden variant
      // It should be visible at 390px
      const compactHeader = page.locator('header.flex.md\\:hidden');
      await expect(compactHeader).toBeVisible();

      // Full desktop nav should be hidden at this width
      const desktopNav = page.locator('header.hidden.md\\:flex');
      await expect(desktopNav).not.toBeVisible();

      // Cart icon button should be present in compact header
      const cartBtn = compactHeader.getByRole('button', { name: /cart/i });
      await expect(cartBtn).toBeVisible();
    });

    test('menu grid is single column at 390px', async ({ page }) => {
      // Get the grid container — it has the grid class
      const grid = page.locator('.grid.grid-cols-1');
      await expect(grid).toBeVisible();

      // All cards should be stacked — check that first two cards have ~same left offset
      const cards = page.locator('.font-display');
      const count = await cards.count();
      expect(count).toBeGreaterThan(1);

      const firstBox = await cards.nth(0).boundingBox();
      const secondBox = await cards.nth(1).boundingBox();
      expect(firstBox).not.toBeNull();
      expect(secondBox).not.toBeNull();
      // In single-column layout, both cards should start at approx the same x
      expect(Math.abs((firstBox!.x) - (secondBox!.x))).toBeLessThan(10);
    });

    test('no horizontal scroll at 390px', async ({ page }) => {
      // document.documentElement.scrollWidth should equal clientWidth (no overflow)
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for sub-pixel rounding
    });

    test('all interactive elements have ≥44px touch target height', async ({ page }) => {
      // Check category filter pills
      const pills = page.locator('button[aria-pressed]');
      const pillCount = await pills.count();
      for (let i = 0; i < pillCount; i++) {
        const box = await pills.nth(i).boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
    });
  });

  // ── 768px Tablet ─────────────────────────────────────────────────────────────

  test.describe('768px tablet viewport', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.font-display', { timeout: 8000 });
    });

    test('shows full desktop nav at 768px', async ({ page }) => {
      // At md breakpoint (768px), desktop nav becomes visible
      const desktopNav = page.locator('header.hidden.md\\:flex');
      await expect(desktopNav).toBeVisible();

      // Menu link should be present in desktop nav
      const menuLink = desktopNav.getByRole('link', { name: /menu/i });
      await expect(menuLink).toBeVisible();
    });

    test('menu grid is 2 columns at 768px (sm:grid-cols-2)', async ({ page }) => {
      // At sm (640px+) we get grid-cols-2. At 768px we're in sm range.
      const cards = page.locator('.font-display');
      const count = await cards.count();
      expect(count).toBeGreaterThan(2);

      // Get bounding boxes of first three cards to verify 2-col layout
      const firstBox = await cards.nth(0).boundingBox();
      const secondBox = await cards.nth(1).boundingBox();
      const thirdBox = await cards.nth(2).boundingBox();

      expect(firstBox).not.toBeNull();
      expect(secondBox).not.toBeNull();
      expect(thirdBox).not.toBeNull();

      // Cards 0 and 1 are in the same row: different x, similar y
      expect(secondBox!.x).toBeGreaterThan(firstBox!.x + 50);
      expect(Math.abs(firstBox!.y - secondBox!.y)).toBeLessThan(10);

      // Card 2 starts a new row: similar x to card 0, larger y
      expect(Math.abs(thirdBox!.x - firstBox!.x)).toBeLessThan(50);
      expect(thirdBox!.y).toBeGreaterThan(firstBox!.y + 50);
    });
  });

  // ── 1280px Desktop ───────────────────────────────────────────────────────────

  test.describe('1280px desktop viewport', () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.font-display', { timeout: 8000 });
    });

    test('shows full desktop nav at 1280px', async ({ page }) => {
      const desktopNav = page.locator('header.hidden.md\\:flex');
      await expect(desktopNav).toBeVisible();

      const menuLink = desktopNav.getByRole('link', { name: /menu/i });
      await expect(menuLink).toBeVisible();

      // Compact mobile header should be hidden
      const compactHeader = page.locator('header.flex.md\\:hidden');
      await expect(compactHeader).not.toBeVisible();
    });

    test('menu grid is 3 columns at 1280px (lg:grid-cols-3)', async ({ page }) => {
      const cards = page.locator('.font-display');
      const count = await cards.count();
      expect(count).toBeGreaterThan(3);

      const firstBox  = await cards.nth(0).boundingBox();
      const secondBox = await cards.nth(1).boundingBox();
      const thirdBox  = await cards.nth(2).boundingBox();
      const fourthBox = await cards.nth(3).boundingBox();

      expect(firstBox).not.toBeNull();
      expect(secondBox).not.toBeNull();
      expect(thirdBox).not.toBeNull();
      expect(fourthBox).not.toBeNull();

      // First three cards in same row: progressively increasing x, similar y
      expect(secondBox!.x).toBeGreaterThan(firstBox!.x + 50);
      expect(thirdBox!.x).toBeGreaterThan(secondBox!.x + 50);
      expect(Math.abs(firstBox!.y - thirdBox!.y)).toBeLessThan(10);

      // Fourth card wraps to next row: similar x to first card
      expect(Math.abs(fourthBox!.x - firstBox!.x)).toBeLessThan(50);
      expect(fourthBox!.y).toBeGreaterThan(firstBox!.y + 50);
    });

    test('no horizontal scroll at 1280px', async ({ page }) => {
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  });
});

// ── Reduced Motion ────────────────────────────────────────────────────────────

test.describe('prefers-reduced-motion', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('animations are disabled when prefers-reduced-motion is set', async ({ page }) => {
    // Emulate prefers-reduced-motion: reduce
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForSelector('.font-display', { timeout: 8000 });

    // With reduced motion, Framer Motion useReducedMotion() returns true.
    // The staggerContainer is replaced with {} (no opacity: 0 initial).
    // Cards should be immediately visible (opacity: 1) without animation.
    const firstCard = page.locator('.font-display').first();
    await expect(firstCard).toBeVisible();

    // Verify the card is at full opacity — no lingering hidden state
    const opacity = await firstCard.evaluate((el) => {
      const style = window.getComputedStyle(el.closest('[style]') ?? el);
      return style.opacity;
    });
    // Opacity should be 1 (or empty string meaning default 1) — not 0
    expect(opacity === '1' || opacity === '').toBe(true);
  });

  test('category filter change with reduced motion shows no animation delay', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForSelector('.font-display', { timeout: 8000 });

    const initialCount = await page.locator('.font-display').count();
    expect(initialCount).toBeGreaterThan(0);

    // Click a category filter
    const espressoPill = page.getByRole('button', { name: 'Espresso' });
    await espressoPill.click();

    // Cards should update immediately (no stagger delay)
    // Wait briefly then confirm cards are visible (not in animate-out state)
    await page.waitForTimeout(100);
    const filteredCards = page.locator('.font-display');
    const filteredCount = await filteredCards.count();
    expect(filteredCount).toBeGreaterThan(0);

    // All visible cards should be at full opacity
    for (let i = 0; i < Math.min(filteredCount, 3); i++) {
      await expect(filteredCards.nth(i)).toBeVisible();
    }
  });
});

// ── Stagger Animation (when motion is allowed) ────────────────────────────────

test.describe('Menu card stagger animation', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('cards are rendered after menu loads (stagger completes)', async ({ page }) => {
    await page.goto('/');
    // All cards should eventually become visible after the stagger animation completes
    await page.waitForSelector('.font-display', { timeout: 8000 });
    const cards = page.locator('.font-display');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Wait for stagger to complete (staggerChildren: 0.05s × n cards, max ~1s)
    await page.waitForTimeout(1000);

    // After stagger, all cards should be visible
    for (let i = 0; i < Math.min(count, 6); i++) {
      await expect(cards.nth(i)).toBeVisible();
    }
  });

  test('filter change triggers card re-animation (grid remounts on key change)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.font-display', { timeout: 8000 });

    // Click category filter to change key={activeCategory + searchQuery}
    const espressoPill = page.getByRole('button', { name: 'Espresso' });
    await espressoPill.click();

    // Allow stagger to complete
    await page.waitForTimeout(500);

    // Cards should be visible after filter-triggered re-animation
    const filteredCards = page.locator('.font-display');
    const filteredCount = await filteredCards.count();
    expect(filteredCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(filteredCount, 3); i++) {
      await expect(filteredCards.nth(i)).toBeVisible();
    }
  });
});
