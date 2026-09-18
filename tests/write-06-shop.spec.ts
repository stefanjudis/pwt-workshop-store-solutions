import test, { expect } from "@playwright/test";

test("Exercise 1: fight the flake", async ({ page }) => {
  await page.addLocatorHandler(page.getByText("You're lucky!"), async () => {
    await page.getByRole("button", { name: "No thanks" }).click();
  });

  await page.goto("/?chaos", { waitUntil: "domcontentloaded" });
  await page.getByTestId("hero-product-grid").getByRole("link").nth(2).click();

  await page.getByRole("button", { name: "Add item to cart" }).click();
  await page.getByRole("button", { name: "Close cart" }).click();
});

test("Exercise 2: fight the flake", async ({ page, isMobile }) => {
  const USER_NAME = "Stefan";
  await page.addLocatorHandler(page.getByText("You're lucky!"), async () => {
    await page.getByRole("button", { name: "No thanks" }).click();
  });

  await page.goto("/?chaos", { waitUntil: "domcontentloaded" });

  if (isMobile) {
    await page.getByRole("button", { name: "Open mobile menu" }).click();
  }

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Your name" }).fill(USER_NAME);
  await page.getByRole("textbox", { name: "Your password" }).fill("password");

  await expect(async () => {
    await page.getByRole("button", { name: "Login" }).click();
    const greeting = page.getByTestId("login-name");
    const shortTimeout = 3_000;
    await expect(greeting).toBeVisible({ timeout: shortTimeout });
    await expect(greeting).toHaveText(USER_NAME, { timeout: shortTimeout });
  }).toPass();
});
