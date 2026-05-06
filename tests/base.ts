import { test as base } from "@playwright/test";

export type TestOptions = {};

export const test = base.extend<TestOptions>({
  page: async ({ page }, use) => {
    // before test
    await use(page);
    // after test
  },
});

export { expect } from "@playwright/test";
