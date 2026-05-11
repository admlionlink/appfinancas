"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/categories";

const transactionSchema = z.object({
  description: z.string().trim().min(1, "Descrição obrigatória").max(120),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  type: z.enum(["income", "expense"]),
  category: z.string().refine((v) => CATEGORIES.some((c) => c.id === v), {
    message: "Categoria inválida",
  }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
});

export type TransactionFormState = {
  ok: boolean;
  error?: string;
};

export async function createTransaction(
  _prev: TransactionFormState | undefined,
  formData: FormData
): Promise<TransactionFormState> {
  const parsed = transactionSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    category: formData.get("category"),
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Usuário não autenticado" };

  const { error } = await supabase.from("transactions").insert({
    ...parsed.data,
    user_id: user.id,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/transacoes");
  return { ok: true };
}

export async function updateTransaction(
  id: string,
  _prev: TransactionFormState | undefined,
  formData: FormData
): Promise<TransactionFormState> {
  const parsed = transactionSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    category: formData.get("category"),
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = createClient();
  const { error } = await supabase.from("transactions").update(parsed.data).eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/transacoes");
  return { ok: true };
}

export async function deleteTransaction(id: string): Promise<TransactionFormState> {
  const supabase = createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/transacoes");
  return { ok: true };
}
