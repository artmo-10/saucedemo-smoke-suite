import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly summaryTotal: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutTitle = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.zipInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.summaryTotal = page.locator('.summary_total_label');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillShippingInfo(firstName: string, lastName: string, zip: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipInput.fill(zip);
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}