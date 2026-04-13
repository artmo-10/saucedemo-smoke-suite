import { Page, Locator} from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async addFirstItemToCart(): Promise<string> {
    const firstItem = this.inventoryItems.first();
    const productName = await firstItem.locator('.inventory_item_name').innerText();
    await firstItem.locator('button').click();
    return productName;
  }

  async addItemByIndex(index: number): Promise<string> {
    const item = this.inventoryItems.nth(index);
    const productName = await item.locator('.inventory_item_name').innerText();
    await item.locator('button').click();
    return productName;
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

}