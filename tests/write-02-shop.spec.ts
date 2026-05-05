import test, { expect, Locator } from "@playwright/test";

test("login / logout", async ({ page, isMobile }) => {
  const USER_NAME = "Stefan";

  await page.goto("/");

  if (isMobile) {
    await page.getByRole("button", { name: "Open mobile menu" }).click();
  }

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Your name" }).fill(USER_NAME);
  await page.getByRole("textbox", { name: "Your password" }).fill("password");
  await page.getByRole("button", { name: "Login" }).click();

  const greeting = page.getByTestId("login-name");
  await expect(greeting).toBeVisible();
  await expect(greeting).toHaveText(USER_NAME);

  if (isMobile) {
    await page.getByRole("button", { name: "Open mobile menu" }).click();
  }

  await page.getByRole("link", { name: "Logout" }).click();
  await expect(greeting).not.toBeVisible();
});

test("only three snowboards", async ({ page }) => {
  const PRODUCT_COUNT = 3;
  await page.goto("/");
  const heroLinks = page.getByTestId("hero-product-grid").getByRole("link");
  await expect(heroLinks).toHaveCount(3);
  await expect(heroLinks).toHaveText(
    Array.from({ length: PRODUCT_COUNT }, (_, i) => /Snowboard/),
  );
});

test("search for hydrogen", async ({ page, isMobile }) => {
  await page.goto("/");

  if (isMobile) {
    await page.getByRole("button", { name: "Open mobile menu" }).click();
  }

  await page
    .getByRole("textbox", { name: "Search for products..." })
    .fill("Hydrogen");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/search/);
  await page
    .getByRole("link", {
      name: "The Collection Snowboard: Liquid The Collection Snowboard: Liquid",
    })
    .click();
  await page.getByRole("button", { name: "Add item to cart" }).click();
  await page.getByRole("heading", { name: "My Cart" }).click();
});

test("calculate cart", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "The Multi-managed Snowboard" }).click();
  await page.getByRole("button", { name: "Add item to cart" }).click();

  const cart = page.getByTestId("cart");
  const cartItem = cart.getByTestId("cart-item").first();
  const cartTotal = page.getByTestId("cart-total");

  const readAmount = async (loc: Locator) => {
    await expect(loc).toBeVisible();
    const price = await loc.innerText();
    return parseFloat(price!.replace(/[^0-9.]/g, ""));
  };

  let unitPrice = await readAmount(cartItem.getByTestId("cart-item-price"));

  await test.step("Assert -> Double -> Assert", async () => {
    await expect(cartTotal).toHaveText(`${unitPrice}`);
    await cartItem
      .getByRole("button", { name: "Increase item quantity" })
      .click();
    await expect(cartTotal).toHaveText(`${unitPrice * 2}`);
  });
});

// ---------------- INLINE EXERCISE

test("locator-chaining", async ({ page }) => {
  await page.goto("/lessons/writing-tests/02-web-first-assertions/");
  const container = page.getByTestId("multi-element-assertions");
  const productsContainer = container.getByRole("region", { name: "Products" });
  const products = productsContainer.getByRole("listitem");

  await expect(products).toHaveCount(3);
  await expect(products).toHaveText([/Product 1/, /Product 2/, /Product 3/]);
});
