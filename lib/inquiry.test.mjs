// Jalankan: node --test lib/inquiry.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { toWaNumber, waLink } from "./inquiry.js";

test("toWaNumber menormalkan nomor WhatsApp", () => {
  assert.equal(toWaNumber("0812-3456-7890"), "6281234567890");
  assert.equal(toWaNumber("+62 812 3456 7890"), "6281234567890");
  assert.equal(toWaNumber("[Nomor WhatsApp]"), "");
  assert.equal(toWaNumber(undefined), "");
});

test("waLink menyusun pesan yang ter-encode", () => {
  const url = waLink("6281234567890", {
    nama: "Budi", perusahaan: "PT A & B", kontak: "budi@contoh.id", jenis: "Driver", deskripsi: "2 driver?",
  });
  assert.ok(url.startsWith("https://wa.me/6281234567890?text="));
  const text = decodeURIComponent(url.split("?text=")[1]);
  assert.match(text, /\nPerusahaan: PT A & B\n/);
  assert.match(text, /Kebutuhan: 2 driver\?$/);
});
