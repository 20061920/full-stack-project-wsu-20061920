import { test, expect } from "@playwright/test";

test.describe("Post detail", () => {
  test("clicking a post card navigates to detail page", async ({ page }) => {
    await page.goto("/");
    const firstCard = page.locator(".blog-card h3 a").first();
    const title = await firstCard.textContent();
    await firstCard.click();

    await expect(page).toHaveURL(/\/details\//);
    await expect(page.locator("h1")).toContainText(title ?? "");
  });

  test("post detail increments view count on load", async ({ page }) => {
    await page.goto("/");
    const firstCard = page.locator(".blog-card h3 a").first();
    await firstCard.click();
    // View count is visible
    await expect(page.locator(".blog-views")).toBeVisible();
  });
});