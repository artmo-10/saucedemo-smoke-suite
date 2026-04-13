import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { navigateToInventory } from '../../utils/helpers';

test.describe('Shopping Cart Tests', () => {

  test.beforeEach(async ({ page }) => {
    await navigateToInventory(page);
  });

  test('adding an item updates the cart badge to 1', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('removing an item hides the cart badge', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.inventoryItems.first().locator('button')).toContainText('Remove');
    await inventoryPage.inventoryItems.first().locator('button').click();
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('added item name matches what is shown in the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const productName = await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    const cartItemName = await cartPage.getItemNameInCart();
    expect(cartItemName).toBe(productName);
  });

  test('adding two items shows count of 2 in cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    await inventoryPage.addItemByIndex(0);
    await inventoryPage.addItemByIndex(1);
    await inventoryPage.goToCart();
    const count = await cartPage.getCartItemCount();
    expect(count).toBe(2);
  });

});