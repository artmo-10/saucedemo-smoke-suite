import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { injectSaucedemoSession } from '../../utils/helpers';

test.describe('Products Catalog Tests', () => {

  test.beforeEach(async ({ page }) => {
    await injectSaucedemoSession(page);
  });

  test('inventory page displays products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.title).toBeVisible();
    await expect(inventoryPage.title).toHaveText('Products');
    const itemsCount = await inventoryPage.inventoryItems.count();
    expect(itemsCount).toBeGreaterThan(0);
  });

});