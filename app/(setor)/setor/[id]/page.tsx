import { notFound } from "next/navigation";

import { CelulaList } from "@/components/membros/celula-list";
import { loadCelulasBySetorId } from "@/lib/mapeamento/celulas";
import { resolveSetorById } from "@/lib/mapeamento/setores";

type SetorCelulasPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SetorCelulasPage({
  params,
}: SetorCelulasPageProps) {
  const { id } = await params;
  const access = await resolveSetorById(id);

  if (!access) {
    notFound();
  }

  const { celulas, loadError } = await loadCelulasBySetorId(access.setorId);

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

  return <CelulaList celulas={celulas} setorNome={access.setor.nome} />;
}
