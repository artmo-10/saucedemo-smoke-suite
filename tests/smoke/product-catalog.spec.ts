import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { navigateToInventory } from '../../utils/helpers';

test.describe('Product Catalog Tests', () => {

  test.beforeEach(async ({ page }) => {
    await navigateToInventory(page);
  });

  test('inventory page displays the Products title', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.title).toBeVisible();
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('inventory page lists at least one product', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const itemCount = await inventoryPage.inventoryItems.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('sort dropdown is present on the inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.sortDropdown).toBeVisible();
  });

});