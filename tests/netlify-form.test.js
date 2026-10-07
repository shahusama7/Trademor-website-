import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { submitEnquiry } from "../src/enquiries.js";

test("Netlify submission includes discovery name, every field and a stored reference", async () => {
  const values = {
    name: "Test Owner",
    business: "Textiles & Crafts + Co",
    phone: "+92 300 1234567",
    email: "owner+exports@example.com",
    goal: "Sell more",
    stage: "Growing",
    plan: "Basic Plus",
    website: "",
  };
  let fields;
  const result = await submitEnquiry(values, {
    provider: "netlify",
    fetchImpl: async (url, request) => {
      assert.equal(url, "/");
      assert.equal(request.method, "POST");
      assert.equal(
        request.headers["Content-Type"],
        "application/x-www-form-urlencoded",
      );
      fields = new URLSearchParams(request.body);
      assert.equal(fields.get("form-name"), "trademor-enquiries");
      for (const [name, value] of Object.entries(values))
        assert.equal(fields.get(name), value);
      return { ok: true };
    },
  });
  assert.equal(fields.get("reference"), result.reference);
  assert.match(result.reference, /^TM-[a-f0-9-]{36}$/);
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  for (const name of [...Object.keys(values), "reference"])
    assert.ok(html.includes(`name="${name}"`));
  assert.ok(html.includes('data-netlify="true"'));
});

test("failed Netlify submission does not return a success receipt", async () => {
  await assert.rejects(
    submitEnquiry(
      {},
      { provider: "netlify", fetchImpl: async () => ({ ok: false }) },
    ),
    /couldn’t send your enquiry/,
  );
});
