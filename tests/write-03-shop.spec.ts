import { expect, test } from "@playwright/test";

test("Exercise 1: ARIA check on search navigations", async ({
  page,
  isMobile,
}) => {
  if (isMobile) test.skip();

  await page.goto("/search/");

  await expect(page.getByRole("main")).toMatchAriaSnapshot(`
    - navigation "Collections":
      - heading "Collections" [level=3]
      - list
    - region "Products":
      - heading "Products" [level=1]
      - list
    - navigation "Sort by":
      - heading "Sort by" [level=3]
      - list:
        - listitem:
          - link "Relevance"
        - listitem:
          - link "Trending"
        - listitem:
          - link "Latest arrivals"
        - listitem:
          - 'link "Price: Low to high"'
        - listitem:
          - 'link "Price: High to low"'
    `);
});

test("Exercise 2: ARIA check on main navigation", async ({
  page,
  isMobile,
}) => {
  await page.goto("https://www.playwright-workshop.online/");

  if (isMobile) {
    await expect(page.getByLabel("Main")).toMatchAriaSnapshot(`
    - navigation "Main":
      - button "Open mobile menu"
      - link "Go to home":
        - /url: /
        - img "pwt logo"
      - button "Open cart"
    `);
  } else {
    await expect(page.getByLabel("Main")).toMatchAriaSnapshot(`
      - navigation "Main":
        - link "Go to home"
        - list:
          - listitem:
            - link "Products":
              - /url: /search/
          - listitem:
            - link "Workshop":
              - /url: /lessons/
        - textbox "Search for products..."
        - button "Search"
        - link "Login":
          - /url: /login/
        - button "Open cart"
     `);
  }
});

// ---------------- INLINE EXERCISE

test("aria-snapshot", async ({ page }) => {
  await page.goto("/lessons/writing-tests/03-accessibility-assertions/");
  const container = page.getByTestId("aria-snapshot-exercise");
  await expect(container.getByLabel("Newsletter form")).toMatchAriaSnapshot(`
      - heading [level=2]
      - paragraph
      - button "Submit"
      - button "Undo"
    `);
});

test("aria-description", async ({ page }) => {
  await page.goto("/lessons/writing-tests/03-accessibility-assertions/");
  const container = page.getByTestId("accessible-description-exercise");
  await container.getByRole("button", { name: "Validate" }).click();
  await expect(
    container.getByLabel("Email address"),
  ).toHaveAccessibleDescription("Please enter your email address.");
});
