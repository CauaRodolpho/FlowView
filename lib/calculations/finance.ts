import type { FinancialTransaction } from "../../types/dashboard";

export function calculateFinancialSummary(transactions: FinancialTransaction[]) {
  const completedIncome = transactions.filter((item) => item.type === "income" && item.status === "completed").reduce((sum, item) => sum + item.amount, 0);
  const completedExpense = transactions.filter((item) => item.type === "expense" && item.status === "completed").reduce((sum, item) => sum + item.amount, 0);
  const pendingIncome = transactions.filter((item) => item.type === "income" && item.status === "pending").reduce((sum, item) => sum + item.amount, 0);
  const pendingExpense = transactions.filter((item) => item.type === "expense" && item.status === "pending").reduce((sum, item) => sum + item.amount, 0);
  const realizedBalance = completedIncome - completedExpense;
  return { completedIncome, completedExpense, pendingIncome, pendingExpense, realizedBalance, projectedBalance: realizedBalance + pendingIncome - pendingExpense };
}

export function groupTransactionsByCategory(transactions: FinancialTransaction[], type?: FinancialTransaction["type"]) {
  return Object.entries(transactions.filter((item) => !type || item.type === type).reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.category || "Outros"]: (acc[item.category || "Outros"] ?? 0) + item.amount }), {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}
