import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { MonthSelector } from "@/components/dashboard/month-selector";
import { createClient } from "@/lib/supabase/server";
import { getMonthRange, parseMonthParam } from "@/lib/months";
import type { Transaction } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  const { year, month } = parseMonthParam(searchParams.month);
  const range = getMonthRange(year, month);

  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .gte("date", range.startDate)
    .lte("date", range.endDate)
    .order("date", { ascending: false });

  const transactions: Transaction[] = error ? [] : (data ?? []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão consolidada das suas finanças em {range.label.toLowerCase()}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MonthSelector currentValue={`${year}-${month.toString().padStart(2, "0")}`} />
          <Button asChild>
            <Link href="/transacoes?new=1">
              <Plus className="mr-2 h-4 w-4" />
              Nova transação
            </Link>
          </Button>
        </div>
      </div>

      <StatsCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CategoryChart transactions={transactions} />
        </div>
        <div>
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
