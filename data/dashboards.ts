import type { CategoryPoint, DashboardSummary, SalesPoint } from "@/types/dashboard";

export const initialDashboards: DashboardSummary[] = [
  {
    id: "anacraft-store",
    name: "AnaCraft Ateliê",
    description: "Operação completa do ateliê: vendas, produção, envios, estoque e desempenho.",
    kind: "anacraft",
    model: "pro",
    accent: "from-violet-500 to-cyan-400",
    widgetCount: 14,
    updatedAt: "Dados de exemplo",
  },
];

export const salesData: SalesPoint[] = [
  { month: "Mai", revenue: 8400, previous: 7200 },
  { month: "Jun", revenue: 10200, previous: 8100 },
  { month: "Jul", revenue: 9800, previous: 9200 },
  { month: "Ago", revenue: 13700, previous: 10400 },
  { month: "Set", revenue: 15100, previous: 12800 },
  { month: "Out", revenue: 18460, previous: 14800 },
];

export const categoryData: CategoryPoint[] = [
  { name: "Canecas", value: 38, color: "#8b5cf6" },
  { name: "Chaveiros", value: 27, color: "#22d3ee" },
  { name: "Ímãs", value: 21, color: "#3b82f6" },
  { name: "Outros", value: 14, color: "#a78bfa" },
];

export const recentOrders = [
  { id: "#AC-1048", client: "Marina Lima", item: "Caneca personalizada", value: "R$ 148,00", status: "Em produção" },
  { id: "#AC-1047", client: "Bruno Alves", item: "Kit de chaveiros", value: "R$ 96,00", status: "Concluído" },
  { id: "#AC-1046", client: "Carla Mendes", item: "Ímãs personalizados", value: "R$ 124,00", status: "Pendente" },
  { id: "#AC-1045", client: "Lívia Rocha", item: "Canecas para evento", value: "R$ 320,00", status: "Enviado" },
];

export const templates: Omit<DashboardSummary, "id" | "updatedAt">[] = [
  { name: "Financeiro", description: "Receitas, despesas, saldo, metas e evolução.", kind: "finance", model: "simple", accent: "from-cyan-400 to-blue-500", widgetCount: 6 },
  { name: "Vendas", description: "Faturamento, pedidos, clientes e desempenho comercial.", kind: "sales", model: "pro", accent: "from-violet-500 to-fuchsia-400", widgetCount: 6 },
  { name: "Marketing", description: "Alcance, conversões, campanhas e canais.", kind: "marketing", model: "turbo", accent: "from-indigo-500 to-cyan-300", widgetCount: 6 },
  { name: "Personalizado", description: "Defina seus próprios indicadores e dados.", kind: "custom", model: "simple", accent: "from-slate-600 to-slate-400", widgetCount: 6 },
];
