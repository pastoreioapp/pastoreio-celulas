"use server";

import { revalidatePath } from "next/cache";

import {
  buildSaveMemberErrorState,
  buildSaveMemberSuccessState,
  createMember,
  validateCreateMemberFormData,
} from "@/lib/mapeamento/membros";
import type { SaveMemberState } from "@/lib/mapeamento/types";

export async function saveMemberAction(
  _prevState: SaveMemberState,
  formData: FormData
): Promise<SaveMemberState> {
  const validation = validateCreateMemberFormData(formData);

  if (!validation.success) {
    return validation.state;
  }

  const result = await createMember(validation.data);

  if (result.success) {
    revalidatePath("/");
    return buildSaveMemberSuccessState();
  }

  return buildSaveMemberErrorState(result.message);
}
