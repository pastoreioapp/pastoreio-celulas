import "server-only";

import { cache } from "react";

import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES } from "@/lib/mapeamento/constants";
import type { SetorOption } from "@/lib/mapeamento/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const SETORES_SELECT_COLUMNS = "id, nome, descricao, lideres";

type SetorRow = {
  id: string;
  nome: string;
  descricao: string | null;
  lideres: string | null;
};

function mapSetorRowToOption(row: SetorRow): SetorOption {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    lideres: row.lideres,
  };
}

export type ResolvedSetorAccess = {
  setorId: string;
  setor: SetorOption;
};

export const resolveSetorById = cache(
  async (setorId: string): Promise<ResolvedSetorAccess | null> => {
    if (!setorId) {
      return null;
    }

    const configError = getSupabaseConfigError();

    if (configError) {
      return null;
    }

    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .schema(MAPEAMENTO_SCHEMA)
        .from(MAPEAMENTO_TABLES.setores)
        .select(SETORES_SELECT_COLUMNS)
        .eq("id", setorId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      const setor = mapSetorRowToOption(data as SetorRow);

      return {
        setorId: setor.id,
        setor,
      };
    } catch {
      return null;
    }
  }
);
