import { expect, test } from "@playwright/test";

test("Exercise 1: validate checkout gate", async ({ request }) => {
  const response = await request.post("/api/checkout/");
  await expect(response.status()).toBe(401);
});

test("Exercise 2: fake the login", async ({ page, request }) => {
  await page.request.post("/api/login/", {
    data: {
      name: "Joe",
    },
  });

  await page.goto("/");
  await expect(page.getByTestId("login-name")).toContainText("Joe");
});

// ---------------- INLINE EXERCISE

test("Inline 1: validate products", async ({ request }) => {
  const response = await request.get("/api/products/");
  await expect(response).toBeOK();

  const products = await response.json();
  for (const product of products) {
    expect(Number(product.priceRange.minVariantPrice.amount)).toBeGreaterThan(
      0,
    );
  }
});
