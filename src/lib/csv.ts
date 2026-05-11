import type { Transaction } from "@/lib/types";
import { getCategoryName } from "@/lib/categories";

function escapeCsvValue(value: string): string {
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildTransactionsCsv(transactions: Transaction[]): string {
  const header = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
  const rows = transactions.map((t) => [
    t.date,
    escapeCsvValue(t.description),
    escapeCsvValue(getCategoryName(t.category)),
    t.type === "income" ? "Receita" : "Despesa",
    Number(t.amount).toFixed(2).replace(".", ","),
  ]);

  const lines = [header.join(","), ...rows.map((r) => r.join(","))];
  return lines.join("\r\n");
}

export function exportTransactionsToCsv(
  transactions: Transaction[],
  filename = "transacoes.csv"
) {
  const csv = buildTransactionsCsv(transactions);
  const bom = "﻿";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
