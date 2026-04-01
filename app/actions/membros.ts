"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  buildSaveMemberErrorState,
  buildSaveMemberSuccessState,
  buildDeleteErrorState,
  createMember,
  updateMember,
  deleteMember,
  validateCreateMemberFormData,
  validateUpdateMemberFormData,
} from "@/lib/membros";
import {
  buildLeaderMembersRoute,
  buildLeaderEditMemberRoute,
  buildMemberSelfRegistrationRoute,
} from "@/lib/routes";
import { MEMBER_FORM_FIELDS } from "@/lib/constants";
import type { SaveMemberState, DeleteState } from "@/lib/types";

function readAccessCode(formData: FormData) {
  return typeof formData.get(MEMBER_FORM_FIELDS.codigoAcesso) === "string"
    ? (formData.get(MEMBER_FORM_FIELDS.codigoAcesso) as string)
    : "";
}

export async function saveLeaderMemberAction(
  _prevState: SaveMemberState,
  formData: FormData
): Promise<SaveMemberState> {
  const accessCode = readAccessCode(formData);
  const validation = await validateCreateMemberFormData(formData);

  if (!validation.success) {
    return validation.state;
  }

  const result = await createMember(validation.data);

  if (result.success) {
    revalidatePath(buildLeaderMembersRoute(accessCode));
    redirect(buildLeaderMembersRoute(accessCode));
  }

  return buildSaveMemberErrorState(result.message);
}

export async function saveSelfRegisterMemberAction(
  _prevState: SaveMemberState,
  formData: FormData
): Promise<SaveMemberState> {
  const accessCode = readAccessCode(formData);
  const validation = await validateCreateMemberFormData(formData);

  if (!validation.success) {
    return validation.state;
  }

  const result = await createMember(validation.data);

  if (result.success) {
    revalidatePath(buildMemberSelfRegistrationRoute(accessCode));
    revalidatePath(buildLeaderMembersRoute(accessCode));
    return buildSaveMemberSuccessState();
  }

  return buildSaveMemberErrorState(result.message);
}

export async function updateLeaderMemberAction(
  _prevState: SaveMemberState,
  formData: FormData
): Promise<SaveMemberState> {
  const accessCode = readAccessCode(formData);
  const validation = await validateUpdateMemberFormData(formData);

  if (!validation.success) {
    return validation.state;
  }

  const result = await updateMember(validation.data);

  if (result.success) {
    revalidatePath(buildLeaderMembersRoute(accessCode));
    revalidatePath(
      buildLeaderEditMemberRoute(accessCode, validation.data.id)
    );
    redirect(buildLeaderMembersRoute(accessCode));
  }

  return buildSaveMemberErrorState(result.message);
}

export async function deleteLeaderMemberAction(
  _prevState: DeleteState,
  formData: FormData
): Promise<DeleteState> {
  const accessCode = readAccessCode(formData);
  const memberId =
    typeof formData.get(MEMBER_FORM_FIELDS.id) === "string"
      ? (formData.get(MEMBER_FORM_FIELDS.id) as string)
      : "";
  const celulaId =
    typeof formData.get(MEMBER_FORM_FIELDS.celulaId) === "string"
      ? (formData.get(MEMBER_FORM_FIELDS.celulaId) as string)
      : "";

  if (!memberId || !celulaId) {
    return buildDeleteErrorState(
      "Dados insuficientes para excluir o membro."
    );
  }

  const result = await deleteMember(memberId, celulaId);

  if (result.success) {
    revalidatePath(buildLeaderMembersRoute(accessCode));
    redirect(buildLeaderMembersRoute(accessCode));
  }

  return buildDeleteErrorState(result.message);
}
