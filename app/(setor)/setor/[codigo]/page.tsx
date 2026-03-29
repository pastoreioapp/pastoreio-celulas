import { notFound } from "next/navigation";

import { CelulaList } from "@/components/celulas/celula-list";
import { InsightsPanel } from "@/components/insights/insights-panel";
import { UnidadeList } from "@/components/unidades/unidade-list";
import { loadCelulasByUnidadeId, loadCelulasByDescendantUnidades } from "@/lib/celulas";
import { loadMembersByUnidadeId, loadMembersByDescendantUnidades } from "@/lib/membros";
import { loadUnidadesFilhas } from "@/lib/unidades";
import { resolveUnidadeRouteAccess } from "@/lib/rotas";

type SetorCelulasPageProps = {
  params: Promise<{ codigo: string }>;
};

export default async function SetorCelulasPage({
  params,
}: SetorCelulasPageProps) {
  const { codigo } = await params;
  const access = await resolveUnidadeRouteAccess(codigo);

  if (!access) {
    notFound();
  }

  const { unidade } = access;
  const unidadeId = access.access.unidadeId;

  if (unidade.nivel > 1) {
    const [childUnidades, { celulas, loadError }, { members }] = await Promise.all([
      loadUnidadesFilhas(unidadeId),
      loadCelulasByDescendantUnidades(unidadeId),
      loadMembersByDescendantUnidades(unidadeId),
    ]);

    if (loadError) {
      return (
        <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-8 text-rose-900">
          <h2 className="font-heading text-2xl font-extrabold tracking-[-0.03em]">
            Nao foi possivel carregar os dados
          </h2>
          <p className="mt-3 text-sm leading-6">{loadError}</p>
        </section>
      );
    }

    return (
      <>
        <InsightsPanel members={members} totalCelulas={celulas.length} celulas={celulas} unidadeTipo={unidade.tipo} />
        <UnidadeList unidades={childUnidades} parentNome={unidade.nome} />
      </>
    );
  }

  const [{ celulas, loadError }, { members }] = await Promise.all([
    loadCelulasByUnidadeId(unidadeId),
    loadMembersByUnidadeId(unidadeId),
  ]);

  if (loadError) {
    return (
      <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-8 text-rose-900">
        <h2 className="font-heading text-2xl font-extrabold tracking-[-0.03em]">
          Nao foi possivel carregar as celulas
        </h2>
        <p className="mt-3 text-sm leading-6">{loadError}</p>
      </section>
    );
  }

  return (
    <>
      <InsightsPanel members={members} totalCelulas={celulas.length} celulas={celulas} unidadeTipo={unidade.tipo} />
      <CelulaList
        celulas={celulas}
        unidadeNome={unidade.nome}
        unidadeAccessCode={access.access.code}
      />
    </>
  );
}
