// Jalankan: node --test lib/image.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { safeImageSrc } from "./image.js";

const base = "https://abc.supabase.co";

test("safeImageSrc menerima file lokal dan Supabase Storage publik", () => {
  assert.equal(safeImageSrc(" /images/a.jpg ", base), "/images/a.jpg");
  assert.equal(safeImageSrc(`${base}/storage/v1/object/public/foto/a b.jpg`, base), `${base}/storage/v1/object/public/foto/a%20b.jpg`);
});

test("safeImageSrc menolak sumber lain", () => {
  const bad = [
    null, "", "a.jpg", "//jahat.com/a.jpg", "/\\jahat.com", "https://jahat.com/a.jpg", "javascript:alert(1)",
    `${base}/rest/v1/x`, `${base}.jahat.com/storage/v1/object/public/a.jpg`,
  ];
  for (const src of bad) assert.equal(safeImageSrc(src, base), undefined, String(src));
  assert.equal(safeImageSrc(`${base}/storage/v1/object/public/a.jpg`, undefined), undefined);
});
