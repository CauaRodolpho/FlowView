import test from "node:test";
import assert from "node:assert/strict";
import { csvNumber, financeFromCsv, genericRecords, marketingFromCsv, parseCsv, salesFromCsv } from "../lib/csv.ts";

test("lê campos entre aspas que contêm vírgula", () => {
  const parsed = parseCsv('Campanha,Canal,Receita\n"Outubro, São Paulo",Instagram,"R$ 3.500,50"');
  assert.equal(parsed.rows[0].Campanha, "Outubro, São Paulo");
  assert.equal(csvNumber(parsed.rows[0].Receita), 3500.5);
});

test("reconhece CSV separado por ponto e vírgula", () => {
  const parsed = parseCsv("Nome;Categoria;Valor\nCaneca;Produtos;120,50");
  assert.equal(parsed.separator, ";");
  assert.equal(parsed.rows[0].Categoria, "Produtos");
});

test("transforma colunas de marketing em campanha", () => {
  const parsed = parseCsv("Campanha;Canal;Investimento;Impressões;Cliques;Leads;Conversões;Receita\nLançamento;Instagram;1000;20000;800;120;15;4200");
  const [campaign] = marketingFromCsv(parsed.rows);
  assert.equal(campaign.name, "Lançamento");
  assert.equal(campaign.impressions, 20000);
  assert.equal(campaign.attributedRevenue, 4200);
});

test("classifica receita e despesa importadas por sinal e tipo", () => {
  const parsed = parseCsv("Descrição;Tipo;Categoria;Valor\nSalário;Receita;Renda;6200\nLuz;Despesa;Casa;-238,40");
  const transactions = financeFromCsv(parsed.rows);
  assert.deepEqual(transactions.map((item) => [item.type, item.amount]), [["income", 6200], ["expense", 238.4]]);
});

test("calcula preço unitário quando a venda importada informa somente o total", () => {
  const parsed = parseCsv("Pedido;Cliente;Produto;Quantidade;Total;Status\n#10;Ana;Caneca;2;180;Concluído");
  const [sale] = salesFromCsv(parsed.rows);
  assert.equal(sale.unitPrice, 90);
  assert.equal(sale.status, "completed");
});

test("organiza um CSV genérico em registros de dashboard", () => {
  const parsed = parseCsv("Nome;Categoria;Valor\nCaneca;Produtos;120,50");
  assert.deepEqual(genericRecords(parsed), [{ label: "Caneca", category: "Produtos", value: 120.5 }]);
});
