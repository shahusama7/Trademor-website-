import express from "express";
import { appendFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const goals = new Set([
  "Sell more",
  "Find more buyers",
  "Enter new markets",
  "Get paid globally",
  "Not sure yet",
]);
const stages = new Set(["Just starting", "Growing", "Selling globally"]);
const plans = new Set([
  "",
  "Basic",
  "Basic Plus",
  "GGS Pro",
  "Verified Supplier",
]);

export function createApp({
  dataDir = resolve(root, ".data"),
  rateLimit = true,
} = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "8kb" }));
  app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Referrer-Policy", "strict-origin-when-cross-origin");
    if (req.path.startsWith("/api/")) res.set("Cache-Control", "no-store");
    next();
  });
  const requests = new Map();
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.post("/api/enquiries", async (req, res, next) => {
    const origin = req.get("origin");
    if (origin) {
      try {
        if (new URL(origin).host !== req.get("host"))
          return res
            .status(403)
            .json({
              error: "Please submit the form from the Trademor website.",
            });
      } catch {
        return res.status(403).json({ error: "Invalid request origin." });
      }
    }
    const now = Date.now();
    if (rateLimit) {
      for (const [ip, entry] of requests)
        if (now - entry.start > 600000) requests.delete(ip);
      const entry = requests.get(req.ip) || { start: now, count: 0 };
      if (entry.count >= 8)
        return res
          .status(429)
          .json({
            error:
              "You’ve sent several requests. Please try again in 10 minutes.",
          });
      entry.count++;
      requests.set(req.ip, entry);
    }
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body))
      return res
        .status(400)
        .json({ error: "Please complete all the form fields." });
    if (body.website)
      return res.status(400).json({ error: "Unable to accept this request." });
    const fields = ["name", "business", "phone", "email", "goal", "stage"];
    if (
      fields.some((key) => typeof body[key] !== "string" || !body[key].trim())
    )
      return res
        .status(400)
        .json({ error: "Please complete all the form fields." });
    const values = Object.fromEntries(
      fields.map((key) => [key, body[key].trim()]),
    );
    const plan = typeof body.plan === "string" ? body.plan : "";
    if (
      fields.some((key) => values[key].length > (key === "email" ? 254 : 160))
    )
      return res
        .status(400)
        .json({
          error:
            "One of your details is too long. Please shorten it and try again.",
        });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      return res
        .status(400)
        .json({ error: "Please enter a valid email address." });
    if (
      values.phone.replace(/\D/g, "").length < 7 ||
      values.phone.replace(/\D/g, "").length > 15 ||
      !/^[+\d\s().-]+$/.test(values.phone)
    )
      return res
        .status(400)
        .json({
          error:
            "Please enter a valid contact number, including your country code.",
        });
    if (
      !goals.has(values.goal) ||
      !stages.has(values.stage) ||
      !plans.has(plan)
    )
      return res
        .status(400)
        .json({ error: "Please select your goal and business stage again." });
    const reference = `TM-${randomUUID()}`;
    try {
      await mkdir(dataDir, { recursive: true, mode: 0o700 });
      await appendFile(
        resolve(dataDir, "enquiries.jsonl"),
        JSON.stringify({
          reference,
          createdAt: new Date(now).toISOString(),
          ...values,
          plan,
        }) + "\n",
        { mode: 0o600 },
      );
      res.status(201).json({ reference });
    } catch (error) {
      next(error);
    }
  });
  return app;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const app = createApp({
    dataDir: process.env.ENQUIRY_DATA_DIR || resolve(root, ".data"),
  });
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(resolve(root, "dist")));
    for (const route of ["/", "/alibaba", "/alibaba/"])
      app.get(route, (req, res) =>
        res.sendFile(resolve(root, "dist/index.html")),
      );
    app.use((req, res) => res.status(404).send("Page not found"));
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({
      root,
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }
  app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed")
      return res.status(400).json({ error: "Invalid form request." });
    if (error.type === "entity.too.large")
      return res.status(413).json({ error: "This form request is too large." });
    console.error("Request failed:", error.code || error.name);
    res
      .status(500)
      .json({
        error: "We couldn’t save your enquiry. Please try again shortly.",
      });
  });
  const port = Number(process.env.PORT || 3000);
  app.listen(port, "0.0.0.0", () =>
    console.log(
      `Trademor ${process.env.NODE_ENV === "production" ? "production" : "development"} server listening on port ${port}`,
    ),
  );
}
