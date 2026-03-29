import "server-only";

import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES } from "@/lib/constants";
import type {
  CreateMemberInput,
  SaveMemberFieldErrors,
  SaveMemberState,
  UpdateMemberInput,
} from "@/lib/types";
import { initialSaveMemberState } from "@/lib/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const SAVE_MEMBER_ERROR_MESSAGE =
  "Nao foi possivel salvar o membro agora. Verifique a conexao com o Supabase e tente novamente.";
export const SAVE_MEMBER_SUCCESS_MESSAGE = "Membro salvo com sucesso.";
export const UPDATE_MEMBER_SUCCESS_MESSAGE = "Membro atualizado com sucesso.";

export function createSaveMemberState(
  status: SaveMemberState["status"],
  message: string | null,
  fieldErrors: SaveMemberFieldErrors = {}
): SaveMemberState {
  return {
    ...initialSaveMemberState,
    status,
    message,
    fieldErrors,
  };
}

type PersistMemberResult =
  | { success: true }
  | { success: false; message: string };

export async function createMember(
  input: CreateMemberInput
): Promise<PersistMemberResult> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return {
      success: false,
      message: configError,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.membros)
      .insert({
        nome: input.nome,
        celula_id: input.celulaId,
        estado_civil: input.estadoCivil,
        telefone: input.telefone,
        data_nascimento: input.dataNascimento,
        discipulador_nome: input.discipuladorNome,
        ministerios: input.ministerios,
        passos_concluidos: input.passosConcluidos,
      });

    if (error) {
      return {
        success: false,
        message: SAVE_MEMBER_ERROR_MESSAGE,
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: SAVE_MEMBER_ERROR_MESSAGE,
    };
  }
}

export async function updateMember(
  input: UpdateMemberInput
): Promise<PersistMemberResult> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return {
      success: false,
      message: configError,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.membros)
      .update({
        nome: input.nome,
        celula_id: input.celulaId,
        estado_civil: input.estadoCivil,
        telefone: input.telefone,
        data_nascimento: input.dataNascimento,
        discipulador_nome: input.discipuladorNome,
        ministerios: input.ministerios,
        passos_concluidos: input.passosConcluidos,
      })
      .eq("id", input.id)
      .eq("celula_id", input.celulaId)
      .select("id");

    if (error || (data?.length ?? 0) !== 1) {
      return {
        success: false,
        message: SAVE_MEMBER_ERROR_MESSAGE,
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: SAVE_MEMBER_ERROR_MESSAGE,
    };
  }
}

export function buildSaveMemberErrorState(message: string): SaveMemberState {
  return createSaveMemberState("error", message);
}

export function buildSaveMemberSuccessState(): SaveMemberState {
  return createSaveMemberState("success", SAVE_MEMBER_SUCCESS_MESSAGE);
}

export function buildUpdateMemberSuccessState(): SaveMemberState {
  return createSaveMemberState("success", UPDATE_MEMBER_SUCCESS_MESSAGE);
}
