// Jalankan: node --test middleware.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server.js";
import { middleware } from "./middleware.js";

test("membuang utm_source=chatgpt.com dan mempertahankan parameter lain", () => {
  const res = middleware(new NextRequest("https://x.id/layanan?a=1&utm_source=chatgpt.com&b=2"));
  assert.equal(res.status, 308);
  assert.equal(res.headers.get("location"), "https://x.id/layanan?a=1&b=2");
});

test("utm_source lain tidak di-redirect", () => {
  const res = middleware(new NextRequest("https://x.id/?utm_source=google"));
  assert.equal(res.headers.get("location"), null);
});
