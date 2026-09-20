import { expect, test } from "@playwright/test";

test("take a screenshot", async ({ page, browserName }) => {
  await page.goto("/");

  // take a page screenshot
  await page.screenshot({ path: "./home.png" });

  // take a single screenshot
  // await page.getByRole("link", { name: "Go to home" }).screenshot({
  //   path: `./screenshots/${browserName}products-link.png`,
  // });

  // turn on visual regression testing
  await expect(page.getByRole("link", { name: "Go to home" })).toHaveScreenshot(
    "home-link.png",
  );
});

test("Exercise 1: masked product card screenshot", async ({
  page,
}, testInfo) => {
  await page.goto("/search");

  await expect(page).toHaveScreenshot({
    maxDiffPixelRatio: 0.1,
    mask: [page.getByTestId("search-grid").getByRole("link")],
  });
});

// ---------------- INLINE EXERCISE

test("product card screenshot", async ({ page }, testInfo) => {
  await page.goto("/search");

  const screenshot = await page
    .getByTestId("search-grid")
    .getByRole("link")
    .first()
    .screenshot();

  await testInfo.attach("screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
