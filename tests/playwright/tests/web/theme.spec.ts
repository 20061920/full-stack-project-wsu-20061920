import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
  test("toggles dark mode and persists across reload", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: /toggle theme/i });
    await expect(btn).toBeVisible();

    await btn.click();
    await expect(page.locator("body")).toHaveClass(/dark-mode/);

    await page.reload();
    await expect(page.locator("body")).toHaveClass(/dark-mode/);

    // Clean up
    await btn.click();
  });
});