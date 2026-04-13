import { Page } from '@playwright/test';
import users from './users.json';

export async function injectSaucedemoSession(page: Page): Promise<void> {
    await page.context().addCookies([
        {
            name: 'session-username',
            value: users.standardUser.username,
            domain: 'www.saucedemo.com',
            path: '/',
        },
    ]);
    await page.goto('/inventory.html');
}