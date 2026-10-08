import type { SaleRecord } from "../../types/dashboard";

export function calculateSaleNet(sale: SaleRecord) {
  return Math.max(0, sale.quantity * sale.unitPrice - sale.discount);
}

export function calculateSalesSummary(sales: SaleRecord[]) {
  const completed = sales.filter((item) => item.status === "completed");
  const pending = sales.filter((item) => item.status === "pending");
  const cancelled = sales.filter((item) => item.status === "cancelled");
  const netRevenue = completed.reduce((sum, item) => sum + calculateSaleNet(item), 0);
  const units = completed.reduce((sum, item) => sum + item.quantity, 0);
  const shippingRevenue = completed.reduce((sum, item) => sum + item.shipping, 0);
  const discounts = completed.reduce((sum, item) => sum + item.discount, 0);
  return { completed, pending, cancelled, netRevenue, units, shippingRevenue, discounts, averageTicket: completed.length ? netRevenue / completed.length : 0, cancellationRate: sales.length ? cancelled.length / sales.length * 100 : 0 };
}
