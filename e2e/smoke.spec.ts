import { expect, test } from "@playwright/test";

test.describe("marketing site", () => {
  test("landing page renders hero and nav", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Level up",
    );
    await expect(
      page.getByRole("link", { name: "Start your quest" }),
    ).toBeVisible();
  });

  test("auth pages render", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await page.goto("/sign-up");
    await expect(
      page.getByRole("heading", { name: "Start your quest" }),
    ).toBeVisible();
  });
});

test.describe("app (demo mode)", () => {
  test("dashboard renders stats and continue-learning", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("Welcome back, Pixel Dev")).toBeVisible();
    await expect(page.getByText("Continue learning")).toBeVisible();
  });

  test("learning map renders and navigates into a world", async ({ page }) => {
    await page.goto("/learn");
    await expect(
      page.getByRole("heading", { name: "Learning worlds" }),
    ).toBeVisible();
    await page.getByRole("link", { name: /Claude Code/ }).first().click();
    await expect(page).toHaveURL(/\/learn\/claude-code/);
  });

  test("lesson player runs a full flashcard step", async ({ page }) => {
    await page.goto("/lesson/claude-code-8");
    await expect(page.getByText(/Study these/)).toBeVisible();
  });

  test("achievements page filters", async ({ page }) => {
    await page.goto("/achievements");
    await expect(
      page.getByRole("heading", { name: "Achievements" }),
    ).toBeVisible();
    await page.getByLabel("Search achievements").fill("streak");
    await expect(page.getByText("Streak: 7")).toBeVisible();
  });
});
