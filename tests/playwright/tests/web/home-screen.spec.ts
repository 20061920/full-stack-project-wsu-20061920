// import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("Homepage", () => {
  test(
    "loads the homepage and displays the blog page",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/");

      await expect(page.getByText("From the Blog")).toBeVisible();
    },
  );
});
