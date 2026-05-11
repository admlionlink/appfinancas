import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

interface StatsCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function StatsCards({ totalIncome, totalExpense, balance }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        label="Receitas"
        value={totalIncome}
        icon={<ArrowUpRight className="h-5 w-5" />}
        accent="bg-success/10 text-success"
        valueClassName="text-success"
      />
      <StatCard
        label="Despesas"
        value={totalExpense}
        icon={<ArrowDownRight className="h-5 w-5" />}
        accent="bg-destructive/10 text-destructive"
        valueClassName="text-destructive"
      />
      <StatCard
        label="Saldo"
        value={balance}
        icon={<Wallet className="h-5 w-5" />}
        accent="bg-primary/10 text-primary"
        valueClassName={cn(balance >= 0 ? "text-foreground" : "text-destructive")}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
  valueClassName,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  valueClassName?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className={cn("mt-1 text-2xl font-bold tracking-tight", valueClassName)}>
            {formatCurrency(value)}
          </p>
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", accent)}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
