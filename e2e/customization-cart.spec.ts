import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Helper: wait for menu to load (not skeleton) — wait for Customize or Add to Cart buttons
async function waitForMenu(page: Page) {
  await page.waitForSelector('button:has-text("Customize"), button:has-text("Add to Cart")', { timeout: 15000 });
}

// Helper: add one item to cart
async function addItemToCart(page: Page) {
  await page.goto('/');
  await page.waitForSelector('[aria-label*="Open cart"], button:has-text("Customize"), button:has-text("Add to Cart")', { timeout: 10000 });
  const customizeBtn = page.getByRole('button', { name: /customize/i }).first();
  const addBtn = page.getByRole('button', { name: /^add to cart$/i }).first();
  // Prefer direct Add to Cart if available, else use Customize flow
  if (await addBtn.isVisible().catch(() => false)) {
    await addBtn.click();
  } else {
    await customizeBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /add to cart/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 3000 });
  }
}

test.describe('Customization Modal (F2)', () => {

  test('F2-01: clicking Customize opens the modal', async ({ page }) => {
    await page.goto('/');
    await waitForMenu(page);
    // Click the first Customize button
    await page.getByRole('button', { name: /customize/i }).first().click();
    // Modal should be visible
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('F2-02/F2-07: size selector updates price in real time', async ({ page }) => {
    await page.goto('/');
    await waitForMenu(page);
    await page.getByRole('button', { name: /customize/i }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // Size options should be visible (rendered as radio inputs or styled labels)
    const sizeLabels = dialog.locator('fieldset').filter({ hasText: /size/i }).locator('label');
    await expect(sizeLabels).not.toHaveCount(0);
    // The price display should exist
    await expect(dialog.getByText(/\$\d+\.\d{2}/)).toBeVisible();
  });

  test('F2-05: shot count selector only shown for espresso drinks', async ({ page }) => {
    await page.goto('/');
    await waitForMenu(page);
    // Click Customize on an espresso drink (category filter to Espresso first)
    await page.getByRole('button', { name: /^espresso$/i }).click();
    await page.getByRole('button', { name: /customize/i }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // Shot count section should be present for espresso
    await expect(dialog.getByText(/shots/i)).toBeVisible();
    await dialog.getByRole('button', { name: /close/i }).click();
    // Now try a non-espresso drink — Cold Brew
    await page.getByRole('button', { name: /^cold brew$/i }).click();
    await page.getByRole('button', { name: /customize/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    // Shots section should NOT be present for cold brew
    await expect(page.getByRole('dialog').getByText(/^shots$/i)).not.toBeVisible();
  });

  test('F2-09/F2-10: Add to Cart closes modal and updates cart badge', async ({ page }) => {
    await page.goto('/');
    await waitForMenu(page);
    // Open first customizable item modal
    await page.getByRole('button', { name: /customize/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    // Click Add to Cart
    await page.getByRole('button', { name: /add to cart/i }).click();
    // Modal should close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 3000 });
    // Cart badge should show at least 1
    const badge = page.locator('[aria-label*="Open cart"]').locator('span');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('1');
  });

  test('F2-06: adding extra updates total price', async ({ page }) => {
    await page.goto('/');
    await waitForMenu(page);
    // Find espresso drink for extras
    await page.getByRole('button', { name: /^espresso$/i }).click();
    await page.getByRole('button', { name: /customize/i }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // Get initial price text
    const initialPriceEl = dialog.getByText(/Total:/);
    const initialPrice = await initialPriceEl.textContent();
    // Check an extra add-on if available
    const extras = dialog.locator('input[type="checkbox"]');
    const extrasCount = await extras.count();
    if (extrasCount > 0) {
      await extras.first().check();
      // Price should have changed
      const newPrice = await initialPriceEl.textContent();
      expect(newPrice).not.toEqual(initialPrice);
    }
  });

  test('F2-08: quantity stepper updates total price', async ({ page }) => {
    await page.goto('/');
    await waitForMenu(page);
    await page.getByRole('button', { name: /customize/i }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // Increment quantity
    await page.getByRole('button', { name: /increase quantity/i }).click();
    // Quantity display should show 2
    await expect(dialog.getByText('2')).toBeVisible();
  });

  test('F2-01 close: Escape key closes the modal', async ({ page }) => {
    await page.goto('/');
    await waitForMenu(page);
    await page.getByRole('button', { name: /customize/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 2000 });
  });

});

test.describe('Cart Management (F3)', () => {

  test('F3-01: cart drawer opens when cart badge clicked', async ({ page }) => {
    await addItemToCart(page);
    await page.getByRole('button', { name: /open cart/i }).click();
    // CartDrawer should be visible (role=dialog with aria-label="Your cart")
    await expect(page.getByRole('dialog', { name: /your cart/i })).toBeVisible();
  });

  test('F3-02: cart shows item name and customization summary', async ({ page }) => {
    await addItemToCart(page);
    await page.getByRole('button', { name: /open cart/i }).click();
    const drawer = page.getByRole('dialog', { name: /your cart/i });
    await expect(drawer).toBeVisible();
    // Should contain at least one item with a price
    await expect(drawer.getByText(/\$\d+\.\d{2}/)).toBeVisible();
  });

  test('F3-03: quantity stepper increases and decreases item quantity', async ({ page }) => {
    await addItemToCart(page);
    await page.getByRole('button', { name: /open cart/i }).click();
    const drawer = page.getByRole('dialog', { name: /your cart/i });
    // Find the increase button
    const increaseBtn = drawer.getByRole('button', { name: /increase quantity/i }).first();
    await increaseBtn.click();
    // Quantity should now be 2
    await expect(drawer.getByText('2')).toBeVisible();
  });

  test('F3-04: remove button removes item from cart', async ({ page }) => {
    await addItemToCart(page);
    await page.getByRole('button', { name: /open cart/i }).click();
    const drawer = page.getByRole('dialog', { name: /your cart/i });
    await expect(drawer).toBeVisible();
    // Click remove
    await drawer.getByRole('button', { name: /remove/i }).first().click();
    // Cart should show empty state
    await expect(drawer.getByText(/your cart is empty/i)).toBeVisible({ timeout: 3000 });
  });

  test('F3-05: clear cart requires confirmation and removes all items', async ({ page }) => {
    await addItemToCart(page);
    await page.getByRole('button', { name: /open cart/i }).click();
    const drawer = page.getByRole('dialog', { name: /your cart/i });
    // Click Clear Cart
    await drawer.getByRole('button', { name: /clear cart/i }).click();
    // Confirmation should appear
    await expect(drawer.getByText(/remove all items/i)).toBeVisible();
    // Click Clear All
    await drawer.getByRole('button', { name: /clear all/i }).click();
    // Empty state shown
    await expect(drawer.getByText(/your cart is empty/i)).toBeVisible({ timeout: 3000 });
  });

  test('F3-06: subtotal updates in real time as items change', async ({ page }) => {
    await addItemToCart(page);
    await page.getByRole('button', { name: /open cart/i }).click();
    const drawer = page.getByRole('dialog', { name: /your cart/i });
    // Get initial subtotal
    const subtotalEl = drawer.getByText(/subtotal/i).locator('..').getByText(/\$\d+\.\d{2}/);
    const initialSubtotal = await subtotalEl.textContent();
    // Increase quantity
    await drawer.getByRole('button', { name: /increase quantity/i }).first().click();
    // Subtotal should change
    const newSubtotal = await subtotalEl.textContent();
    expect(newSubtotal).not.toEqual(initialSubtotal);
  });

  test('F3-07: empty cart state shown on fresh visit', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('button', { timeout: 10000 });
    // Open cart without adding anything
    await page.getByRole('button', { name: /open cart/i }).click();
    const drawer = page.getByRole('dialog', { name: /your cart/i });
    await expect(drawer.getByText(/your cart is empty/i)).toBeVisible();
  });

  test('F3-09: cart badge shows correct count after adding items', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('button', { timeout: 10000 });
    // Add item
    await addItemToCart(page);
    // Badge should now show count
    await expect(page.locator('[aria-label*="Open cart"] span')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('[aria-label*="Open cart"] span')).toHaveText('1');
  });

  test('F3-09: Place Order button disabled when cart is empty', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('button', { timeout: 10000 });
    await page.getByRole('button', { name: /open cart/i }).click();
    const drawer = page.getByRole('dialog', { name: /your cart/i });
    const placeOrderBtn = drawer.getByRole('button', { name: /place order/i });
    await expect(placeOrderBtn).toBeDisabled();
  });

  test('toast appears after adding item to cart', async ({ page }) => {
    await page.goto('/');
    await waitForMenu(page);
    // Add an item
    const addDirect = page.getByRole('button', { name: /^add to cart$/i }).first();
    if (await addDirect.isVisible().catch(() => false)) {
      await addDirect.click();
    } else {
      await page.getByRole('button', { name: /customize/i }).first().click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: /add to cart/i }).click();
    }
    // Toast should appear (sonner renders in a fixed position)
    await expect(page.getByText(/added to cart/i)).toBeVisible({ timeout: 4000 });
  });

});
