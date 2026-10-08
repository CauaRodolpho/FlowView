import { defaultPalette, getDashboardModel, labelsFor, type CreatorKind } from "../data/dashboard-config.ts";
import { calculateFinancialSummary } from "./calculations/finance.ts";
import { calculateMarketingSummary } from "./calculations/marketing.ts";
import { calculateSalesSummary } from "./calculations/sales.ts";
import type { DashboardData, DashboardKind, DashboardSummary, FinancialTransaction, MarketingCampaign, SaleRecord } from "../types/dashboard.ts";

export type LegacyDashboardKind = DashboardKind | "blank" | "team" | "inventory";
export type StoredDashboard = Omit<DashboardSummary, "kind"> & { kind: LegacyDashboardKind };

export interface WorkspaceProfile {
  name: string;
  role: string;
  initials: string;
}

export const DEFAULT_PROFILE: WorkspaceProfile = {
  name: "Cauã Rodolpho",
  role: "Desenvolvedor Front-End",
  initials: "CR",
};

const demoValues: Record<CreatorKind, number[]> = {
  finance: [28400, 11750, 16650, 32000],
  sales: [18460, 143, 129, 38],
  marketing: [84500, 6320, 418, 12],
  custom: [12500, 3280, 72, 15000],
};

const dateInMonth = (reference: Date, monthOffset: number, day: number) =>
  new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() + monthOffset, day)).toISOString().slice(0, 10);

function financeDemo(reference: Date): DashboardData {
  const transactions: FinancialTransaction[] = [
    { id: "demo-fin-1", description: "Salário", type: "income", category: "Salário", amount: 6200, date: dateInMonth(reference, 0, 5), status: "completed", recurrence: "monthly", paymentMethod: "Transferência" },
    { id: "demo-fin-2", description: "Encomendas de doces", type: "income", category: "Vendas", amount: 2450, date: dateInMonth(reference, 0, 9), status: "completed", recurrence: "once", paymentMethod: "Pix" },
    { id: "demo-fin-3", description: "Freelance", type: "income", category: "Freelance", amount: 1800, date: dateInMonth(reference, 0, 18), dueDate: dateInMonth(reference, 0, 18), status: "pending", recurrence: "once" },
    { id: "demo-fin-4", description: "Aluguel", type: "expense", category: "Moradia", amount: 1850, date: dateInMonth(reference, 0, 6), status: "completed", recurrence: "monthly", paymentMethod: "Pix" },
    { id: "demo-fin-5", description: "Supermercado", type: "expense", category: "Alimentação", amount: 780, date: dateInMonth(reference, 0, 11), status: "completed", recurrence: "monthly", paymentMethod: "Cartão" },
    { id: "demo-fin-6", description: "Conta de luz", type: "expense", category: "Casa", amount: 238, date: dateInMonth(reference, 0, 12), status: "completed", recurrence: "monthly", paymentMethod: "Débito" },
    { id: "demo-fin-7", description: "Manutenção do carro", type: "expense", category: "Transporte", amount: 940, date: dateInMonth(reference, 0, 22), dueDate: dateInMonth(reference, 0, 22), status: "pending", recurrence: "once" },
    { id: "demo-fin-8", description: "Salário", type: "income", category: "Salário", amount: 6200, date: dateInMonth(reference, -1, 5), status: "completed", recurrence: "monthly" },
    { id: "demo-fin-9", description: "Despesas do mês anterior", type: "expense", category: "Casa", amount: 3020, date: dateInMonth(reference, -1, 20), status: "completed", recurrence: "once" },
  ];
  const summary = calculateFinancialSummary(transactions);
  const metrics = [
    { label: "Receitas recebidas", value: summary.completedIncome },
    { label: "Despesas pagas", value: summary.completedExpense },
    { label: "Saldo realizado", value: summary.realizedBalance },
    { label: "Saldo projetado", value: summary.projectedBalance },
  ];
  return { source: "manual", metrics, records: transactions.map((item) => ({ label: item.description, value: item.amount, category: item.category })), transactions, financialPlan: { monthlyBudget: 4200, savingsGoal: 12000, targetDate: dateInMonth(reference, 5, 28) }, formulas: [] };
}

