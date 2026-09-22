import { test, expect } from "@playwright/test";

test.describe("Navigation sidebar", () => {
  test("category links appear in sidebar", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.locator(".blog-sidebar");
    await expect(sidebar).toBeVisible();
    await expect(sidebar.locator("a").first()).toBeVisible();
  });

  test("clicking a tag link filters posts", async ({ page }) => {
    await page.goto("/");
    const tagLink = page.locator(".blog-nav-list--secondary a").first();
    const href = await tagLink.getAttribute("href");
    await tagLink.click();
    await expect(page).toHaveURL(new RegExp(href ?? "/tag/"));
  });
});