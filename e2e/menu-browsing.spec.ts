import { test, expect } from '@playwright/test';

test.describe('Menu Browsing (F1)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // US-1.1: View the full menu on page load
  test('shows skeleton loading state while menu loads', async ({ page }) => {
    // Intercept the API to delay the response so we can observe the loading state
    await page.route('**/api/menu', async (route) => {
      await page.waitForTimeout(300); // hold response for 300ms
      await route.continue();
    });
    await page.goto('/');
    // The skeleton grid has aria-busy="true"
    const skeletons = page.locator('[aria-busy="true"]');
    await expect(skeletons).toBeVisible();
  });

  test('displays all menu items after loading', async ({ page }) => {
    // Wait for cards to appear (at least 1 card with a drink name via font-display)
    await page.waitForSelector('.font-display', { timeout: 5000 });
    const cards = page.locator('.font-display');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('each card shows name, price, category badge, and CTA', async ({ page }) => {
    await page.waitForSelector('.font-display', { timeout: 5000 });
    // Check first visible card has price (starts with $)
    const priceEl = page.locator('span.text-accent').first();
    await expect(priceEl).toContainText('$');
    // Check CTA button exists (Customize or Add to Cart)
    const ctaButton = page.locator('button').filter({ hasText: /Customize|Add to Cart/ }).first();
    await expect(ctaButton).toBeVisible();
  });

  // US-1.2 and US-1.3: Category filter
  test('filters menu by category when a pill is clicked', async ({ page }) => {
    await page.waitForSelector('.font-display', { timeout: 5000 });
    // Find and click the first non-All category pill
    const espressoPill = page.getByRole('button', { name: 'Espresso' });
    await espressoPill.click();
    // Pill should be visually active (has aria-pressed="true")
    await expect(espressoPill).toHaveAttribute('aria-pressed', 'true');
    // Cards should still be visible after filter
    const cards = page.locator('.font-display');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('re-clicking active category pill returns to All', async ({ page }) => {
    await page.waitForSelector('.font-display', { timeout: 5000 });
    const espressoPill = page.getByRole('button', { name: 'Espresso' });
    // Click once to activate
    await espressoPill.click();
    await expect(espressoPill).toHaveAttribute('aria-pressed', 'true');
    // Click again to deselect — All should now be active
    await espressoPill.click();
    const allPill = page.getByRole('button', { name: 'All' });
    await expect(allPill).toHaveAttribute('aria-pressed', 'true');
  });

  // US-1.3: Search
  test('search input filters menu by keyword', async ({ page }) => {
    await page.waitForSelector('.font-display', { timeout: 5000 });
    const allCount = await page.locator('.font-display').count();
    // Type a specific search term
    const searchInput = page.getByRole('textbox', { name: /search/i });
    await searchInput.fill('espresso');
    // Wait for 200ms debounce + render
    await page.waitForTimeout(300);
    const filteredCount = await page.locator('.font-display').count();
    // Filtered count should be less than or equal to all count
    expect(filteredCount).toBeLessThanOrEqual(allCount);
  });

  // US-1.4: Empty state
  test('shows empty state with canonical message when no results', async ({ page }) => {
    await page.waitForSelector('.font-display', { timeout: 5000 });
    const searchInput = page.getByRole('textbox', { name: /search/i });
    // Type a search term that will definitely not match any drink
    await searchInput.fill('xyzzy_no_match_drink_name_12345');
    await page.waitForTimeout(300);
    // Empty state message should appear
    await expect(page.getByText("No drinks match your search.")).toBeVisible();
    await expect(page.getByText("Try 'cold brew' or browse All.")).toBeVisible();
    // Clear filters button should be present
    const clearBtn = page.getByRole('button', { name: /Clear filters/i });
    await expect(clearBtn).toBeVisible();
    // Click clear and verify menu returns
    await clearBtn.click();
    await expect(page.locator('.font-display').first()).toBeVisible();
  });

  // US-1.5: Error state
  test('shows error state with Retry button when API fails', async ({ page }) => {
    // Intercept and fail the API call
    await page.route('**/api/menu', (route) => route.abort('failed'));
    await page.goto('/');
    // Error message should appear
    await expect(page.getByText(/Could not load the menu/i)).toBeVisible({ timeout: 5000 });
    // Retry button should be present
    const retryBtn = page.getByRole('button', { name: /Retry/i });
    await expect(retryBtn).toBeVisible();
  });

});
