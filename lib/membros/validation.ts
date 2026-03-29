import "server-only";

import { TodosPassosTrajetoria, type PassoTrajetoria } from "@/lib/trajetoria";
import { loadCelulaByAccessCode } from "@/lib/celulas";
import { MEMBER_FORM_FIELDS } from "@/lib/constants";
import type {
  CreateMemberInput,
  SaveMemberFieldErrors,
  SaveMemberState,
  UpdateMemberInput,
} from "@/lib/types";
import { readTrimmedString, readOptionalTrimmedString } from "@/lib/form-helpers";
import { createSaveMemberState } from "./mutations";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PASSOS_VALIDOS = new Set<string>(TodosPassosTrajetoria);

type ValidateMemberFormResult =
  | { success: true; data: CreateMemberInput }
  | { success: false; state: SaveMemberState };

type ValidateUpdateMemberFormResult =
  | { success: true; data: UpdateMemberInput }
  | { success: false; state: SaveMemberState };

function normalizePhone(value: string | null) {
  if (!value) {
    return null;
  }

  const digits = value.replace(/\D/g, "");

  return digits ? digits : null;
}

function normalizeMinisterios(value: string | null) {
  if (!value) {
    return [];
  }

  return [...new Set(
    value
      .split(/[\n,;]/)
      .map((item) => item.trim())
      .filter(Boolean)
  )];
}

function isValidBirthDate(value: string | null) {
  if (!value) {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed.toISOString().slice(0, 10) === value;
}

function getSelectedPassos(formData: FormData) {
  const selected = formData
    .getAll(MEMBER_FORM_FIELDS.passosConcluidos)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim());

  return [...new Set(selected)];
}

async function validateMemberPayload(
  formData: FormData
): Promise<{
  fieldErrors: SaveMemberFieldErrors;
  payload: CreateMemberInput;
}> {
  const codigoAcesso = readTrimmedString(
    formData.get(MEMBER_FORM_FIELDS.codigoAcesso)
  );
  const nome = readTrimmedString(formData.get(MEMBER_FORM_FIELDS.nome));
  const celulaId = readTrimmedString(formData.get(MEMBER_FORM_FIELDS.celulaId));
  const estadoCivil = readOptionalTrimmedString(
    formData.get(MEMBER_FORM_FIELDS.estadoCivil)
  );
  const telefone = normalizePhone(
    readOptionalTrimmedString(formData.get(MEMBER_FORM_FIELDS.telefone))
  );
  const dataNascimento = readOptionalTrimmedString(
    formData.get(MEMBER_FORM_FIELDS.dataNascimento)
  );
  const discipuladorNome = readOptionalTrimmedString(
    formData.get(MEMBER_FORM_FIELDS.discipuladorNome)
  );
  const ministerios = normalizeMinisterios(
    readOptionalTrimmedString(formData.get(MEMBER_FORM_FIELDS.ministerios))
  );
  const passosConcluidos = getSelectedPassos(formData);
  const fieldErrors: SaveMemberFieldErrors = {};
  const resolvedAccess = await loadCelulaByAccessCode(codigoAcesso);

  if (!codigoAcesso) {
    fieldErrors.codigoAcesso = "Informe o codigo de acesso da celula.";
  } else if (!resolvedAccess) {
    fieldErrors.codigoAcesso =
      "Codigo de acesso invalido. Volte e informe um codigo valido.";
  }

  if (!nome) {
    fieldErrors.nome = "Informe o nome do membro.";
  } else if (nome.length > 120) {
    fieldErrors.nome = "Use um nome com no maximo 120 caracteres.";
  }

  if (estadoCivil && estadoCivil.length > 60) {
    fieldErrors.estadoCivil = "Use um estado civil com no maximo 60 caracteres.";
  }

  if (telefone && (telefone.length < 10 || telefone.length > 11)) {
    fieldErrors.telefone = "Informe um telefone com DDD valido.";
  }

  if (!isValidBirthDate(dataNascimento)) {
    fieldErrors.dataNascimento = "Informe uma data de nascimento valida.";
  }

  if (discipuladorNome && discipuladorNome.length > 120) {
    fieldErrors.discipuladorNome =
      "Use um nome de discipulador com no maximo 120 caracteres.";
  }

  const ministerioInvalido = ministerios.find((ministerio) => ministerio.length > 80);

  if (ministerioInvalido) {
    fieldErrors.ministerios =
      "Use nomes de ministerios com no maximo 80 caracteres cada.";
  }

  if (!celulaId) {
    fieldErrors.celulaId = "Selecione a celula que o membro frequenta.";
  } else if (!UUID_REGEX.test(celulaId)) {
    fieldErrors.celulaId = "A celula selecionada e invalida.";
  } else if (resolvedAccess && resolvedAccess.celulaId !== celulaId) {
    fieldErrors.celulaId =
      "A celula enviada nao corresponde ao codigo de acesso informado.";
  }

  const possuiPassoInvalido = passosConcluidos.some(
    (passo) => !PASSOS_VALIDOS.has(passo)
  );

  if (possuiPassoInvalido) {
    fieldErrors.passos =
      "Encontramos um passo invalido. Atualize a pagina e tente novamente.";
  }

  return {
    fieldErrors,
    payload: {
      nome,
      celulaId,
      estadoCivil,
      telefone,
      dataNascimento,
      discipuladorNome,
      ministerios,
      passosConcluidos: passosConcluidos as PassoTrajetoria[],
    },
  };
}

export async function validateCreateMemberFormData(
  formData: FormData
): Promise<ValidateMemberFormResult> {
  const { fieldErrors, payload } = await validateMemberPayload(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: createSaveMemberState(
        "error",
        "Revise os campos destacados e tente novamente.",
        fieldErrors
      ),
    };
  }

  return {
    success: true,
    data: payload,
  };
}

export async function validateUpdateMemberFormData(
  formData: FormData
): Promise<ValidateUpdateMemberFormResult> {
  const memberId = readTrimmedString(formData.get(MEMBER_FORM_FIELDS.id));
  const { fieldErrors, payload } = await validateMemberPayload(formData);

  if (!memberId) {
    fieldErrors.id = "Nao identificamos o membro que sera atualizado.";
  } else if (!UUID_REGEX.test(memberId)) {
    fieldErrors.id = "O identificador do membro e invalido.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: createSaveMemberState(
        "error",
        "Revise os campos destacados e tente novamente.",
        fieldErrors
      ),
    };
  }

  return {
    success: true,
    data: {
      ...payload,
      id: memberId,
    },
  };
}
