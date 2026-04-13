import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage';
import { injectSaucedemoSession } from '../../utils/helpers';
import checkoutInfo from '../../utils/checkoutInfo.json';

test.describe('Checkout Flow Test', () => {
    
    test.beforeEach(async ({ page }) => {
    await injectSaucedemoSession(page);
    });

    test('complete purchase end-to-end', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const completePage = new CheckoutCompletePage(page);

        // Add product
        await inventoryPage.addFirstItemToCart();
        await inventoryPage.goToCart();

        // From Cart to Checkout
        await cartPage.proceedToCheckout();

        // Fill shipping
        await expect(checkoutPage.checkoutTitle).toBeVisible();
        await checkoutPage.fillShippingInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.zipCode);

        // Verify order summary is visible before finishing
        await expect(checkoutPage.summaryTotal).toBeVisible();
        await checkoutPage.finish();

        // Confirm order
        await expect(completePage.confirmation).toBeVisible();
        await expect(completePage.confirmation).toHaveText('Thank you for your order!');
    });

});