function salesDemo(reference: Date): DashboardData {
  const sales: SaleRecord[] = [
    { id: "demo-sale-1", orderCode: "#FV-1048", date: dateInMonth(reference, 0, 3), customer: "Marina Lima", customerType: "returning", product: "Caneca personalizada", category: "Canecas", quantity: 2, unitPrice: 89, discount: 10, shipping: 18, channel: "Instagram", status: "completed" },
    { id: "demo-sale-2", orderCode: "#FV-1049", date: dateInMonth(reference, 0, 7), customer: "Bruno Alves", customerType: "new", product: "Kit de chaveiros", category: "Chaveiros", quantity: 4, unitPrice: 34, discount: 0, shipping: 16, channel: "Site", status: "completed" },
    { id: "demo-sale-3", orderCode: "#FV-1050", date: dateInMonth(reference, 0, 12), customer: "Carla Mendes", customerType: "new", product: "Ímãs personalizados", category: "Ímãs", quantity: 6, unitPrice: 24, discount: 12, shipping: 20, channel: "WhatsApp", status: "completed" },
    { id: "demo-sale-4", orderCode: "#FV-1051", date: dateInMonth(reference, 0, 18), customer: "Lívia Rocha", customerType: "returning", product: "Canecas para evento", category: "Canecas", quantity: 12, unitPrice: 72, discount: 54, shipping: 35, channel: "Site", status: "pending" },
    { id: "demo-sale-5", orderCode: "#FV-1038", date: dateInMonth(reference, -1, 14), customer: "Rafael Costa", customerType: "new", product: "Kit presenteável", category: "Kits", quantity: 3, unitPrice: 115, discount: 15, shipping: 22, channel: "Instagram", status: "completed" },
    { id: "demo-sale-6", orderCode: "#FV-1026", date: dateInMonth(reference, -2, 21), customer: "Fernanda Souza", customerType: "returning", product: "Chaveiro com nome", category: "Chaveiros", quantity: 8, unitPrice: 29, discount: 0, shipping: 18, channel: "WhatsApp", status: "completed" },
    { id: "demo-sale-7", orderCode: "#FV-1014", date: dateInMonth(reference, -3, 10), customer: "Paulo Nunes", customerType: "new", product: "Caneca temática", category: "Canecas", quantity: 2, unitPrice: 94, discount: 8, shipping: 16, channel: "Site", status: "completed" },
    { id: "demo-sale-8", orderCode: "#FV-1052", date: dateInMonth(reference, 0, 20), customer: "Beatriz Melo", customerType: "new", product: "Ímã de geladeira", category: "Ímãs", quantity: 2, unitPrice: 27, discount: 0, shipping: 14, channel: "Instagram", status: "cancelled" },
  ];
  const summary = calculateSalesSummary(sales);
  const metrics = [
    { label: "Receita líquida", value: summary.netRevenue },
    { label: "Pedidos concluídos", value: summary.completed.length },
    { label: "Ticket médio", value: summary.averageTicket },
    { label: "Unidades vendidas", value: summary.units },
  ];
  return { source: "manual", metrics, records: sales.map((item) => ({ label: item.product, value: item.quantity * item.unitPrice - item.discount, category: item.category })), sales, salesPlan: { monthlyTarget: 6500, ticketTarget: 180 }, formulas: [] };
}

function marketingDemo(reference: Date): DashboardData {
  const campaigns: MarketingCampaign[] = [
    { id: "demo-mkt-1", name: "Coleção Primavera", channel: "Instagram", startDate: dateInMonth(reference, 0, 2), status: "active", investment: 920, impressions: 48600, clicks: 2180, leads: 286, conversions: 42, attributedRevenue: 6840 },
    { id: "demo-mkt-2", name: "Presentes Personalizados", channel: "Google Ads", startDate: dateInMonth(reference, 0, 6), status: "active", investment: 740, impressions: 31200, clicks: 1460, leads: 174, conversions: 31, attributedRevenue: 4380 },
    { id: "demo-mkt-3", name: "Clientes que voltam", channel: "E-mail", startDate: dateInMonth(reference, -1, 8), endDate: dateInMonth(reference, -1, 24), status: "finished", investment: 180, impressions: 8900, clicks: 1120, leads: 138, conversions: 28, attributedRevenue: 3210 },
    { id: "demo-mkt-4", name: "Semana do Artesanato", channel: "Instagram", startDate: dateInMonth(reference, -2, 4), endDate: dateInMonth(reference, -2, 22), status: "finished", investment: 810, impressions: 42700, clicks: 1890, leads: 248, conversions: 37, attributedRevenue: 5720 },
    { id: "demo-mkt-5", name: "Catálogo no WhatsApp", channel: "WhatsApp", startDate: dateInMonth(reference, -3, 5), endDate: dateInMonth(reference, -3, 26), status: "finished", investment: 250, impressions: 12400, clicks: 1740, leads: 196, conversions: 34, attributedRevenue: 3980 },
    { id: "demo-mkt-6", name: "Teste de novos criativos", channel: "Meta Ads", startDate: dateInMonth(reference, -1, 12), status: "paused", investment: 360, impressions: 19800, clicks: 610, leads: 58, conversions: 6, attributedRevenue: 720 },
  ];
  const summary = calculateMarketingSummary(campaigns);
  const metrics = [
    { label: "Investimento", value: summary.investment },
    { label: "Leads", value: summary.leads },
    { label: "Conversões", value: summary.conversions },
    { label: "ROI", value: summary.roi },
  ];
  return { source: "manual", metrics, records: campaigns.map((item) => ({ label: item.name, value: item.attributedRevenue, category: item.channel })), campaigns, marketingPlan: { monthlyInvestment: 2200, leadGoal: 600, conversionGoal: 90 }, formulas: [] };
}

