import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../server.js";

const valid = {
  name: "Test Owner",
  business: "Test Manufacturing",
  phone: "+92 300 1234567",
  email: "owner@example.com",
  goal: "Sell more",
  stage: "Growing",
  plan: "Basic Plus",
};

test("enquiry API saves valid requests, rejects invalid and cross-origin requests", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "trademor-test-"));
  const server = createApp({ dataDir }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(dataDir, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (body, headers = {}) =>
    fetch(`${base}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  const response = await post(valid);
  assert.equal(response.status, 201);
  const { reference } = await response.json();
  const stored = JSON.parse(
    (await readFile(join(dataDir, "enquiries.jsonl"), "utf8")).trim(),
  );
  assert.equal(stored.reference, reference);
  assert.equal(stored.email, valid.email);
  assert.equal(stored.plan, "Basic Plus");
  for (const body of [
    { ...valid, email: "bad" },
    { ...valid, phone: "1" },
    { ...valid, goal: "Unknown" },
    { ...valid, name: "" },
    { ...valid, website: "spam" },
  ])
    assert.equal((await post(body)).status, 400);
  assert.equal(
    (await post(valid, { Origin: "https://foreign.example" })).status,
    403,
  );
  assert.equal(
    (await readFile(join(dataDir, "enquiries.jsonl"), "utf8"))
      .trim()
      .split("\n").length,
    1,
  );
  assert.equal((await fetch(`${base}/api/health`)).status, 200);
});

test("enquiry API limits repeated submissions", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "trademor-limit-"));
  const server = createApp({ dataDir }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(dataDir, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}/api/enquiries`;
  for (let i = 0; i < 8; i++)
    assert.equal(
      (
        await fetch(base, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(valid),
        })
      ).status,
      201,
    );
  assert.equal(
    (
      await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valid),
      })
    ).status,
    429,
  );
});
