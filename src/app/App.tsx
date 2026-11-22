/* Safe Swallow Kitchen: an IDDSI ladder of drink and food levels with recipes, the IDDSI flow test
   for drink thickness, foods to avoid, and a printable diet sheet. Four languages (recipes in
   English with local names). On-device. */
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Beaker, ClipboardList, CookingPot, TriangleAlert } from "lucide-react";
import { AppShell, type Section } from "@/shell/AppShell";
import { Button, Callout, Empty, Field, Input, Panel, Pill, Select, cx } from "@/shell/ui";
import { usePersistent } from "@/shell/storage";
import { toast } from "@/shell/toast";
import { esc, fmtDate, printHTML } from "@/shell/lib";
import { DRINK_LEVELS, FOOD_LEVELS, LEVELS, RECIPES, RISK, flowLevel, levelByKey, recipesFor, type Lang, type Recipe } from "./kitchen";

interface Sheet { ids: string[]; code: string; drink: string; food: string; by: string }

export default function App() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const [tab, setTab] = useState("ladder");
  const [sheet, setSheet] = usePersistent<Sheet>("ssk-diet-sheet", { ids: [], code: "", drink: "", food: "", by: "" });
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [ml, setMl] = useState("");

  const lvName = (key: string) => { const l = levelByKey(key); return l ? `${l.kind === "drink" ? "Drink" : "Food"} ${l.lvl} ${t(l.name)}` : key; };
  const inSheet = (id: string) => sheet.ids.includes(id);
  const toggleRecipe = (id: string) => { setSheet(s => ({ ...s, ids: inSheet(id) ? s.ids.filter(x => x !== id) : [...s.ids, id] })); toast(inSheet(id) ? t("removed") : t("added")); };

  const sections: Section[] = [{ id: "ladder", label: t("ladderTitle").split(" ")[0] || "Ladder", icon: ClipboardList }, { id: "recipes", label: "Recipes", icon: CookingPot }, { id: "flow", label: "Flow test", icon: Beaker }, { id: "sheet", label: t("sheetTitle").split(" ")[0] || "Sheet", icon: ClipboardList }];
  const go = (id: string) => { setTab(id); window.scrollTo({ top: 0 }); };

  const recipeList = useMemo(() => filter === "all" ? RECIPES : recipesFor(filter), [filter]);
  const flow = ml === "" ? null : flowLevel(Number(ml));

  const printSheet = () => {
    const recipes = sheet.ids.map(id => RECIPES.find(r => r.id === id)).filter(Boolean) as Recipe[];
    printHTML(`<h2>${t("sheetTitle")}</h2><p>${t("pCode")}: <b>${esc(sheet.code || "–")}</b>. ${t("printDate")}: ${esc(fmtDate(new Date()))}. ${t("pBy")}: ${esc(sheet.by || "–")}.</p>
      <p><b>${t("pDrink")}:</b> ${sheet.drink ? esc(lvName(sheet.drink)) : "–"} &nbsp; <b>${t("pFood")}:</b> ${sheet.food ? esc(lvName(sheet.food)) : "–"}</p>
      <p>${t("printAlways")}</p>
      ${recipes.map(r => `<h3>${esc(r.name)}${r.local[lang] ? ` (${esc(r.local[lang])})` : ""} — ${esc(lvName(r.lv))}</h3>
        <p><b>${t("ingredients")}:</b></p><ul>${r.ing.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
        <p><b>${t("method")}:</b></p><ol>${r.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
        <p><b>${t("checkBefore")}:</b> ${esc(r.check)}</p><p><b>${t("watchFor")}:</b> ${esc(r.watch)}</p>`).join("")}
      <p style="font-size:9pt">${t("iddsiCredit")}</p><div class="sig"><div>Speech-language pathologist (name, RCI number)</div><div>Date</div></div>`);
  };

  const RecipeCard = ({ r }: { r: Recipe }) => {
    const isOpen = open === r.id;
    return (
      <div className="rounded-xl border border-line bg-surface p-4">
        <div className="flex items-start justify-between gap-2">
          <div><h3 className="m-0 text-base font-bold">{r.name}{r.local[lang] && <span className="ml-1 font-normal text-muted" lang={lang}>({r.local[lang]})</span>}</h3>
            <Pill tone="info">{lvName(r.lv)}</Pill></div>
          <Button size="sm" variant={inSheet(r.id) ? "primary" : "ghost"} onClick={() => toggleRecipe(r.id)}>{inSheet(r.id) ? t("inSheet") : t("addSheet")}</Button>
        </div>
        <Button size="sm" variant="quiet" className="mt-2" onClick={() => setOpen(isOpen ? null : r.id)} aria-expanded={isOpen}>{isOpen ? "−" : "+"} {t("howToMake")}</Button>
        {isOpen && (
          <div className="mt-2 grid gap-2 border-t border-line pt-2 text-[0.92rem]">
            <div><b>{t("ingredients")}</b><ul className="m-0 mt-1 grid list-disc gap-0.5 pl-5">{r.ing.map((i, k) => <li key={k}>{i}</li>)}</ul></div>
            <div><b>{t("method")}</b><ol className="m-0 mt-1 grid list-decimal gap-0.5 pl-5">{r.steps.map((s, k) => <li key={k}>{s}</li>)}</ol></div>
            <Callout tone="info" title={t("checkBefore")}>{r.check}</Callout>
            <p className="m-0 text-muted"><b>{t("watchFor")}:</b> {r.watch}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <AppShell title={t("appName")} subtitle={t("appSub")} sections={sections} active={tab} onSection={go}
      footer={<><p className="m-0">{t("disclaimer")}</p><p className="m-0">{t("iddsiCredit")}</p>
        <p className="m-0">{t("builtBy")}: Hemaraja Nayaka S, Department of Audiology & Speech-Language Pathology, Yenepoya Medical College Hospital, Mangaluru.</p></>}>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5">

        {tab === "ladder" && (
          <>
            <Panel title={t("ladderTitle")}>
              <p className="m-0 text-[0.9rem] text-muted">{t("ladderNote")}</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {["drink", "food"].map(kind => (
                  <div key={kind}>
                    <h3 className="m-0 mb-2 text-base font-bold">{kind === "drink" ? t("drinks") : t("foods")}</h3>
                    <ul className="m-0 grid grid-cols-1 list-none gap-2 p-0">
                      {LEVELS.filter(l => l.kind === kind).map(l => (
                        <li key={l.key} className="rounded-lg border border-line bg-paper p-3">
                          <div className="flex items-center justify-between gap-2">
                            <b>{l.kind === "drink" ? "Drink" : "Food"} {l.lvl} — {t(l.name)}</b>
                            <span className="text-[0.78rem] text-muted">{recipesFor(l.key).length} {t("recipesN")}</span>
                          </div>
                          <p className="m-0 mt-1 text-[0.88rem] text-muted">{l.who}</p>
                          <p className="m-0 mt-1 text-[0.82rem]"><b>{t("testLabel")}:</b> {l.test}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Panel>
            <Callout tone="mid">{t("langNote")}</Callout>
          </>
        )}

        {tab === "recipes" && (
          <>
            <Panel title="Recipes" action={<Select aria-label={t("level")} value={filter} onChange={e => { setFilter(e.target.value); setOpen(null); }} className="min-w-40">
              <option value="all">{t("countAll")}</option>{LEVELS.filter(l => recipesFor(l.key).length).map(l => <option key={l.key} value={l.key}>{l.kind === "drink" ? "Drink" : "Food"} {l.lvl} {t(l.name)}</option>)}</Select>}>
              <div className="grid grid-cols-1 gap-3">{recipeList.map(r => <RecipeCard key={r.id} r={r} />)}</div>
            </Panel>
          </>
        )}

        {tab === "flow" && (
          <Panel title={t("flowTitle")}>
            <p className="m-0 text-[0.95rem] text-muted">{t("flowHow")}</p>
            <Field label={t("flowLeft")} hint={t("flowRange")}>{id => <Input id={id} type="number" min={0} max={10} step={0.5} value={ml} className="max-w-36" onChange={e => setMl(e.target.value)} />}</Field>
            {flow && Number(ml) >= 0 && Number(ml) <= 10 && (
              <div className="mt-3 rounded-lg border border-line bg-paper p-4" aria-live="polite">
                <p className="m-0 text-[0.85rem] text-muted">{ml} {t("flowLeft")}</p>
                <p className="m-0 text-xl font-bold">{lvName(flow.key)}</p>
                <p className="m-0 mt-1 text-[0.92rem]">{levelByKey(flow.key)?.who}</p>
                {flow.boundary && <Callout tone="mid">{t("flowBoundary")}</Callout>}
              </div>
            )}
            <Callout tone="info">{t("flowL3note")}</Callout>
          </Panel>
        )}

        {tab === "sheet" && (
          <Panel title={t("sheetTitle")} action={<div className="flex gap-2"><Button size="sm" onClick={printSheet} disabled={!sheet.code && !sheet.ids.length}>{t("printSheet")}</Button><Button size="sm" variant="danger" onClick={() => { setSheet({ ids: [], code: "", drink: "", food: "", by: "" }); toast(t("cleared")); }}>{t("clearSheet")}</Button></div>}>
            <p className="m-0 text-[0.9rem] text-muted">{t("sheetIntro")}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label={t("pCode")} hint={t("pCodeHint")} className="mt-0">{id => <Input id={id} value={sheet.code} maxLength={30} onChange={e => setSheet(s => ({ ...s, code: e.target.value }))} />}</Field>
              <Field label={t("pBy")} className="mt-0">{id => <Input id={id} value={sheet.by} maxLength={40} onChange={e => setSheet(s => ({ ...s, by: e.target.value }))} />}</Field>
              <Field label={t("pDrink")} className="mt-0">{id => <Select id={id} value={sheet.drink} onChange={e => setSheet(s => ({ ...s, drink: e.target.value }))}><option value="">–</option>{DRINK_LEVELS.map(l => <option key={l.key} value={l.key}>Drink {l.lvl} {t(l.name)}</option>)}</Select>}</Field>
              <Field label={t("pFood")} className="mt-0">{id => <Select id={id} value={sheet.food} onChange={e => setSheet(s => ({ ...s, food: e.target.value }))}><option value="">–</option>{FOOD_LEVELS.map(l => <option key={l.key} value={l.key}>Food {l.lvl} {t(l.name)}</option>)}</Select>}</Field>
            </div>
            <h3 className="mb-1 mt-4 text-base font-bold">{t("inSheet")} ({sheet.ids.length})</h3>
            {sheet.ids.length === 0 ? <Empty>{t("sheetEmpty")}</Empty> : (
              <ul className="m-0 grid grid-cols-1 list-none gap-2 p-0">
                {sheet.ids.map(id => { const r = RECIPES.find(x => x.id === id); if (!r) return null; return (
                  <li key={id} className="flex items-center justify-between gap-2 rounded-lg border border-line bg-paper px-3 py-2">
                    <span><b>{r.name}</b> <span className="text-[0.82rem] text-muted">{lvName(r.lv)}</span></span>
                    <Button size="sm" variant="quiet" onClick={() => toggleRecipe(id)}>{t("remove")}</Button></li>); })}
              </ul>
            )}
          </Panel>
        )}

        {tab !== "sheet" && (
          <section className="rounded-xl border-l-4 border-high bg-high/8 p-4">
            <h2 className="m-0 flex items-center gap-2 text-lg font-bold"><TriangleAlert className="h-5 w-5 text-high" aria-hidden />{t("riskTitle")}</h2>
            <p className="m-0 mt-1 text-[0.9rem] text-muted">{t("riskIntro")}</p>
            <dl className="m-0 mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 text-[0.92rem] sm:grid-cols-[auto_1fr]">
              {RISK.map(([k, v], i) => <div key={i} className={cx("contents")}><dt className="font-bold">{k}</dt><dd className="m-0 text-muted">{v}</dd></div>)}
            </dl>
          </section>
        )}
      </div>
    </AppShell>
  );
}
