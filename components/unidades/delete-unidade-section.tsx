"use client";

import { deleteUnidadeAction } from "@/app/actions/unidades";
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";

type DeleteUnidadeSectionProps = {
  unidadeId: string;
  unidadeNome: string;
  unidadeTipo: string;
};

const FEMININE_TIPOS = new Set(["REDE", "SEDE", "AREA"]);

function getArticle(tipo: string): string {
  return FEMININE_TIPOS.has(tipo) ? "a" : "o";
}

export function DeleteUnidadeSection({
  unidadeId,
  unidadeNome,
  unidadeTipo,
}: DeleteUnidadeSectionProps) {
  const article = getArticle(unidadeTipo);
  const tipoLower = unidadeTipo.toLowerCase();

  return (
    <section className="rounded-[28px] border border-rose-100 bg-white p-5 sm:p-6">
      <h3 className="font-heading text-lg font-extrabold tracking-[-0.03em] text-text-primary">
        Zona de perigo
      </h3>
      <p className="mt-1 text-sm leading-6 text-text-secondary">
        Ao excluir {article} {tipoLower} {unidadeNome}, todas as celulas e
        membros vinculados serao removidos permanentemente.
      </p>
      <div className="mt-4">
        <DeleteConfirmation
          title={`Excluir ${tipoLower} ${unidadeNome}?`}
          description={`Esta acao nao pode ser desfeita. Tod${article}s ${article}s dados d${article} ${tipoLower} ${unidadeNome}, incluindo celulas e membros vinculados, serao permanentemente removidos.`}
          triggerLabel={`Excluir ${tipoLower}`}
          confirmLabel={`Sim, excluir ${tipoLower}`}
          confirmingLabel={`Excluindo ${tipoLower}...`}
          action={deleteUnidadeAction}
          hiddenFields={
            <input type="hidden" name="unidade_id" value={unidadeId} />
          }
        />
      </div>
    </section>
  );
}
