export type CategoryType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: "salario", name: "Salário", type: "income", color: "#10b981", icon: "💰" },
  { id: "freelance", name: "Freelance", type: "income", color: "#06b6d4", icon: "💻" },
  { id: "investimentos", name: "Investimentos", type: "income", color: "#8b5cf6", icon: "📈" },
  { id: "alimentacao", name: "Alimentação", type: "expense", color: "#ef4444", icon: "🍔" },
  { id: "transporte", name: "Transporte", type: "expense", color: "#f59e0b", icon: "🚗" },
  { id: "moradia", name: "Moradia", type: "expense", color: "#3b82f6", icon: "🏠" },
  { id: "lazer", name: "Lazer", type: "expense", color: "#ec4899", icon: "🎮" },
  { id: "saude", name: "Saúde", type: "expense", color: "#14b8a6", icon: "🏥" },
  { id: "educacao", name: "Educação", type: "expense", color: "#6366f1", icon: "📚" },
  { id: "outros", name: "Outros", type: "expense", color: "#64748b", icon: "📦" },
];

export const INCOME_CATEGORIES = CATEGORIES.filter((c) => c.type === "income");
export const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c.type === "expense");

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name ?? id;
}

export function getCategoryColor(id: string): string {
  return getCategoryById(id)?.color ?? "#64748b";
}

export function getCategoryIcon(id: string): string {
  return getCategoryById(id)?.icon ?? "📦";
}
