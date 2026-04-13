import { Page } from '@playwright/test';

export async function navigateToInventory(page: Page): Promise<void> {
  await page.goto('/inventory.html');
}
