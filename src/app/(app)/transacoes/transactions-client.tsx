"use client";

import { useEffect, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonthSelector } from "@/components/dashboard/month-selector";
import { TransactionsTable } from "./transactions-table";
import { TransactionDialog } from "./transaction-dialog";
import { CATEGORIES } from "@/lib/categories";
import { exportTransactionsToCsv } from "@/lib/csv";
import type { Transaction } from "@/lib/types";

interface TransactionsClientProps {
  transactions: Transaction[];
  monthValue: string;
  monthLabel: string;
  autoOpenNew: boolean;
  filters: {
    category: string;
    type: string;
    q: string;
  };
}

export function TransactionsClient({
  transactions,
  monthValue,
  monthLabel,
  autoOpenNew,
  filters,
}: TransactionsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [searchValue, setSearchValue] = useState(filters.q);

  useEffect(() => {
    if (autoOpenNew) {
      setEditing(null);
      setDialogOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("new");
      const qs = params.toString();
      router.replace(qs ? `/transacoes?${qs}` : "/transacoes");
    }
  }, [autoOpenNew, router, searchParams]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.push(qs ? `/transacoes?${qs}` : "/transacoes");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam("q", searchValue.trim());
  }

  function handleNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleEdit(t: Transaction) {
    setEditing(t);
    setDialogOpen(true);
  }

  function handleExport() {
    exportTransactionsToCsv(transactions, `transacoes-${monthValue}.csv`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Transações</h1>
          <p className="text-sm text-muted-foreground">
            {transactions.length} transação(ões) em {monthLabel.toLowerCase()}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handleExport} disabled={transactions.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nova
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 sm:p-6 md:grid-cols-4">
          <MonthSelector currentValue={monthValue} />

          <Select value={filters.type} onValueChange={(v) => updateParam("type", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.category}
            onValueChange={(v) => updateParam("category", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9"
            />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <TransactionsTable transactions={transactions} onEdit={handleEdit} />
        </CardContent>
      </Card>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editing}
      />
    </div>
  );
}
