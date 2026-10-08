import test from "node:test";
import assert from "node:assert/strict";
import { templates } from "../data/dashboards.ts";
import { dashboardPaletteForTheme, minimalPalettes } from "../data/dashboard-config.ts";
import {
  cloneDashboard,
  createDashboardFromTemplate,
  filterDashboards,
  normalizeProfile,
  normalizeStoredDashboards,
  restoreDashboard,
  type StoredDashboard,
} from "../lib/dashboard-workspace.ts";
import type { DashboardSummary } from "../types/dashboard.ts";

const baseDashboard: DashboardSummary = {
  id: "flow-one",
  name: "Visão Financeira",
  description: "Receitas e despesas do ateliê",
  kind: "finance",
  model: "simple",
  accent: "from-cyan-400 to-blue-500",
  widgetCount: 6,
  updatedAt: "Agora",
};

test("adapta a paleta padrão do Minimal ao tema do workspace", () => {
  assert.deepEqual(dashboardPaletteForTheme("simple", minimalPalettes.light, "dark"), minimalPalettes.dark);
  assert.deepEqual(dashboardPaletteForTheme("simple", minimalPalettes.dark, "light"), minimalPalettes.light);
});

test("preserva cores personalizadas do Minimal ao trocar o tema", () => {
  const custom = { primary: "#ff006e", accent: "#8338ec", background: "#1a0714" };
  assert.deepEqual(dashboardPaletteForTheme("simple", custom, "light"), custom);
});

test("normaliza dashboards antigos e remove domínios descontinuados", () => {
  const stored: StoredDashboard[] = [
    { ...baseDashboard, id: "legacy", kind: "blank" },
    { ...baseDashboard, id: "old-team", kind: "team" },
    { ...baseDashboard, id: "old-inventory", kind: "inventory" },
  ];
  const result = normalizeStoredDashboards(stored);
  assert.equal(result.length, 1);
  assert.equal(result[0].kind, "custom");
  assert.ok(result[0].data?.metrics.length);
  assert.ok(result[0].palette);
});

test("ignora entradas corrompidas e normaliza opções desconhecidas", () => {
  const result = normalizeStoredDashboards([
    null,
    { name: "Sem identificador" },
    { ...baseDashboard, id: "legacy-options", kind: "desconhecido", model: "neon" },
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].kind, "custom");
  assert.equal(result[0].model, "pro");
  assert.ok(result[0].data?.metrics.length);
});

test("cria dashboard de template com estilo e dados consistentes", () => {
  const template = templates.find((item) => item.kind === "sales")!;
  const result = createDashboardFromTemplate(template, "  Outubro  ", "premium", 123);
  assert.equal(result.id, "sales-123");
  assert.equal(result.name, "Outubro");
  assert.equal(result.model, "premium");
  assert.equal(result.palette?.background, "#020b12");
  assert.equal(result.data?.metrics.length, 4);
  assert.equal(result.data?.sales?.length, 8);
  assert.ok((result.data?.salesPlan?.monthlyTarget ?? 0) > 0);
});

test("gera demonstrações completas para os três domínios especializados", () => {
  const finance = createDashboardFromTemplate(templates.find((item) => item.kind === "finance")!, "Financeiro", "pro", 1).data;
  const marketing = createDashboardFromTemplate(templates.find((item) => item.kind === "marketing")!, "Marketing", "turbo", 2).data;
  assert.ok((finance?.transactions?.length ?? 0) >= 8);
  assert.ok((finance?.financialPlan?.monthlyBudget ?? 0) > 0);
  assert.ok((marketing?.campaigns?.length ?? 0) >= 6);
  assert.ok((marketing?.marketingPlan?.leadGoal ?? 0) > 0);
});

test("transforma a vitrine AnaCraft em uma cópia editável sem alterar a origem", () => {
  const showcase: DashboardSummary = { ...baseDashboard, id: "anacraft-store", name: "AnaCraft Ateliê", kind: "anacraft", model: "pro" };
  const copy = cloneDashboard(showcase, 456);
  assert.equal(copy.id, "custom-456");
  assert.equal(copy.kind, "custom");
  assert.match(copy.description, /editável/);
  assert.equal(showcase.kind, "anacraft");
});

test("busca dashboards sem diferenciar acentos ou maiúsculas", () => {
  const dashboards = [{ ...baseDashboard, name: "AnaCraft Ateliê" }];
  assert.equal(filterDashboards(dashboards, "ATELIE").length, 1);
  assert.equal(filterDashboards(dashboards, "marketing").length, 0);
});

test("restaura dashboard na posição original e evita duplicação", () => {
  const first = { ...baseDashboard, id: "first" };
  const removed = { ...baseDashboard, id: "removed" };
  const last = { ...baseDashboard, id: "last" };
  const restored = restoreDashboard([first, last], removed, 1);
  assert.deepEqual(restored.map((item) => item.id), ["first", "removed", "last"]);
  assert.strictEqual(restoreDashboard(restored, removed, 1), restored);
});

test("normaliza o perfil e aplica valores seguros quando campos estão vazios", () => {
  assert.deepEqual(normalizeProfile({ name: "  Ana  ", role: "  Designer ", initials: " av " }), { name: "Ana", role: "Designer", initials: "AV" });
  assert.deepEqual(normalizeProfile({ name: "", role: "", initials: "" }), { name: "Cauã Rodolpho", role: "Desenvolvedor Front-End", initials: "CR" });
});
