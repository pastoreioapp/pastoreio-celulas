"use client";

import Link from "next/link";

import { LeaderChipIcon } from "@/components/ui/icons";
import type { UnidadeOption } from "@/lib/types";
import { buildUnidadeRoute } from "@/lib/routes";

type UnidadeListProps = {
  unidades: UnidadeOption[];
  parentNome: string;
};

const LEADER_LABEL_BY_TIPO: Record<string, string> = {
  SETOR: "Supervisores",
  REDE: "Pastores",
  SEDE: "Pastores",
  DISTRITO: "Supervisores",
  AREA: "Supervisores",
};

function getLeaderLabel(tipo: string): string {
  return LEADER_LABEL_BY_TIPO[tipo] ?? "Lideres";
}

export function UnidadeList({ unidades, parentNome }: UnidadeListProps) {
  return (
    <section className="space-y-5">
      <div className="mt-15 flex flex-col gap-4 pb-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-heading text-[2rem] font-extrabold leading-none tracking-[-0.04em] text-text-primary">
              {unidades.length}{" "}
              {unidades.length === 1 ? "unidade vinculada" : "unidades vinculadas"}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-text-secondary">
            Unidades de {parentNome}. Clique para acessar.
          </p>
        </div>
      </div>

      <hr className="border-[#E2E5ED]" />

      {unidades.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#C9D4E9] bg-white px-6 py-10 text-center">
          <h3 className="font-heading text-2xl font-extrabold tracking-[-0.03em] text-text-primary">
            Nenhuma unidade vinculada
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">
            As unidades serao exibidas aqui assim que forem associadas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {unidades.map((unidade) => {
            const leaderLabel = getLeaderLabel(unidade.tipo);

            return (
              <article
                key={unidade.id}
                className="rounded-[24px] border border-border-default bg-white p-5 transition hover:border-[#C9D4E9] sm:p-6"
              >
                <Link
                  href={unidade.codigoAcesso ? buildUnidadeRoute(unidade.codigoAcesso) : "#"}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F0F4FE]">
                    <span className="font-heading text-lg font-bold text-brand-dark">
                      {unidade.nome
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase() ?? "")
                        .join("")}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-badge-bg px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-badge-text">
                        {unidade.tipo}
                      </span>
                    </div>
                    <h3 className="mt-1 font-heading text-xl font-extrabold tracking-[-0.03em] text-text-primary">
                      {unidade.nome}
                    </h3>

                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F6FB] px-3 py-1.5 text-xs font-semibold text-text-secondary">
                        <LeaderChipIcon className="h-3 w-3 shrink-0" alt="" />
                        {unidade.lideres
                          ? `${leaderLabel}: ${unidade.lideres}`
                          : `${leaderLabel} nao informados`}
                      </span>
                      {unidade.descricao ? (
                        <span className="inline-flex items-center rounded-full bg-[#F4F6FB] px-3 py-1.5 text-xs font-semibold text-text-secondary">
                          {unidade.descricao}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <svg
                    className="h-5 w-5 shrink-0 text-text-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
