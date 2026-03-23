import "server-only";

import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES } from "@/lib/mapeamento/constants";
import type { CelulaOption, LoadCelulasResult } from "@/lib/mapeamento/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const CELULAS_SELECT_COLUMNS = "id, nome, setor, dia_semana, horario";
const LOAD_CELULAS_ERROR_MESSAGE =
  "Nao foi possivel carregar as celulas agora. Verifique a conexao com o Supabase.";

type CelulaRow = {
  id: string;
  nome: string;
  setor: string | null;
  dia_semana: string | null;
  horario: string | null;
};

function mapCelulaRowToOption(celula: CelulaRow): CelulaOption {
  return {
    id: celula.id,
    nome: celula.nome,
    setor: celula.setor,
    diaSemana: celula.dia_semana,
    horario: celula.horario,
  };
}

export async function loadCelulaOptions(): Promise<LoadCelulasResult> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return {
      celulas: [],
      loadError: configError,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.celulas)
      .select(CELULAS_SELECT_COLUMNS)
      .order("nome", { ascending: true });

    if (error) {
      throw error;
    }

    const celulas = ((data ?? []) as CelulaRow[]).map(mapCelulaRowToOption);

    return {
      celulas,
      loadError: null,
    };
  } catch {
    return {
      celulas: [],
      loadError: LOAD_CELULAS_ERROR_MESSAGE,
    };
  }
}
