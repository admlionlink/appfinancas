"use client";

import { useTransition } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getCategoryIcon, getCategoryName } from "@/lib/categories";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { deleteTransaction } from "./actions";
import type { Transaction } from "@/lib/types";

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

export function TransactionsTable({ transactions, onEdit }: TransactionsTableProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return;
    startTransition(async () => {
      const result = await deleteTransaction(id);
      if (result.ok) {
        toast({ title: "Transação excluída" });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: result.error,
        });
      }
    });
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium">Nenhuma transação encontrada</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste os filtros ou cadastre uma nova transação.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3 text-right">Valor</th>
              <th className="w-12 px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b text-sm last:border-0">
                <td className="px-6 py-4 font-medium">{t.description}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  <span className="mr-1">{getCategoryIcon(t.category)}</span>
                  {getCategoryName(t.category)}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{formatDate(t.date)}</td>
                <td
                  className={cn(
                    "px-6 py-4 text-right font-semibold",
                    t.type === "income" ? "text-success" : "text-destructive"
                  )}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(Number(t.amount))}
                </td>
                <td className="px-6 py-4">
                  <RowMenu
                    onEdit={() => onEdit(t)}
                    onDelete={() => handleDelete(t.id)}
                    disabled={isPending}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y md:hidden">
        {transactions.map((t) => (
          <li key={t.id} className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
              {getCategoryIcon(t.category)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{t.description}</p>
              <p className="text-xs text-muted-foreground">
                {getCategoryName(t.category)} · {formatDate(t.date)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <p
                className={cn(
                  "shrink-0 text-sm font-semibold",
                  t.type === "income" ? "text-success" : "text-destructive"
                )}
              >
                {t.type === "income" ? "+" : "-"}
                {formatCurrency(Number(t.amount))}
              </p>
              <RowMenu
                onEdit={() => onEdit(t)}
                onDelete={() => handleDelete(t.id)}
                disabled={isPending}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function RowMenu({
  onEdit,
  onDelete,
  disabled,
}: {
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={disabled} aria-label="Ações">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
