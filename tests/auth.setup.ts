import { expect, test as setup } from "@playwright/test";

const authFilePath = "./tests/auth.json";

setup("login", async ({ page }) => {
  const USER_NAME = "Stefan";

  await page.goto("/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Your name" }).fill(USER_NAME);
  await page.getByRole("textbox", { name: "Your password" }).fill("password");
  await page.getByRole("button", { name: "Login" }).click();

  const greeting = page.getByTestId("login-name");
  await expect(greeting).toBeVisible();
  await expect(greeting).toHaveText(USER_NAME);

  await page.context().storageState({ path: authFilePath });
});
