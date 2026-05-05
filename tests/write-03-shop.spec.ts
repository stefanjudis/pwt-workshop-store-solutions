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
