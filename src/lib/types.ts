export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionInput {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: { category: string; total: number; type: TransactionType }[];
}
