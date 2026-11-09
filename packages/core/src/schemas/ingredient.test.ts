import { describe, expect, it } from "vitest";
import { IngredientSchema } from "./ingredient.js";

const validIngredient = {
  raw: "200 g flour, sifted",
  name: "flour",
  amount: 200,
  unit: "g",
  note: "sifted",
  optional: false,
};

type IngredientKey = keyof typeof validIngredient;

function withField(
  key: IngredientKey,
  value: unknown,
): Record<string, unknown> {
  return { ...validIngredient, [key]: value };
}

function withoutField(key: IngredientKey): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(validIngredient).filter(([k]) => k !== key),
  );
}

/** Asserts parsing fails and that at least one issue points at `path`. */
function expectIssueAt(input: unknown, path: readonly PropertyKey[]): void {
  const result = IngredientSchema.safeParse(input);
  expect(result.success, "expected parse to fail").toBe(false);
  if (result.success) return;
  const paths = result.error.issues.map((issue) => issue.path);
  expect(paths).toContainEqual(path);
}

function expectValid(input: unknown): void {
  const result = IngredientSchema.safeParse(input);
  expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
}

const UNITS_BY_KIND = {
  mass: ["g", "kg", "oz", "lb"],
  volume: ["ml", "l", "tsp", "tbsp", "cup", "fl_oz"],
  approximate: ["pinch", "dash"],
  count: ["piece", "clove", "can", "slice", "bunch", "sprig"],
} as const;

describe("IngredientSchema", () => {
  describe("valid ingredients", () => {
    it("accepts a full ingredient and returns it unchanged", () => {
      const result = IngredientSchema.safeParse(validIngredient);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validIngredient);
      }
    });

    it("accepts amount: null with unit: null (to taste) and keeps both null", () => {
      const toTaste = {
        raw: "salt to taste",
        name: "salt",
        amount: null,
        unit: null,
        note: null,
        optional: false,
      };
      const result = IngredientSchema.safeParse(toTaste);
      expect(result.success).toBe(false);
      if (result.success) {
        expect(result.data.amount).toBeNull();
        expect(result.data.unit).toBeNull();
      }
    });

    it('accepts a countable item with unit "piece" ("2 eggs")', () => {
      expectValid({
        raw: "2 eggs",
        name: "egg",
        amount: 2,
        unit: "piece",
        note: null,
        optional: false,
      });
    });

    it("accepts an unsupported unit captured as unit: null with the text in note", () => {
      expectValid({
        raw: "1 handful spinach",
        name: "spinach",
        amount: 1,
        unit: null,
        note: "handful",
        optional: false,
      });
    });

    it("accepts optional: true", () => {
      expectValid(withField("optional", true));
    });
  });

  describe("unit", () => {
    for (const [kind, units] of Object.entries(UNITS_BY_KIND)) {
      describe(kind, () => {
        it.each(units)("accepts %s", (unit) => {
          expectValid(withField("unit", unit));
        });
      });
    }

    it.each([
      "handful",
      "knob",
      "fl oz", // volume ounces must be spelled fl_oz
      "floz",
      "cups", // canonical singular only
      "OZ",
      "",
    ])("rejects unknown unit %j", (unit) => {
      expectIssueAt(withField("unit", unit), ["unit"]);
    });

    it("rejects a non-null unit when amount is null", () => {
      expectIssueAt({ ...validIngredient, amount: null, unit: "g" }, ["unit"]);
    });
  });

  describe("amount", () => {
    it.each([
      ["a numeric string", "200"],
      ["NaN", Number.NaN],
      ["Infinity", Number.POSITIVE_INFINITY],
      ["-Infinity", Number.NEGATIVE_INFINITY],
      ["zero", 0],
      ["negative", -1],
    ])("rejects %s", (_label, amount) => {
      expectIssueAt(withField("amount", amount), ["amount"]);
    });

    it.todo('represents ranges like "1-2 cloves"');
  });

  describe("name and raw", () => {
    it("rejects an empty name", () => {
      expectIssueAt(withField("name", ""), ["name"]);
    });

    it("rejects a whitespace-only name", () => {
      expectIssueAt(withField("name", "   \t"), ["name"]);
    });

    it("rejects an empty raw", () => {
      expectIssueAt(withField("raw", ""), ["raw"]);
    });
  });

  describe("shape", () => {
    it.each(["amount", "unit", "note", "optional"] as const)(
      "rejects a missing %s (nullable fields are still required)",
      (key) => {
        expectIssueAt(withoutField(key), [key]);
      },
    );

    it("rejects unknown extra keys", () => {
      const result = IngredientSchema.safeParse({
        ...validIngredient,
        quantity: 200,
      });
      expect(result.success, "expected parse to fail").toBe(false);
      if (result.success) return;
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: "unrecognized_keys",
          keys: ["quantity"],
          path: [],
        }),
      );
    });
  });
});
