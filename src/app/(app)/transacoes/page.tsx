import { TransactionsClient } from "./transactions-client";
import { createClient } from "@/lib/supabase/server";
import { getMonthRange, parseMonthParam } from "@/lib/months";
import type { Transaction } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: {
    month?: string;
    category?: string;
    type?: string;
    q?: string;
    new?: string;
  };
}

export default async function TransacoesPage({ searchParams }: PageProps) {
  const { year, month } = parseMonthParam(searchParams.month);
  const range = getMonthRange(year, month);

  const supabase = createClient();

  let query = supabase
    .from("transactions")
    .select("*")
    .gte("date", range.startDate)
    .lte("date", range.endDate)
    .order("date", { ascending: false });

  if (searchParams.category && searchParams.category !== "all") {
    query = query.eq("category", searchParams.category);
  }

  if (
    searchParams.type &&
    (searchParams.type === "income" || searchParams.type === "expense")
  ) {
    query = query.eq("type", searchParams.type);
  }

  if (searchParams.q && searchParams.q.trim()) {
    query = query.ilike("description", `%${searchParams.q.trim()}%`);
  }

  const { data, error } = await query;
  const transactions: Transaction[] = error ? [] : (data ?? []);

  return (
    <TransactionsClient
      transactions={transactions}
      monthValue={`${year}-${month.toString().padStart(2, "0")}`}
      monthLabel={range.label}
      autoOpenNew={searchParams.new === "1"}
      filters={{
        category: searchParams.category ?? "all",
        type: searchParams.type ?? "all",
        q: searchParams.q ?? "",
      }}
    />
  );
}
