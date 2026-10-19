// Jalankan: node --test lib/inquiry.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateInquiry, LIMITS, MIN_FILL_MS } from "./inquiry.js";

const now = 1_000_000;
const ids = ["driver", "security"];
const valid = (extra = {}) => ({
  nama: " Budi ", perusahaan: "PT Contoh", kontak: "budi@contoh.id", jenis: "driver",
  deskripsi: "2 driver di Jakarta", startedAt: now - MIN_FILL_MS, ...extra,
});

test("menerima dan merapikan isian yang valid", () => {
  const { data } = validateInquiry(valid(), ids, now);
  assert.equal(data.nama, "Budi");
  assert.equal(data.jenis, "driver");
  assert.equal(validateInquiry(valid({ jenis: "lainnya" }), ids, now).data.jenis, "lainnya");
  assert.ok(!("startedAt" in data) && !("website" in data));
});

test("menandai spam: honeypot terisi atau dikirim terlalu cepat", () => {
  assert.ok(validateInquiry(valid({ website: "http://spam" }), ids, now).spam);
  assert.ok(validateInquiry(valid({ startedAt: now - 500 }), ids, now).spam);
  assert.ok(validateInquiry(valid({ startedAt: undefined }), ids, now).spam);
});

test("menolak isian yang tidak valid", () => {
  assert.ok(validateInquiry(null, ids, now).error);
  assert.ok(validateInquiry(valid({ nama: "   " }), ids, now).error);
  assert.ok(validateInquiry(valid({ nama: 123 }), ids, now).error);
  assert.ok(validateInquiry(valid({ kontak: "ab" }), ids, now).error);
  assert.ok(validateInquiry(valid({ jenis: "hacker" }), ids, now).error);
  assert.ok(validateInquiry(valid({ deskripsi: "x".repeat(LIMITS.deskripsi + 1) }), ids, now).error);
});
