import { describe, expect, it } from "vitest";
import { DRINK_LEVELS, FOOD_LEVELS, RECIPES, flowLevel, levelByKey, recipesFor } from "./kitchen";

describe("IDDSI flow test → drink level", () => {
  it.each([[0, "d0"], [0.5, "d0"], [1, "d1"], [2, "d1"], [4, "d2"], [6, "d2"], [8, "d3"], [9, "d3"], [10, "d4"]] as const)(
    "%s mL left maps to %s", (ml, key) => expect(flowLevel(ml).key).toBe(key));
  it("flags the boundary values for a repeat test", () => {
    expect(flowLevel(1).boundary).toBe(true);
    expect(flowLevel(4).boundary).toBe(true);
    expect(flowLevel(8).boundary).toBe(true);
    expect(flowLevel(2).boundary).toBe(false);
  });
});

describe("levels and recipes", () => {
  it("has drink and food levels", () => { expect(DRINK_LEVELS.length).toBeGreaterThan(0); expect(FOOD_LEVELS.length).toBeGreaterThan(0); });
  it("every recipe points at a real level", () => {
    for (const r of RECIPES) expect(levelByKey(r.lv)).toBeTruthy();
  });
  it("recipesFor returns only that level's recipes", () => {
    const d2 = recipesFor("d2");
    expect(d2.length).toBeGreaterThan(0);
    expect(d2.every(r => r.lv === "d2")).toBe(true);
  });
});
