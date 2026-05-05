import test, { expect } from "@playwright/test";

test("mock the geo box", async ({ page }) => {
  await page.route("**/api/geo/", (route) => {
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ country: "DE" }),
    });
  });
  await page.goto("/");

  await expect(page.getByTestId("geo-location")).toContainText("DE");
});

test("break the news", async ({ page }) => {
  await page.route("**/api/news/", async (route) => {
    const response = await route.fetch();
    const news = await response.json();

    return route.fulfill({
      status: 500,
      contentType: "application/json",
      json: news,
    });
  });
  await page.goto("/");

  await expect(page.getByTestId("newsbox")).toContainText(/No news today/);
});

test("block all the images", async ({ page }) => {
  await page.route("**/*", (route) => {
    const type = route.request().resourceType();
    if (type === "image" || type === "media" || type === "font") {
      return route.abort();
    }
    return route.continue();
  });

  await page.goto("/");
  await expect(page).toHaveScreenshot("no-images.png");
});

// ---------------- INLINE EXERCISE

test("mock the news box", async ({ page }) => {
  await page.route("**/api/news/", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "🚨 Test news!" }),
    }),
  );
  await page.goto("/");

  await expect(page.getByTestId("newsbox")).toContainText("🚨 Test news!");
});

test("block the tracking script", async ({ page }) => {
  const messages: string[] = [];
  page.on("console", (msg) => messages.push(msg.text()));

  await page.route("**/dummy-tracker.js", (route) => route.abort());
  await page.goto("/");

  expect(messages).not.toContain("Watch out! I'm tracking you!");
});
