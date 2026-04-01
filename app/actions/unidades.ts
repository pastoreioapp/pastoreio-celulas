"use server";

import { redirect } from "next/navigation";

import {
  deleteUnidade,
  buildDeleteUnidadeErrorState,
} from "@/lib/unidades";
import type { DeleteState } from "@/lib/types";

export async function deleteUnidadeAction(
  _prevState: DeleteState,
  formData: FormData
): Promise<DeleteState> {
  const unidadeId =
    typeof formData.get("unidade_id") === "string"
      ? (formData.get("unidade_id") as string)
      : "";

  if (!unidadeId) {
    return buildDeleteUnidadeErrorState(
      "Dados insuficientes para excluir a unidade."
    );
  }

  const result = await deleteUnidade(unidadeId);

  if (result.success) {
    redirect("/");
  }

  return buildDeleteUnidadeErrorState(result.message);
}
