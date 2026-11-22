/* IDDSI-based diet kitchen: a ladder of drink and food levels, recipes for each, the IDDSI flow
   test for drink thickness, foods to avoid, and a printable diet sheet. Content preserved from the
   original. IDDSI framework is CC BY-SA 4.0. */
import raw from "./data.json";

export type Lang = "en" | "kn" | "te" | "hi";
export interface Level { key: string; lvl: number; kind: "drink" | "food"; name: string; color: string; dark?: boolean; test: string; who: string }
export interface Recipe { id: string; lv: string; name: string; local: Record<string, string>; ing: string[]; steps: string[]; check: string; watch: string }
interface Data { I18N: Record<Lang, Record<string, string>>; LEVELS: Level[]; RECIPES: Recipe[]; RISK: [string, string][] }
const data = raw as unknown as Data;
export const { LEVELS, RECIPES, RISK } = data;
export const strings = data.I18N;

export const levelByKey = (key: string): Level | undefined => LEVELS.find(l => l.key === key);
export const recipesFor = (key: string): Recipe[] => RECIPES.filter(r => r.lv === key);
export const DRINK_LEVELS = LEVELS.filter(l => l.kind === "drink");
export const FOOD_LEVELS = LEVELS.filter(l => l.kind === "food");

/** IDDSI flow test: millilitres left in a 10 mL syringe after 10 s → drink level.
    <1 Thin (0); 1–4 Slightly thick (1); 4–8 Mildly thick (2); 8–10 Moderately thick (3); the
    syringe not emptying (≈10) → Extremely thick (4). Returns the level key and whether it sits
    exactly on a boundary (1, 4, 8), where the test should be repeated. */
export function flowLevel(ml: number): { key: string; boundary: boolean } {
  const boundary = ml === 1 || ml === 4 || ml === 8;
  let key: string;
  if (ml < 1) key = "d0";
  else if (ml < 4) key = "d1";
  else if (ml < 8) key = "d2";
  else if (ml < 10) key = "d3";
  else key = "d4";
  return { key, boundary };
}
