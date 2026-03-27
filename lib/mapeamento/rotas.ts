import "server-only";

import { cache } from "react";

import { loadCelulaByAccessCode } from "@/lib/mapeamento/celulas";

export const resolveLeaderRouteAccess = cache(async (code: string) => {
  const resolved = await loadCelulaByAccessCode(code);

  if (!resolved) {
    return null;
  }

  return {
    access: {
      code: resolved.code,
      celulaId: resolved.celulaId,
      celulaNome: resolved.celulaNome,
    },
    celula: resolved.celula,
  };
});
