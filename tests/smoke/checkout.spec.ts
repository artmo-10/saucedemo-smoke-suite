import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage';
import { navigateToInventory } from '../../utils/helpers';
import checkoutInfo from '../../utils/checkoutInfo.json';

test.describe('Checkout Flow Tests', () => {

  test.beforeEach(async ({ page }) => {
    await navigateToInventory(page);
  });

  test('complete purchase end-to-end', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const completePage = new CheckoutCompletePage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await expect(checkoutPage.checkoutTitle).toBeVisible();
    await checkoutPage.fillShippingInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.zipCode,
    );

    await expect(checkoutPage.summaryTotal).toBeVisible();
    await checkoutPage.finish();

    await expect(completePage.confirmation).toBeVisible();
    await expect(completePage.confirmation).toHaveText('Thank you for your order!');
  });

  test('empty shipping fields show validation error', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Submit without filling any fields
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('First Name');
  });

  test('Intentional failure – demonstrates trace.zip capture - Confirmation message mismatch', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const completePage = new CheckoutCompletePage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(
        checkoutInfo.firstName,
        checkoutInfo.lastName,
        checkoutInfo.zipCode,
    );
    await checkoutPage.finish();

    // Intentional failure — simulates a regression where the confirmation
    // message text changed. Real text is 'Thank you for your order!'
    await expect(completePage.confirmation).toHaveText('Your order has been placed!');
});

});