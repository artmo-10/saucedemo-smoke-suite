import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import users from '../../utils/users.json';

test.describe('Login Tests', () => {

  test('valid credentials redirect to inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('invalid credentials show error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password');
  });

});