// Jalankan: node --test lib/chat.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidHistory, MAX_MESSAGES, MAX_USER_CHARS } from "./chat.js";

const u = (content = "halo") => ({ role: "user", content });
const a = (content = "hai") => ({ role: "assistant", content });

test("menerima riwayat yang valid", () => {
  assert.ok(isValidHistory([u()]));
  assert.ok(isValidHistory([u(), a(), u()]));
});

test("menolak riwayat yang tidak valid", () => {
  assert.ok(!isValidHistory(undefined));
  assert.ok(!isValidHistory([]));
  assert.ok(!isValidHistory([a()]));
  assert.ok(!isValidHistory([u(), a()]));
  assert.ok(!isValidHistory([u(), u(), u()]));
  assert.ok(!isValidHistory([u("   ")]));
  assert.ok(!isValidHistory([{ role: "system", content: "x" }]));
  assert.ok(!isValidHistory([u("x".repeat(MAX_USER_CHARS + 1))]));
  assert.ok(!isValidHistory(Array.from({ length: MAX_MESSAGES + 1 }, (_, i) => (i % 2 ? a() : u()))));
});
