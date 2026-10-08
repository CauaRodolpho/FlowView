export type DashboardKind = "anacraft" | "finance" | "sales" | "marketing" | "custom";
export type DashboardModel = "simple" | "turbo" | "pro" | "premium";

export interface DashboardMetric {
  label: string;
  value: number;
}

export interface DashboardRecord {
  label: string;
  value: number;
  category: string;
}

export type DashboardPurpose = "operational" | "tactical" | "strategic";
export type DashboardWidgetType = "metric" | "progress" | "line" | "bar" | "donut" | "table";
export type DashboardFormulaOperator = "add" | "subtract" | "multiply" | "divide" | "percentage";

export interface DashboardFormula {
  id: string;
  label: string;
  left: string;
  operator: DashboardFormulaOperator;
  right: string;
}

export interface DashboardWidgetConfig {
  id: string;
  type: DashboardWidgetType;
  title: string;
  visible: boolean;
}

export type DashboardTableRow = Record<string, string | number>;

export type FinancialTransactionType = "income" | "expense";
export type FinancialTransactionStatus = "completed" | "pending";
export type FinancialRecurrence = "once" | "monthly";

export interface FinancialTransaction {
  id: string;
  description: string;
  type: FinancialTransactionType;
  category: string;
  amount: number;
  date: string;
  dueDate?: string;
  status: FinancialTransactionStatus;
  recurrence: FinancialRecurrence;
  paymentMethod?: string;
}

export interface FinancialPlan {
  monthlyBudget: number;
  savingsGoal: number;
  targetDate?: string;
}

export type SaleStatus = "completed" | "pending" | "cancelled";
export type CustomerType = "new" | "returning";

export interface SaleRecord {
  id: string;
  orderCode: string;
  date: string;
  customer: string;
  customerType: CustomerType;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  shipping: number;
  channel: string;
  status: SaleStatus;
}

export interface SalesPlan {
  monthlyTarget: number;
  ticketTarget: number;
}

export type CampaignStatus = "active" | "paused" | "finished";

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: string;
  startDate: string;
  endDate?: string;
  status: CampaignStatus;
  investment: number;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  attributedRevenue: number;
}

export interface MarketingPlan {
  monthlyInvestment: number;
  leadGoal: number;
  conversionGoal: number;
}

export interface DashboardData {
  source: "manual" | "csv";
  metrics: DashboardMetric[];
  records: DashboardRecord[];
  columns?: string[];
  rows?: DashboardTableRow[];
  formulas?: DashboardFormula[];
  transactions?: FinancialTransaction[];
  financialPlan?: FinancialPlan;
  sales?: SaleRecord[];
  salesPlan?: SalesPlan;
  campaigns?: MarketingCampaign[];
  marketingPlan?: MarketingPlan;
}

export interface DashboardPalette {
  primary: string;
  accent: string;
  background: string;
}

export interface DashboardSummary {
  id: string;
  name: string;
  description: string;
  kind: DashboardKind;
  model: DashboardModel;
  accent: string;
  widgetCount: number;
  updatedAt: string;
  data?: DashboardData;
  palette?: DashboardPalette;
  purpose?: DashboardPurpose;
  widgets?: DashboardWidgetConfig[];
}

export interface SalesPoint {
  month: string;
  revenue: number;
  previous: number;
}

export interface CategoryPoint {
  name: string;
  value: number;
  color: string;
}
