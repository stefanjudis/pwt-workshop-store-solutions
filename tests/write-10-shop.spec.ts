import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("Exercise 1: track js logs", async ({ page }) => {
  const logs: string[] = [];
  page.on("console", (log) => logs.push(log.text()));

  await page.goto("/?log=true");

  expect(logs).toHaveLength(0);
});

test("Exercise 2: catch bluesky", async ({ page }) => {
  await page.goto("/product/the-multi-managed-snowboard");
  const productTitle = await page
    .getByRole("heading", { level: 1 })
    .innerText();

  const blueskyPagePromise = page.waitForEvent("popup");
  await page.getByTestId("share-bluesky").click();
  const blueskyPage = await blueskyPagePromise;
  await expect(blueskyPage).toHaveURL("https://bsky.app/");
});

// ---------------- INLINE EXERCISE

test("Inline 1: track js errors", async ({ page }) => {
  const errors: Error[] = [];
  page.on("pageerror", (error) => errors.push(error));

  await page.goto("/lessons/writing-tests/10-page-events");
  await page
    .getByTestId("pageerror-exercise")
    .getByRole("button", { name: /Trigger an error/ })
    .click();

  expect(errors).toHaveLength(1);
  expect(errors[0].message).toBe("Boom! Something went wrong.");
});

test("Inline 2: answer a prompt", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("prompt");
    expect(dialog.message()).toBe("What's your name?");
    await dialog.accept("Stefan");
  });

  await page.goto("/lessons/writing-tests/10-page-events");
  const exercise = page.getByTestId("prompt-exercise");
  await exercise.getByRole("button", { name: "Tell me your name" }).click();

  await expect(exercise.getByTestId("prompt-greeting")).toHaveText(
    "Hi, Stefan!",
  );
});

test("Inline 3: downloads the invoice and checks its content", async ({
  page,
}) => {
  await page.goto("/lessons/writing-tests/10-page-events");

  // Start listening before the click, but don't await yet
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByTestId("download-exercise")
    .getByRole("link", { name: "Download invoice" })
    .click();
  const download = await downloadPromise;

  expect(await download.failure()).toBeNull();
  expect(download.suggestedFilename()).toBe("invoice-0042.txt");

  // `path()` resolves once the download has finished
  const content = await readFile(await download.path(), "utf-8");
  expect(content).toContain("Total: $42.00");
});
