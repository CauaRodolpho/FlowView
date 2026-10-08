import type { DashboardKind, DashboardModel, DashboardPalette, DashboardPurpose } from "../types/dashboard.ts";

export type CreatorKind = Exclude<DashboardKind, "anacraft">;

export interface DashboardModelProfile {
  id: DashboardModel;
  name: string;
  eyebrow: string;
  description: string;
  detail: string;
  widgets: number;
  accent: string;
  palette: DashboardPalette;
}

export type DashboardTheme = "light" | "dark";

export const minimalPalettes: Record<DashboardTheme, DashboardPalette> = {
  light: { primary: "#0284c7", accent: "#7c3aed", background: "#f5f7fb" },
  dark: { primary: "#38bdf8", accent: "#a78bfa", background: "#0b1220" },
};

export const dashboardModels: DashboardModelProfile[] = [
  {
    id: "simple",
    name: "Minimal",
    eyebrow: "Limpo e objetivo",
    description: "Espaços amplos, cards leves e foco nos indicadores essenciais.",
    detail: "Leve e objetivo",
    widgets: 6,
    accent: "from-slate-300 to-cyan-300",
    palette: minimalPalettes.light,
  },
  {
    id: "pro",
    name: "Equilíbrio",
    eyebrow: "Organizado e versátil",
    description: "Hierarquia balanceada entre métricas, gráficos e tabelas.",
    detail: "Completo e organizado",
    widgets: 9,
    accent: "from-sky-500 to-violet-500",
    palette: { primary: "#38bdf8", accent: "#8b5cf6", background: "#090c12" },
  },
  {
    id: "turbo",
    name: "Pulso",
    eyebrow: "Dinâmico e elétrico",
    description: "Informações compactas, ritmo visual forte e gráficos em destaque.",
    detail: "Dinâmico e elétrico",
    widgets: 7,
    accent: "from-blue-500 to-cyan-300",
    palette: { primary: "#2563eb", accent: "#06b6d4", background: "#071426" },
  },
  {
    id: "premium",
    name: "Imersivo",
    eyebrow: "Tecnológico e marcante",
    description: "Alta densidade, linhas neon e acabamento futurista.",
    detail: "Tecnológico e marcante",
    widgets: 9,
    accent: "from-cyan-300 to-emerald-400",
    palette: { primary: "#22d3ee", accent: "#34d399", background: "#020b12" },
  },
];

export const palettePresets: Array<{ name: string; colors: DashboardPalette }> = [
  { name: "Elétrico", colors: dashboardModels[1].palette },
  { name: "Oceano", colors: dashboardModels[2].palette },
  { name: "Aurora", colors: { primary: "#db2777", accent: "#8b5cf6", background: "#170b1a" } },
  { name: "Natural", colors: { primary: "#059669", accent: "#84cc16", background: "#071712" } },
  { name: "Claro", colors: dashboardModels[0].palette },
];

export const purposeLabels: Record<DashboardPurpose, string> = {
  operational: "Operacional",
  tactical: "Tático",
  strategic: "Estratégico",
};

export const metricQuestions: Record<CreatorKind, Record<DashboardPurpose, string[]>> = {
  finance: {
    operational: ["Receitas de hoje", "Despesas de hoje", "Contas pendentes", "Caixa disponível"],
    tactical: ["Receita mensal", "Despesas mensais", "Custos fixos", "Meta mensal"],
    strategic: ["Receita anual", "Lucro acumulado", "Margem de lucro", "Meta anual"],
  },
  sales: {
    operational: ["Vendas de hoje", "Fretes de hoje", "Pedidos abertos", "Devoluções"],
    tactical: ["Vendas do mês", "Custos de frete", "Descontos", "Total de pedidos"],
    strategic: ["Receita anual", "Custo de aquisição", "Ticket médio", "Meta anual"],
  },
  marketing: {
    operational: ["Campanhas ativas", "Investimento diário", "Cliques de hoje", "Leads de hoje"],
    tactical: ["Investimento mensal", "Alcance", "Cliques", "Conversões"],
    strategic: ["Investimento total", "Leads gerados", "Clientes adquiridos", "Receita atribuída"],
  },
  custom: {
    operational: ["Indicador atual", "Ocorrências", "Itens pendentes", "Resultado do dia"],
    tactical: ["Resultado do período", "Comparativo anterior", "Meta do período", "Indicador de evolução"],
    strategic: ["Indicador principal", "Resultado acumulado", "Meta geral", "Projeção"],
  },
};

export const dashboardModelName = (model?: DashboardModel) =>
  dashboardModels.find((item) => item.id === model)?.name ?? "Equilíbrio";

export const getDashboardModel = (model: DashboardModel) =>
  dashboardModels.find((item) => item.id === model) ?? dashboardModels[1];

export const defaultPalette = (model: DashboardModel): DashboardPalette => ({
  ...getDashboardModel(model).palette,
});

const samePalette = (left: DashboardPalette, right: DashboardPalette) =>
  left.primary.toLowerCase() === right.primary.toLowerCase()
  && left.accent.toLowerCase() === right.accent.toLowerCase()
  && left.background.toLowerCase() === right.background.toLowerCase();

export const dashboardPaletteForTheme = (
  model: DashboardModel,
  palette: DashboardPalette | undefined,
  theme: DashboardTheme,
): DashboardPalette => {
  if (model !== "simple") return { ...(palette ?? defaultPalette(model)) };
  const current = palette ?? minimalPalettes.light;
  const usesMinimalDefault = samePalette(current, minimalPalettes.light) || samePalette(current, minimalPalettes.dark);
  return { ...(usesMinimalDefault ? minimalPalettes[theme] : current) };
};

export const labelsFor = (kind: CreatorKind, purpose: DashboardPurpose) =>
  metricQuestions[kind][purpose];
