const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

const decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export function formatCurrency(value: number) {
  return brl.format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value: number) {
  return decimal.format(Number.isFinite(value) ? value : 0);
}

export function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
}

export function safeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
