import { expect, test } from "./base";

test("search for a snowboard and add it to the cart", async ({
  page,
  isMobile,
}) => {
  const SEARCH_TERM = "snowboard";

  await test.step("search for snowboards", async () => {
    await page.goto("/");

    if (isMobile) {
      await page.getByRole("button", { name: "Open mobile menu" }).click();
    }

    await page
      .getByRole("textbox", { name: "Search for products..." })
      .fill(SEARCH_TERM);
    // pressing "Enter" doesn't submit the search form, the button does
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page).toHaveURL(`/search/?q=${SEARCH_TERM}`);
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(
      page.getByText(new RegExp(`Showing \\d+ results for "${SEARCH_TERM}"`)),
    ).toBeVisible();
  });

  // the search also returns non-snowboard products (e.g. a gift card)
  const firstSnowboard = page
    .getByTestId("search-grid")
    .getByRole("link", { name: /snowboard/i })
    .first();
  const firstSnowboardName = firstSnowboard.getByRole("heading");
  const firstSnowboardPrice = firstSnowboard.getByTestId("product-price");

  // make sure name and price are rendered before reading them
  await expect(firstSnowboardName).toHaveText(/snowboard/i);
  await expect(firstSnowboardPrice).toHaveText(/^\d+(\.\d+)?$/);
  const name = await firstSnowboardName.innerText();
  const price = await firstSnowboardPrice.innerText();

  await test.step("open the first snowboard", async () => {
    await firstSnowboard.click();

    await expect(page).toHaveURL(/\/product\/.+/);
    await expect(page).toHaveTitle(new RegExp(name));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    // the product page reuses the "cart-item-price" test id for its price
    await expect(
      page.getByRole("main").getByTestId("cart-item-price"),
    ).toHaveText(price);
  });

  await test.step("add the snowboard to the cart", async () => {
    await page.getByRole("button", { name: "Add item to cart" }).click();
  });

  await test.step("validate the cart", async () => {
    const cart = page.getByTestId("cart");
    const cartItems = cart.getByTestId("cart-item");

    await expect(cart.getByRole("heading", { name: "My Cart" })).toBeVisible();
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems.getByRole("heading")).toHaveText(name);
    await expect(cartItems.getByTestId("cart-item-price")).toHaveText(price);
    await expect(cartItems.getByTestId("cart-item-quantity")).toHaveText("1");
    await expect(cart.getByTestId("cart-total")).toHaveText(price);
    await expect(
      cart.getByRole("link", { name: "Proceed to Checkout" }),
    ).toBeVisible();

    await cart.getByRole("button", { name: "Close cart" }).click();

    await expect(cart).toBeHidden();
    await expect(page.getByRole("button", { name: "Open cart" })).toHaveText(
      "1",
    );
  });
});
