"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  buildSaveMemberErrorState,
  createMember,
  validateCreateMemberFormData,
} from "@/lib/mapeamento/membros";
import { buildLeaderMembersRoute } from "@/lib/mapeamento/rotas";
import { MEMBER_FORM_FIELDS } from "@/lib/mapeamento/constants";
import type { SaveMemberState } from "@/lib/mapeamento/types";

export async function saveMemberAction(
  _prevState: SaveMemberState,
  formData: FormData
): Promise<SaveMemberState> {
  const accessCode =
    typeof formData.get(MEMBER_FORM_FIELDS.codigoAcesso) === "string"
      ? (formData.get(MEMBER_FORM_FIELDS.codigoAcesso) as string)
      : "";
  const validation = validateCreateMemberFormData(formData);

  if (!validation.success) {
    return validation.state;
  }

  const result = await createMember(validation.data);

  if (result.success) {
    revalidatePath("/");
    revalidatePath(buildLeaderMembersRoute(accessCode));
    redirect(buildLeaderMembersRoute(accessCode));
  }

  return buildSaveMemberErrorState(result.message);
}
