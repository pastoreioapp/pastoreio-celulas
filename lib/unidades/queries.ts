import "server-only";

import { cache } from "react";

import { normalizeAccessCode } from "@/lib/form-helpers";
import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES } from "@/lib/constants";
import type { UnidadeOption } from "@/lib/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const UNIDADES_SELECT_COLUMNS =
  "id, nome, descricao, lideres, codigo_acesso, tipos_unidade(nome, nivel)";

type TipoUnidadeJoin = { nome: string; nivel: number };

type UnidadeRow = {
  id: string;
  nome: string;
  descricao: string | null;
  lideres: string | null;
  codigo_acesso: string | null;
  tipos_unidade: TipoUnidadeJoin | TipoUnidadeJoin[] | null;
};

function extractTipoJoin(join: UnidadeRow["tipos_unidade"]): TipoUnidadeJoin {
  const fallback: TipoUnidadeJoin = { nome: "SETOR", nivel: 1 };
  if (Array.isArray(join)) {
    return join[0] ?? fallback;
  }
  return join ?? fallback;
}

function mapUnidadeRowToOption(row: UnidadeRow): UnidadeOption {
  const tipo = extractTipoJoin(row.tipos_unidade);
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    lideres: row.lideres,
    codigoAcesso: row.codigo_acesso,
    tipo: tipo.nome,
    nivel: tipo.nivel,
  };
}

export type ResolvedUnidadeAccess = {
  code: string;
  unidadeId: string;
  unidade: UnidadeOption;
};

export const loadUnidadesFilhas = cache(
  async (parentId: string): Promise<UnidadeOption[]> => {
    const configError = getSupabaseConfigError();

    if (configError) {
      return [];
    }

    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .schema(MAPEAMENTO_SCHEMA)
        .from(MAPEAMENTO_TABLES.unidades)
        .select(UNIDADES_SELECT_COLUMNS)
        .eq("parent_id", parentId)
        .order("nome", { ascending: true });

      if (error) {
        return [];
      }

      return ((data ?? []) as UnidadeRow[]).map(mapUnidadeRowToOption);
    } catch {
      return [];
    }
  }
);

export async function loadDescendantUnidadeIds(rootId: string): Promise<string[]> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return [];
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .rpc("get_descendant_unidade_ids", { root_id: rootId });

    if (error) {
      return [];
    }

    return (data ?? [])
      .map((row: unknown) => {
        if (typeof row === "string") return row;
        if (typeof row === "object" && row !== null) {
          const r = row as Record<string, unknown>;
          return (r.get_descendant_unidade_ids ?? r.id) as string | undefined;
        }
        return undefined;
      })
      .filter((id: string | undefined): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export const loadUnidadeByAccessCode = cache(
  async (rawCode: string | null | undefined): Promise<ResolvedUnidadeAccess | null> => {
    const normalized = normalizeAccessCode(rawCode);

    if (!normalized) {
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
        .from(MAPEAMENTO_TABLES.unidades)
        .select(UNIDADES_SELECT_COLUMNS)
        .eq("codigo_acesso", normalized)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      const unidade = mapUnidadeRowToOption(data as UnidadeRow);

      return {
        code: normalized,
        unidadeId: unidade.id,
        unidade,
      };
    } catch {
      return null;
    }
  }
);
