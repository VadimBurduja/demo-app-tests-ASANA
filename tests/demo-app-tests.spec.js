const { test, expect } = require('@playwright/test');
const testData = require('../testData.json');

test.describe('Data-Driven Tests for Demo App', () => {
  testData.testCases.forEach(({ navigation, task, column, tags }) => {
    test(`Verify "${task}" task in "${column}" column with tags ${tags.join(', ')}`, async ({ page }) => {
      const baseURL = test.info().project.use.baseURL;
      const credentials = test.info().project.use.credentials;

      // Step 1: Navigate to the login page and ensure the page is fully loaded
      await page.goto(baseURL);

      // Step 2: Perform login with explicit waits
      await page.fill('//input[@id="username"]', credentials.email);
      await page.fill('//input[@id="password"]', credentials.password);
      await page.click('button[type="submit"]');

      // Step 3: Navigate to the specified section
      await page.click(`text=${navigation}`);

      // Step 4: Verify the task is in the specified column
      const columnLocator = page.locator(`h2:has-text("${column}") + .flex.flex-col.gap-3`);
      const taskLocator = columnLocator.locator(`h3:has-text("${task}")`);
      await expect(taskLocator).toBeVisible();

      // Step 5: Verify tags
      const tagsContainer = taskLocator.locator('..').locator('.flex.flex-wrap.gap-2');
      for (const tag of tags) {
        const tagLocator = tagsContainer.locator(`span:has-text("${tag}")`);
        await expect(tagLocator).toBeVisible();
      }
    });
  });
});
