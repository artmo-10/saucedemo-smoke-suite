import { Page, Locator } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly confirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmation = page.locator('.complete-header');
  }
}