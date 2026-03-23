import { resolveCelulaAccess } from "@/lib/mapeamento/acesso";
import { loadCelulaOptionById } from "@/lib/mapeamento/celulas";
import { ACCESS_CODE_SEARCH_PARAM } from "@/lib/mapeamento/constants";

export function buildLeaderMembersRoute(accessCode: string) {
  return `/lider/${encodeURIComponent(accessCode)}`;
}

export function buildLeaderNewMemberRoute(accessCode: string) {
  return `${buildLeaderMembersRoute(accessCode)}/novo`;
}

export function buildLegacyAccessRoute(accessCode: string) {
  return `/?${ACCESS_CODE_SEARCH_PARAM}=${encodeURIComponent(accessCode)}`;
}

export async function resolveLeaderRouteAccess(code: string) {
  const access = resolveCelulaAccess(code);

  if (!access) {
    return null;
  }

  const { celulas, loadError } = await loadCelulaOptionById(access.celulaId);

  if (loadError || celulas.length === 0) {
    return null;
  }

  return {
    access,
    celula: celulas[0],
  };
}
