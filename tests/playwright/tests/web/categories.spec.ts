import { expect, test } from "@playwright/test";

test.describe("Categories Page", () => {
  test(
    "Renders list of categories",
    { tag: "@pages" },
    async ({ page }) => {
      await page.goto("/categories");

      const links = page.locator("ul li a");
      await expect(links.first()).toBeVisible();
      expect(await links.count()).toBeGreaterThan(0);
    },
  );

  test("clicking a category navigates to its page", async ({ page }) => {
    await page.goto("/categories");
    const first = page.locator("ul li a").first();
    const name = await first.textContent();
    await first.click();

    await expect(page).toHaveURL(/\/category\//);
    await expect(
      page.getByRole("heading", { name: new RegExp(name ?? "", "i") })
    ).toBeVisible();
  });
});