import { test } from '@playwright/test';
import { login } from './utils';

test.describe('Navbar and permissions', () => {
  test.afterEach(async ({ page }) => {
    await page.locator('a:has-text("Déconnexion")').last().click();
  });

  test('should have users links when admin', async ({ page }) => {
    await login(page);
    await test.expect(page.locator('#navbar a:has-text("Utilisateurs")')).toBeVisible();
  });

  test('should not have export link when not admin', async ({ page }) => {
    await login(page, 'lansana@gmail.com');
    await test.expect(page.locator('#navbar a:has-text("Utilisateurs")')).toBeHidden();
  });
});