export function buildDemoData(kind: CreatorKind, reference = new Date()): DashboardData {
  if (kind === "finance") return financeDemo(reference);
  if (kind === "sales") return salesDemo(reference);
  if (kind === "marketing") return marketingDemo(reference);
  const metrics = labelsFor(kind, "tactical").map((label, index) => ({
    label,
    value: demoValues[kind][index],
  }));
  return {
    source: "manual",
    metrics,
    records: metrics.map((item, index) => ({
      label: item.label,
      value: item.value,
      category: index % 2 ? "Secundário" : "Principal",
    })),
  };
}

const supportedKinds: DashboardKind[] = ["anacraft", "finance", "sales", "marketing", "custom"];
const supportedModels: DashboardSummary["model"][] = ["simple", "turbo", "pro", "premium"];

function isStoredDashboard(item: unknown): item is StoredDashboard {
  if (!item || typeof item !== "object") return false;
  const candidate = item as Partial<StoredDashboard>;
  return typeof candidate.id === "string"
    && typeof candidate.name === "string"
    && typeof candidate.description === "string";
}

export function normalizeStoredDashboards(items: unknown[]): DashboardSummary[] {
  return items
    .filter(isStoredDashboard)
    .filter((item) => item.id !== "personal-finance" && item.kind !== "team" && item.kind !== "inventory")
    .map((item) => {
      if (item.id === "anacraft-store") {
        return {
          ...item,
          kind: "anacraft" as const,
          description: "Operação completa do ateliê: vendas, produção, envios, estoque e desempenho.",
          model: "pro" as const,
          widgetCount: 14,
        };
      }
      const normalizedKind = supportedKinds.includes(item.kind as DashboardKind) ? item.kind : "custom";
      const kind: CreatorKind = normalizedKind === "anacraft" || normalizedKind === "blank" ? "custom" : normalizedKind as CreatorKind;
      const model = supportedModels.includes(item.model) ? item.model : "pro";
      return {
        ...item,
        kind,
        model,
        data: item.data ?? buildDemoData(kind),
        palette: item.palette ?? defaultPalette(model),
      };
    });
}

export function createDashboardFromTemplate(
  template: Omit<DashboardSummary, "id" | "updatedAt">,
  name: string,
  model: DashboardSummary["model"],
  now = Date.now(),
): DashboardSummary {
  const profile = getDashboardModel(model);
  const kind = template.kind as CreatorKind;
  return {
    id: `${kind}-${now}`,
    name: name.trim(),
    description: template.description,
    kind,
    model: profile.id,
    accent: profile.accent,
    widgetCount: 6,
    updatedAt: "Agora",
    data: buildDemoData(kind),
    palette: defaultPalette(profile.id),
  };
}

export function cloneDashboard(source: DashboardSummary, now = Date.now()): DashboardSummary {
  const isShowcase = source.kind === "anacraft";
  return {
    ...structuredClone(source),
    id: `${isShowcase ? "custom" : source.kind}-${now}`,
    name: `${source.name} — cópia`,
    kind: isShowcase ? "custom" : source.kind,
    description: isShowcase
      ? "Cópia editável inspirada no dashboard demonstrativo AnaCraft."
      : source.description,
    data: isShowcase ? buildDemoData("custom") : structuredClone(source.data),
    widgets: isShowcase ? undefined : structuredClone(source.widgets),
    updatedAt: "Agora",
  };
}

export function filterDashboards(dashboards: DashboardSummary[], query: string) {
  const normalizeSearch = (value: string) => value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");
  const normalizedQuery = normalizeSearch(query.trim());
  if (!normalizedQuery) return dashboards;
  return dashboards.filter((item) =>
    normalizeSearch(`${item.name} ${item.description}`).includes(normalizedQuery),
  );
}

export function restoreDashboard(
  dashboards: DashboardSummary[],
  dashboard: DashboardSummary,
  index: number,
) {
  if (dashboards.some((item) => item.id === dashboard.id)) return dashboards;
  const next = [...dashboards];
  next.splice(Math.min(Math.max(index, 0), next.length), 0, dashboard);
  return next;
}

export function normalizeProfile(profile: WorkspaceProfile): WorkspaceProfile {
  return {
    name: profile.name.trim() || DEFAULT_PROFILE.name,
    role: profile.role.trim() || DEFAULT_PROFILE.role,
    initials: profile.initials.trim().slice(0, 3).toUpperCase() || DEFAULT_PROFILE.initials,
  };
}
