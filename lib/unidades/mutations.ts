import "server-only";

import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES } from "@/lib/constants";
import type { DeleteState } from "@/lib/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const DELETE_UNIDADE_ERROR_MESSAGE =
  "Nao foi possivel excluir a unidade agora. Verifique a conexao com o Supabase e tente novamente.";

type DeleteUnidadeResult =
  | { success: true }
  | { success: false; message: string };

export async function deleteUnidade(
  unidadeId: string
): Promise<DeleteUnidadeResult> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return { success: false, message: configError };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.unidades)
      .delete()
      .eq("id", unidadeId)
      .select("id");

    if (error || (data?.length ?? 0) !== 1) {
      return { success: false, message: DELETE_UNIDADE_ERROR_MESSAGE };
    }

    return { success: true };
  } catch {
    return { success: false, message: DELETE_UNIDADE_ERROR_MESSAGE };
  }
}

export function buildDeleteUnidadeErrorState(message: string): DeleteState {
  return { status: "error", message };
}
