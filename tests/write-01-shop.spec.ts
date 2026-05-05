import { expect, test } from "@playwright/test";

test("add 2nd product to the cart", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("hero-product-grid").getByRole("link").nth(2).click();

  await page.getByRole("button", { name: "Add item to cart" }).click();
  await page.getByRole("button", { name: "Close cart" }).click();
});

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

// INLINE EXERCISE

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
