import { expect, test } from "./base";

test("final checkout", async ({ page }) => {
  await page.request.post("/api/login/", {
    data: {
      name: "Joe",
    },
  });

  await test.step("get to checkout", async () => {
    await page.goto("/");
    await page
      .getByTestId("hero-product-grid")
      .getByRole("link")
      .first()
      .click();
    await page.getByRole("button", { name: "Add item to cart" }).click();
    await page.getByRole("link", { name: "Proceed to Checkout" }).click();
  });

  await test.step("fill out checkout", async () => {
    await page
      .getByRole("textbox", { name: "Email" })
      .fill("stefanjudis@gmail.coms");
    await page.getByRole("textbox", { name: "Full name" }).fill("Stefan");
    await page.getByRole("textbox", { name: "Street" }).fill("abc");
    await page.getByRole("textbox", { name: "City" }).fill("Berlin");
    await page.getByRole("textbox", { name: "Postal code" }).fill("13187");
    await page.getByLabel("Country").selectOption("DE");
    await page
      .getByRole("textbox", { name: "Card number" })
      .fill("4242424242424242");
    await page.getByRole("textbox", { name: "Expiry (MM/YY)" }).fill("11/25");
    await page.getByRole("textbox", { name: "CVC" }).fill("123");
  });

  const responsePromise = page.waitForResponse("/api/checkout/");
  await page.getByTestId("place-order").click();
  const response = await responsePromise;
  const order = await response.json();
  const { orderNumber } = order;

  await expect(page.getByTestId("order-number")).toContainText(orderNumber);
});
