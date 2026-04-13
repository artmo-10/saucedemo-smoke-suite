import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { injectSaucedemoSession } from '../../utils/helpers';

test.describe('Shopping Cart Tests', () => {

  test.beforeEach(async ({ page }) => {
    await injectSaucedemoSession(page);
  });

  test('adding an item updates cart badge', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('removing an item updates cart badge', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.inventoryItems.first().locator('button')).toContainText('Remove'); 
    await inventoryPage.inventoryItems.first().locator('button').click();
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('added item appears in cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const productName = await inventoryPage.addFirstItemToCart();

    await inventoryPage.goToCart();
    const cartItemName = await cartPage.getItemNameInCart();
    await expect(cartItemName).toBe(productName);
  });

  test('multiple items can be added to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addItemByIndex(0);
    await inventoryPage.addItemByIndex(1);
    await inventoryPage.goToCart();
    const cartItemCount = await cartPage.getCartItemCount();
    await expect(cartItemCount).toBe(2);
  });

});