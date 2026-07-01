import { test, expect, Page } from '@playwright/test';

// Helper: wait for menu items to be loaded (not skeleton)
async function waitForMenu(page: Page) {
  await page.waitForSelector('button:has-text("Customize"), button:has-text("Add to Cart")', {
    timeout: 15000,
  });
}

// Helper: add one item to cart via customization modal
async function addItemToCart(page: Page) {
  await page.goto('/');
  await waitForMenu(page);
  // Prefer direct "Add to Cart" if visible; otherwise use Customize flow
  const addBtn = page.getByRole('button', { name: /^add to cart$/i }).first();
  const customizeBtn = page.getByRole('button', { name: /customize/i }).first();
  if (await addBtn.isVisible().catch(() => false)) {
    await addBtn.click();
  } else {
    await customizeBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /add to cart/i }).click();
    // Wait for modal to close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 3000 });
  }
  // Brief wait for cart state to settle
  await page.waitForTimeout(300);
}

// Helper: open cart drawer
async function openCart(page: Page) {
  await page.getByRole('button', { name: /open cart/i }).click();
  await expect(page.getByRole('dialog', { name: /your cart/i })).toBeVisible();
}

test('Place Order button shows loading state during submission', async ({ page }) => {
  await addItemToCart(page);
  await openCart(page);

  // Intercept the POST /api/orders to delay response so we can observe loading state
  await page.route('**/api/orders', async (route) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });

  const placeOrderBtn = page.getByRole('button', { name: /place order/i });
  await placeOrderBtn.click();

  // During the delayed request, button should show loading state with spinner text
  await expect(page.getByText('Placing order…')).toBeVisible();
  await expect(placeOrderBtn).toBeDisabled();
});

test('Successful order shows confirmation screen with BRW-NNNNN reference', async ({ page }) => {
  await addItemToCart(page);
  await openCart(page);

  const placeOrderBtn = page.getByRole('button', { name: /place order/i });
  await placeOrderBtn.click();

  // Wait for navigation to /confirmation
  await page.waitForURL('**/confirmation');

  // Order reference must match BRW-NNNNN format — rendered in font-display text-4xl
  const refLocator = page.locator('p.font-display.text-4xl');
  await expect(refLocator).toBeVisible();
  const refText = await refLocator.textContent();
  expect(refText).toMatch(/^BRW-\d{5,}$/);

  // Must be visible without scroll (above the fold)
  await expect(refLocator).toBeInViewport();
});

test('Confirmation screen shows itemized order summary with subtotal', async ({ page }) => {
  await addItemToCart(page);
  await openCart(page);

  await page.getByRole('button', { name: /place order/i }).click();
  await page.waitForURL('**/confirmation');

  // "Order Summary" heading must be present
  await expect(page.getByText('Order Summary')).toBeVisible();

  // At least one item row visible in the order summary list
  await expect(page.locator('ul li').first()).toBeVisible();

  // Subtotal formatted $X.XX must be visible
  const subtotalText = page.locator('text=/\\$\\d+\\.\\d{2}/').last();
  await expect(subtotalText).toBeVisible();
});

test('Start a New Order navigates back to menu with empty cart', async ({ page }) => {
  await addItemToCart(page);
  await openCart(page);

  await page.getByRole('button', { name: /place order/i }).click();
  await page.waitForURL('**/confirmation');

  // Click "Start a New Order" button
  await page.getByRole('button', { name: /start a new order/i }).click();

  // Should navigate back to menu (/)
  await page.waitForURL('/');

  // Cart should be empty — open cart and verify empty state
  await page.getByRole('button', { name: /open cart/i }).click();
  await expect(page.getByText(/your cart is empty/i)).toBeVisible();
});

test('Failed order submission shows inline error and preserves cart', async ({ page }) => {
  await addItemToCart(page);
  await openCart(page);

  // Intercept POST /api/orders to return a 500 error
  await page.route('**/api/orders', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong placing your order. Please try again.',
        },
        status: 500,
      }),
    });
  });

  await page.getByRole('button', { name: /place order/i }).click();

  // Inline error message must appear (not a toast — it appears below the Place Order button)
  await expect(page.getByText(/something went wrong placing your order/i)).toBeVisible();

  // "Try Again" button must be present
  await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();

  // Cart drawer must still be open (user was NOT navigated away)
  await expect(page.getByRole('dialog', { name: /your cart/i })).toBeVisible();

  // Cart items must still be present (cart was NOT cleared on error)
  // The CartItem renders item name in p.font-display.text-primary inside the drawer
  const cartDrawer = page.getByRole('dialog', { name: /your cart/i });
  // At minimum the subtotal price row must still be showing (cart not empty)
  await expect(cartDrawer.getByText(/\$\d+\.\d{2}/)).toBeVisible();
});
