import { Page, Locator} from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly itemName: Locator;
  readonly checkoutButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.itemName = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueButton = page.locator('[data-test="continue-shopping"]');
  }

  async getItemNameInCart(): Promise<string | null> {
    const itemName = await this.itemName.innerText();
    return itemName;
  }

  async getCartItemCount(): Promise<number> {
    const itemsCount = await this.cartItems.count();
    return itemsCount;
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}