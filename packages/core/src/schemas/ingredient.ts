import { z } from "zod";

/** Canonical units. Anything else is captured as `unit: null` with the text in `note`. */
export const UnitSchema = z.enum([
  // mass
  "g",
  "kg",
  "oz",
  "lb",
  // volume
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup",
  "fl_oz",
  // approximate
  "pinch",
  "dash",
  // count
  "piece",
  "clove",
  "can",
  "slice",
  "bunch",
  "sprig",
]);

export type Unit = z.infer<typeof UnitSchema>;

export const IngredientSchema = z
  .strictObject({
    /** Original line as written in the source recipe. */
    raw: z.string().min(1),
    name: z.string().min(1).regex(/\S/, "name must not be blank"),
    /** `null` when unknown (e.g. "to taste"). Never defaulted. */
    amount: z.number().positive().nullable(),
    unit: UnitSchema.nullable().describe(
      "Canonical unit. Must be null when amount is null. Use null for any unit not in the list and put the original text in note.",
    ),
    note: z.string().nullable(),
    optional: z.boolean(),
  })
  .superRefine((ingredient, ctx) => {
    if (ingredient.amount === null && ingredient.unit !== null) {
      ctx.addIssue({
        code: "custom",
        path: ["unit"],
        message: "unit must be null when amount is null",
        input: ingredient.unit,
      });
    }
  });

export type Ingredient = z.infer<typeof IngredientSchema>;
