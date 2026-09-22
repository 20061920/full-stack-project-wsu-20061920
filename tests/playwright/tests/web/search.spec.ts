import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test("typing a query and submitting navigates to search results", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Search").fill("blog");
    await page.getByPlaceholder("Search").press("Enter");
    await expect(page).toHaveURL(/\/search\//);
  });

    test("search results show matching posts", async ({ page }) => {
    await page.goto("/");
    const firstTitle = await page.locator(".blog-card h3").first().textContent();
    const query = firstTitle?.split(" ")[0] ?? "a";
    await page.goto(`/search/${encodeURIComponent(query)}`);
    const cards = page.locator(".blog-card");
    expect(await cards.count()).toBeGreaterThan(0);
    });
});