import { expect, test } from "bun:test";
import { Locale } from "../src/Locale.ts";

test("Locale should work", () => {
  expect(Locale.t("en", "Invoices %d", 1)).toBe("Invoices 1");
  expect(Locale.t("de-AT", "invoice")).toBe("Rechnung");
});
