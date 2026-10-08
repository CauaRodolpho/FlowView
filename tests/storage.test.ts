import test from "node:test";
import assert from "node:assert/strict";
import { decodeWorkspace, STORAGE_VERSION } from "../lib/dashboard-storage.ts";
import type { DashboardSummary } from "../types/dashboard.ts";

const dashboard: DashboardSummary = { id: "one", name: "Teste", description: "", kind: "custom", model: "simple", accent: "", widgetCount: 0, updatedAt: "Agora" };

test("migra o formato antigo em array para o workspace versionado", () => {
  const decoded = decodeWorkspace(JSON.stringify([dashboard]), []);
  assert.equal(decoded.version, STORAGE_VERSION);
  assert.equal(decoded.dashboards[0].name, "Teste");
});

test("recupera o estado padrão quando o JSON está inválido", () => {
  const decoded = decodeWorkspace("{inválido", [dashboard]);
  assert.deepEqual(decoded.dashboards, [dashboard]);
});

test("preserva perfil, preferências e layouts ao migrar o workspace", () => {
  const decoded = decodeWorkspace(JSON.stringify({ version: 2, dashboards: [dashboard], profile: { name: "Cauã", role: "Front-End", initials: "CR" }, preferences: { sidebarCollapsed: true, welcomeSeen: true, theme: "light" }, widgetLayouts: { test: [{ id: "metric" }] } }), []);
  assert.equal(decoded.version, STORAGE_VERSION);
  assert.equal(decoded.profile?.name, "Cauã");
  assert.equal(decoded.preferences?.sidebarCollapsed, true);
  assert.equal(decoded.preferences?.welcomeSeen, true);
  assert.equal(decoded.preferences?.theme, "light");
  assert.deepEqual(decoded.widgetLayouts?.test, [{ id: "metric" }]);
});
