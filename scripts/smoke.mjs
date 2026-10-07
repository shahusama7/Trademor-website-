import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const dataDir = await mkdtemp(join(tmpdir(), "trademor-smoke-"));
const port = 3107;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["server.js"], {
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(port),
    ENQUIRY_DATA_DIR: dataDir,
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Server did not start")),
      10000,
    );
    server.stdout.on("data", () => {
      clearTimeout(timeout);
      resolve();
    });
    server.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    server.on("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Server exited with ${code}`));
    });
  });
  assert.equal((await fetch(`${base}/api/health`)).status, 200);
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  await mkdir("/tmp/trademor-review/render", { recursive: true });
  for (const route of ["/", "/alibaba"]) {
    for (const width of [320, 390, 768, 1280, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`${base}${route}`);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `${route} overflows at ${width}`,
      );
      assert.equal(
        await page.evaluate(() =>
          [...document.images].every((i) => i.complete && i.naturalWidth > 0),
        ),
        true,
      );
      assert.deepEqual(errors, []);
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: `/tmp/trademor-review/render/${route === "/" ? "home" : "alibaba"}-${width === 1440 ? "desktop" : "mobile"}.png`,
          fullPage: true,
        });
      await page.close();
    }
  }
  const motionPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await motionPage.goto(base);
  const art = motionPage.locator(".growth-art");
  await art.hover({ position: { x: 40, y: 40 } });
  await motionPage.waitForFunction(() => parseFloat(document.querySelector(".growth-art").style.getPropertyValue("--motion-x")) < 0);
  const beforeScroll = await art.evaluate(el => el.style.getPropertyValue("--motion-y"));
  await motionPage.evaluate(() => scrollBy(0, 100));
  await motionPage.waitForFunction(before => document.querySelector(".growth-art").style.getPropertyValue("--motion-y") !== before, beforeScroll);
  await motionPage.emulateMedia({ reducedMotion: "reduce" });
  await motionPage.waitForFunction(() => getComputedStyle(document.querySelector(".art-arrow")).translate === "none");
  assert.equal(await motionPage.locator(".art-arrow img").evaluate(el => getComputedStyle(el).animationName), "none");
  await motionPage.getByRole("link", { name: "Let’s talk" }).first().click();
  assert.equal(await motionPage.locator(".click-wave").count(), 1);
  assert.equal(await motionPage.locator(".click-wave").evaluate(el => getComputedStyle(el).animationName), "reduced-click");
  await motionPage.close();
  console.log("PASS: pointer and scroll parallax; reduced-motion reset; click feedback.");
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await page.goto(base);
  await page.getByRole("button", { name: "Open navigation" }).tap();
  await page
    .locator("#main-navigation")
    .getByRole("link", { name: "Alibaba.com" })
    .tap();
  await page.waitForURL("**/alibaba");
  for (const name of [
    "Do you make your own products?",
    "Can you handle orders?",
    "Want buyers from other countries?",
  ])
    await page
      .getByRole("button", { name: new RegExp(name.replace(/[?]/g, "\\?")) })
      .tap();
  await page
    .getByText("You may be ready. Let’s talk about your business.", {
      exact: true,
    })
    .waitFor();
  await page.getByRole("button", { name: "Compare plans" }).tap();
  assert.equal(await page.getByRole("table").isVisible(), true);
  await page.getByRole("button", { name: "Compare plans" }).tap();
  await page
    .locator(".plan")
    .filter({
      has: page.getByRole("heading", { name: "Basic Plus", exact: true }),
    })
    .getByRole("link", { name: "Talk about this plan" })
    .tap();
  await page.getByRole("heading", { name: "Where are you today?" }).waitFor();
  await page.getByRole("button", { name: /Growing/ }).tap();
  await page.getByRole("button", { name: "Next step" }).tap();
  await page.getByLabel("Your name", { exact: true }).fill("Browser Test");
  await page.getByLabel("Business name", { exact: true }).fill("Test Company");
  await page
    .getByLabel("Contact number", { exact: true })
    .fill("+92 300 1234567");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("test@example.com");
  await page.route("**/api/enquiries", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({
        error: "We couldn’t save your enquiry. Please try again shortly.",
      }),
    }),
  );
  await page.getByRole("button", { name: "Let’s find your next move" }).tap();
  await page.getByRole("alert").waitFor();
  assert.equal(
    await page.getByLabel("Your name", { exact: true }).inputValue(),
    "Browser Test",
  );
  await page.unroute("**/api/enquiries");
  await page.getByRole("button", { name: "Let’s find your next move" }).tap();
  await page
    .getByRole("heading", { name: "Your next chapter starts here." })
    .waitFor();
  const record = JSON.parse(
    (await readFile(join(dataDir, "enquiries.jsonl"), "utf8")).trim(),
  );
  assert.equal(record.plan, "Basic Plus");
  assert.equal(record.goal, "Sell more");
  assert.equal(record.stage, "Growing");
  await page.locator("#contact").screenshot({
    path: "/tmp/trademor-review/render/form-success-mobile.png",
  });
  await page.getByRole("button", { name: "Send another enquiry" }).tap();
  assert.equal(
    await page.getByRole("button", { name: "Next step" }).isDisabled(),
    true,
  );
  await page.getByRole("button", { name: /Sell more/ }).tap();
  await page.getByRole("button", { name: "Next step" }).tap();
  await page.getByRole("button", { name: "Back", exact: true }).tap();
  assert.equal(
    await page
      .getByRole("button", { name: /Sell more/ })
      .getAttribute("aria-pressed"),
    "true",
  );
  console.log(
    "PASS: both routes at five widths; mobile navigation; readiness; plan comparison; form failure recovery, persistence and reset.",
  );
} finally {
  if (browser) await browser.close();
  server.kill("SIGTERM");
  await rm(dataDir, { recursive: true, force: true });
}
