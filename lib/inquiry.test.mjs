// Jalankan: node --test lib/inquiry.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { MIN_FILL_MS, toWaNumber, validateInquiry, waLink } from "./inquiry.js";

const now = 1_000_000;
const valid = {
  nama: " Budi ", perusahaan: "PT A", email: "budi@contoh.id", telepon: "0812-3456-7890",
  jenis: "driver", pesan: "Butuh 2 driver", startedAt: now - MIN_FILL_MS,
};
const check = (patch) => validateInquiry({ ...valid, ...patch }, ["driver"], now);

test("validateInquiry menerima isian lengkap dan merapikan spasi", () => {
  assert.deepEqual(check({}).data, {
    nama: "Budi", perusahaan: "PT A", email: "budi@contoh.id", telepon: "0812-3456-7890",
    pesan: "Butuh 2 driver", service_id: "driver",
  });
});

test("validateInquiry menyimpan pilihan lainnya sebagai null", () => {
  assert.equal(check({ jenis: "lainnya" }).data.service_id, null);
});

test("validateInquiry menolak isian tidak valid", () => {
  assert.ok(validateInquiry(null, [], now).error);
  assert.ok(check({ nama: "   " }).error);
  assert.ok(check({ email: "bukan-email" }).error);
  assert.ok(check({ telepon: "abc" }).error);
  assert.ok(check({ jenis: "tetap" }).error);
  assert.ok(check({ pesan: "x".repeat(2001) }).error);
});

test("validateInquiry menandai bot sebagai spam", () => {
  assert.equal(check({ website: "http://spam" }).spam, true);
  assert.equal(check({ startedAt: now }).spam, true);
  assert.equal(check({ startedAt: undefined }).spam, true);
});

test("toWaNumber menormalkan nomor WhatsApp", () => {
  assert.equal(toWaNumber("0812-3456-7890"), "6281234567890");
  assert.equal(toWaNumber("+62 812 3456 7890"), "6281234567890");
  assert.equal(toWaNumber("[Nomor WhatsApp]"), "");
  assert.equal(toWaNumber(undefined), "");
});

test("waLink menyusun pesan yang ter-encode", () => {
  const url = waLink("6281234567890", {
    nama: "Budi", perusahaan: "PT A & B", email: "budi@contoh.id", telepon: "0812", jenis: "Driver", pesan: "2 driver?",
  });
  assert.ok(url.startsWith("https://wa.me/6281234567890?text="));
  const text = decodeURIComponent(url.split("?text=")[1]);
  assert.match(text, /\nPerusahaan: PT A & B\n/);
  assert.match(text, /Kebutuhan: 2 driver\?$/);
});
