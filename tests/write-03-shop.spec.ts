import test, { expect } from "@playwright/test";

// ---------------- INLINE EXERCISE

test("aria-snapshot", async ({ page }) => {
  await page.goto("/lessons/writing-tests/03-accessibility-assertions/");
  const container = page.getByTestId("aria-snapshot-exercise");
  await expect(container.getByLabel("Newsletter form")).toMatchAriaSnapshot(`
    - region "Newsletter form":
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
