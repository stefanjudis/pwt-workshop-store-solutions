import { expect, test } from "@playwright/test";

test("[broken] completes a full shopping journey from search to cart", async ({
  page,
}) => {
  await page.goto("https://www.playwright-workshop.online");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByLabel("Name").fill("stefan");
  await page.getByLabel("Your password").fill("12345678");
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForURL(/\//);

  await expect(page.getByTestId("login-name")).toBeVisible();

  await page.getByPlaceholder("Search for products...").fill("snowboard");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByTestId("search-grid")).toBeVisible();
  await page.getByRole("link", { name: "Price: Low to high" }).click();
  await expect(page).toHaveURL(/sort=price-asc/);
});

/**
test("what's broken here?", async ({ page }) => {
  await page.goto("https://www.playwright-workshop.online/");
  await page.getByRole("link", { name: "The Multi-managed Snowboard" }).click();
  await page.getByRole("button", { name: "Add item to cart" }).click();

  const cart = page.getByTestId("cart");
  await cart
    .getByRole("button", { name: "Increase item quantity" })
    .first()
    .dblclick();
  await expect(cart.getByTestId("cart-item-quantity")).toHaveText("3");
});
*/
