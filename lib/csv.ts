import type { FinancialTransaction, MarketingCampaign, SaleRecord } from "../types/dashboard";

export type CsvRow = Record<string, string>;
export interface ParsedCsv { headers: string[]; rows: CsvRow[]; separator: "," | ";"; }

export function parseCsvLine(line: string, separator: "," | ";") {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') { current += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === separator && !quoted) { cells.push(current.trim()); current = ""; }
    else current += char;
  }
  cells.push(current.trim());
  return cells;
}

export function parseCsv(content: string): ParsedCsv {
  const lines = content.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) throw new Error("O arquivo precisa ter cabeçalho e pelo menos uma linha de dados.");
  const commaCount = parseCsvLine(lines[0], ",").length;
  const semicolonCount = parseCsvLine(lines[0], ";").length;
  const separator: "," | ";" = semicolonCount > commaCount ? ";" : ",";
  const headers = parseCsvLine(lines[0], separator).map((header, index) => header.trim() || `Coluna ${index + 1}`);
  const rows = lines.slice(1).map((line) => {
    const cells = parseCsvLine(line, separator);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index]?.trim() ?? ""]));
  });
  return { headers, rows, separator };
}

export function csvNumber(value: string) {
  const cleaned = value.replace(/R\$/gi, "").replace(/\s/g, "").replace(/%/g, "");
  if (!/\d/.test(cleaned)) return 0;
  const normalized = cleaned.includes(",") ? cleaned.replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", ".") : cleaned;
  return Number(normalized.replace(/[^\d.-]/g, "")) || 0;
}

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const field = (row: CsvRow, patterns: RegExp[], fallback = "") => {
  const key = Object.keys(row).find((header) => patterns.some((pattern) => pattern.test(normalize(header))));
  return key ? row[key] : fallback;
};
const id = (prefix: string, index: number) => `${prefix}-${Date.now()}-${index}`;
const today = () => new Date().toISOString().slice(0, 10);

export function financeFromCsv(rows: CsvRow[]): FinancialTransaction[] {
  return rows.map((row, index) => {
    const typeText = normalize(field(row, [/^tipo$/, /moviment/, /natureza/]));
    const rawAmount = csvNumber(field(row, [/valor/, /total/, /quantia/]));
    const type = /despesa|saida|gasto|custo/.test(typeText) || rawAmount < 0 ? "expense" : "income";
    return { id: id("transaction", index), description: field(row, [/descri/, /nome/, /item/], `Movimentação ${index + 1}`), type, category: field(row, [/categoria/, /grupo/], "Outros"), amount: Math.abs(rawAmount), date: field(row, [/^data$/, /lancamento/], today()).slice(0, 10), status: /pendente|aberto/.test(normalize(field(row, [/status/, /situacao/]))) ? "pending" : "completed", recurrence: /mensal|recorrente/.test(normalize(field(row, [/recorrencia/]))) ? "monthly" : "once" } satisfies FinancialTransaction;
  }).filter((item) => item.amount > 0);
}

export function salesFromCsv(rows: CsvRow[]): SaleRecord[] {
  return rows.map((row, index) => {
    const quantity = Math.max(1, csvNumber(field(row, [/quantidade/, /^qtd$/], "1")) || 1);
    const total = csvNumber(field(row, [/^total$/, /^valor$/, /receita/]));
    const unitPrice = csvNumber(field(row, [/preco.*unit/, /unitario/])) || total / quantity;
    const statusText = normalize(field(row, [/status/, /situacao/]));
    return { id: id("sale", index), orderCode: field(row, [/pedido/, /codigo/, /^id$/], `#${index + 1}`), date: field(row, [/^data$/, /venda/], today()).slice(0, 10), customer: field(row, [/cliente/], `Cliente ${index + 1}`), customerType: /recorr|fiel|antigo/.test(normalize(field(row, [/tipo.*cliente/, /recorrencia/]))) ? "returning" : "new", product: field(row, [/produto/, /servico/, /item/], `Item ${index + 1}`), category: field(row, [/categoria/], "Outros"), quantity, unitPrice: Math.abs(unitPrice), discount: Math.abs(csvNumber(field(row, [/desconto/]))), shipping: Math.abs(csvNumber(field(row, [/frete/]))), channel: field(row, [/canal/, /origem/], "Outros"), status: /cancel/.test(statusText) ? "cancelled" : /pendente|aberto/.test(statusText) ? "pending" : "completed" } satisfies SaleRecord;
  }).filter((item) => item.unitPrice > 0);
}

export function marketingFromCsv(rows: CsvRow[]): MarketingCampaign[] {
  return rows.map((row, index) => {
    const statusText = normalize(field(row, [/status/, /situacao/]));
    return { id: id("campaign", index), name: field(row, [/campanha/, /^nome$/], `Campanha ${index + 1}`), channel: field(row, [/canal/, /origem/], "Outros"), startDate: field(row, [/inicio/, /^data$/], today()).slice(0, 10), endDate: field(row, [/fim/, /termino/]) || undefined, status: /paus/.test(statusText) ? "paused" : /encerr|final/.test(statusText) ? "finished" : "active", investment: Math.abs(csvNumber(field(row, [/investimento/, /custo/, /gasto/]))), impressions: Math.abs(csvNumber(field(row, [/impressoes/, /alcance/]))), clicks: Math.abs(csvNumber(field(row, [/cliques?/]))) , leads: Math.abs(csvNumber(field(row, [/leads?/]))) , conversions: Math.abs(csvNumber(field(row, [/conversoes?/, /vendas?/]))) , attributedRevenue: Math.abs(csvNumber(field(row, [/receita/, /faturamento/, /retorno/]))) } satisfies MarketingCampaign;
  }).filter((item) => item.name.trim());
}

export function genericRecords(parsed: ParsedCsv, labelColumn?: string, categoryColumn?: string, valueColumn?: string) {
  const label = labelColumn ?? parsed.headers.find((header) => /nome|descri|produto|campanha|cliente|item/i.test(header)) ?? parsed.headers[0];
  const category = categoryColumn ?? parsed.headers.find((header) => /categoria|canal|tipo/i.test(header));
  const numeric = valueColumn ?? parsed.headers.find((header) => parsed.rows.some((row) => csvNumber(row[header]) !== 0));
  return parsed.rows.map((row, index) => ({ label: row[label] || `Registro ${index + 1}`, category: category ? row[category] || "Importado" : "Importado", value: numeric ? csvNumber(row[numeric]) : 0 }));
}
