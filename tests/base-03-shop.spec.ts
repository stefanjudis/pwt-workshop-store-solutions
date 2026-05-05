import { test } from "@playwright/test";

test("add-to-cart from home", async ({ page }) => {
  await page.goto("https://www.playwright-workshop.online/");
  await page
    .getByTestId("hero-product-grid")
    .getByRole("link", { name: "The Collection Snowboard:" })
    .click();
  await page.getByRole("button", { name: "Add item to cart" }).click();
  await page.getByRole("button", { name: "Increase item quantity" }).click();
  await page.getByRole("button", { name: "Close cart" }).click();
});

test("add-to-cart from catalog", async ({ page, isMobile }) => {
  await page.goto("https://www.playwright-workshop.online/");

  if (isMobile) {
    await page.getByRole("button", { name: "Open mobile menu" }).click();
  }

  await page.getByRole("link", { name: "Products" }).click();
  await page.getByRole("link", { name: "Gift Card Gift Card" }).click();
  await page.getByRole("button", { name: "$25" }).click();
  await page.getByRole("button", { name: "Add item to cart" }).click();
});
