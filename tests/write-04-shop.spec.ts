import { expect, test } from "@playwright/test";

const isSortedAsc = (arr) =>
  arr.every((element, index, array) => !index || +array[index - 1] <= +element);

test("check sorting", async ({ page, isMobile }) => {
  if (isMobile) test.skip();

  await page.goto("http://localhost:3000");
  await page.getByRole("link", { name: "Products" }).click();
  await page.getByRole("link", { name: "Price: Low to high" }).click();
  await expect(page).toHaveURL(/sort=price-asc/);

  const productsContainer = page.getByRole("region", { name: "Products" });

  const productPrices = await productsContainer
    .getByTestId("product-price")
    .allInnerTexts();

  const isSortedUp = isSortedAsc(productPrices);
  expect(isSortedUp).toBeTruthy();
});

test("add 2nd product to the cart", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("hero-product-grid").getByRole("link").nth(2).click();

  let productName: string;

  await test.step("PDP", async () => {
    const productHeading = page.getByRole("heading", { level: 1 });
    await expect(productHeading).toBeVisible();
    productName = await productHeading.innerText();
    await page.getByRole("button", { name: "Add item to cart" }).click();
  });

  await test.step("Cart", async () => {
    const cart = page.getByTestId("cart");
    const cartHeading = page.getByRole("heading", { name: "Cart" });
    await expect(cartHeading).toBeVisible();
    await expect(cart.getByText(productName)).toBeVisible();
    await page.getByRole("button", { name: "Close cart" }).click();
  });
});
