import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import users from '../utils/users.json';
import path from 'path';

const authFile = (browser: string) =>
  path.resolve(`.auth/${browser}.json`);

setup('authenticate', async ({ page, browserName }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goToLoginPage();
  await loginPage.login(users.standardUser.username, users.standardUser.password);
  await page.waitForURL(/inventory/);

  await page.context().storageState({ path: authFile(browserName) });
  console.log(`[auth.setup] Saved storageState → .auth/${browserName}.json`);
});