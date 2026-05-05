import { expect, test } from "@playwright/test";

test("locator-chaining", async ({ page }) => {
  await page.goto("/lessons/writing-tests/01-locators-and-actions/");
  const container = page.getByTestId("locator-chaining");
  const listContainer = container
    .getByRole("listitem")
    .filter({ hasText: "Product 2" });

  await listContainer.getByRole("button", { name: "Add to cart" }).click();

  await expect(
    listContainer.getByRole("button", { name: "Product added" }),
  ).toBeVisible();
});

test("actionability-chain", async ({ page }) => {
  await page.goto("/lessons/writing-tests/01-locators-and-actions/");
  await page.getByRole("button", { name: "Step" }).click();
  await page.getByRole("button", { name: "Step 2" }).click();
  await page.getByRole("button", { name: "Step 3" }).click();
});
