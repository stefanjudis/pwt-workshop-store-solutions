import test, { expect } from "@playwright/test";

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

// ---------------- INLINE EXERCISE

test("locator-chaining", async ({ page }) => {
  await page.goto("/lessons/writing-tests/02-web-first-assertions/");
  const container = page.getByTestId("multi-element-assertions");
  const productsContainer = container.getByRole("region", { name: "Products" });
  const products = productsContainer.getByRole("listitem");

  await expect(products).toHaveCount(3);
  await expect(products).toHaveText([/Product 1/, /Product 2/, /Product 3/]);
});
