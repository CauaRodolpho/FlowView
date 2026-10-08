import test from "node:test";
import assert from "node:assert/strict";
import { calculateFinancialSummary, groupTransactionsByCategory } from "../lib/calculations/finance.ts";
import { calculateMarketingSummary, campaignDuration } from "../lib/calculations/marketing.ts";
import { calculateSaleNet, calculateSalesSummary } from "../lib/calculations/sales.ts";
import type { FinancialTransaction, MarketingCampaign, SaleRecord } from "../types/dashboard.ts";

const transactions: FinancialTransaction[] = [
  { id: "1", description: "Salário", type: "income", category: "Salário", amount: 5000, date: "2026-10-01", status: "completed", recurrence: "monthly" },
  { id: "2", description: "Freela", type: "income", category: "Freelance", amount: 1000, date: "2026-10-02", status: "pending", recurrence: "once" },
  { id: "3", description: "Aluguel", type: "expense", category: "Moradia", amount: 1500, date: "2026-10-03", status: "completed", recurrence: "monthly" },
  { id: "4", description: "Luz", type: "expense", category: "Moradia", amount: 200, date: "2026-10-04", status: "pending", recurrence: "monthly" },
];

test("calcula saldo financeiro realizado e projetado", () => {
  const summary = calculateFinancialSummary(transactions);
  assert.equal(summary.realizedBalance, 3500);
  assert.equal(summary.projectedBalance, 4300);
});

test("agrupa movimentações por categoria", () => {
  assert.deepEqual(groupTransactionsByCategory(transactions.filter((item) => item.status === "completed"), "expense"), [{ name: "Moradia", value: 1500 }]);
});

const sales: SaleRecord[] = [
  { id: "1", orderCode: "FV-1", date: "2026-10-01", customer: "Ana", customerType: "new", product: "Caneca", category: "Presentes", quantity: 2, unitPrice: 50, discount: 10, shipping: 15, channel: "Site", status: "completed" },
  { id: "2", orderCode: "FV-2", date: "2026-10-02", customer: "Bia", customerType: "returning", product: "Quadro", category: "Decoração", quantity: 1, unitPrice: 100, discount: 0, shipping: 20, channel: "Instagram", status: "cancelled" },
];

test("calcula valor líquido de uma venda sem permitir total negativo", () => {
  assert.equal(calculateSaleNet(sales[0]), 90);
  assert.equal(calculateSaleNet({ ...sales[0], discount: 200 }), 0);
});

test("resume vendas concluídas e cancelamentos", () => {
  const summary = calculateSalesSummary(sales);
  assert.equal(summary.netRevenue, 90);
  assert.equal(summary.averageTicket, 90);
  assert.equal(summary.cancellationRate, 50);
});

const campaigns: MarketingCampaign[] = [
  { id: "1", name: "Lançamento", channel: "Instagram", startDate: "2026-10-01", endDate: "2026-10-10", status: "finished", investment: 1000, impressions: 10000, clicks: 500, leads: 100, conversions: 20, attributedRevenue: 3000 },
];

test("calcula funil e retorno de marketing", () => {
  const summary = calculateMarketingSummary(campaigns);
  assert.equal(summary.ctr, 5);
  assert.equal(summary.conversionRate, 20);
  assert.equal(summary.roi, 200);
});

test("calcula duração inclusiva da campanha", () => {
  assert.equal(campaignDuration(campaigns[0]), 10);
});
