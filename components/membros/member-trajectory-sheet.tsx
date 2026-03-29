"use client";

import Link from "next/link";
import { useEffect } from "react";

import {
  CategoriaTrajetoriaDescriptions,
  CategoriasTrajetoriaEntries,
  TotalPassosTrajetoria,
  type PassoTrajetoria,
} from "@/lib/trajetoria";
import { formatBirthDate, formatPhone } from "@/lib/formatting";
import { buildLeaderEditMemberRoute } from "@/lib/routes";
import type { MemberListItem } from "@/lib/types";

type MemberTrajectorySheetProps = {
  accessCode: string;
  member: MemberListItem | null;
  onClose: () => void;
};

function isStepCompleted(
  selectedSteps: PassoTrajetoria[],
  step: PassoTrajetoria
) {
  return selectedSteps.includes(step);
}

export function MemberTrajectorySheet({
  accessCode,
  member,
  onClose,
}: MemberTrajectorySheetProps) {
  useEffect(() => {
    if (!member) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [member, onClose]);

  if (!member) {
    return null;
  }

  const completedSteps = member.passosConcluidos.length;
  const completionPercentage = Math.round(
    (completedSteps / TotalPassosTrajetoria) * 100
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-text-primary/45 px-3 pb-3 pt-10 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-trajectory-title"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_rgba(26,28,31,0.24)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-black/5 px-5 pb-5 pt-4 sm:px-6">
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-[#DCE3F1] sm:hidden" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-badge-bg px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-badge-text">
                Trajetória completa
              </span>
              <h2
                id="member-trajectory-title"
                className="font-heading mt-3 text-3xl font-extrabold tracking-[-0.04em] text-text-primary"
              >
                {member.nome}
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {completedSteps} de {TotalPassosTrajetoria} passos concluídos (
                {completionPercentage}%).
              </p>
              <Link
                href={buildLeaderEditMemberRoute(accessCode, member.id)}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl border border-brand px-4 text-sm font-bold uppercase tracking-[0.08em] text-brand-dark transition hover:bg-[#EEF3FF]"
              >
                Editar dados
              </Link>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#D9DCE4] text-xl text-text-secondary transition hover:bg-[#F7F9FD]"
              aria-label={`Fechar trajetória de ${member.nome}`}
            >
              ×
            </button>
          </div>
        </div>

        <div className="max-h-[calc(88vh-132px)] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-4">
            <section className="rounded-[28px] border border-[#E5E9F2] bg-[#FBFCFE] p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-heading text-xl font-extrabold tracking-[-0.03em] text-text-primary">
                    Dados do membro
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-text-muted">
                    Informacoes pessoais registradas no cadastro.
                  </p>
                </div>

                <span className="inline-flex rounded-full bg-[#EEF3FF] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-badge-text">
                  Perfil
                </span>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#E6E8EF] bg-white px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
                    Estado civil
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium leading-6 text-text-primary">
                    {member.estadoCivil ?? "Nao informado"}
                  </dd>
                </div>

                <div className="rounded-2xl border border-[#E6E8EF] bg-white px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
                    Telefone
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium leading-6 text-text-primary">
                    {formatPhone(member.telefone) ?? "Nao informado"}
                  </dd>
                </div>

                <div className="rounded-2xl border border-[#E6E8EF] bg-white px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
                    Data de nascimento
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium leading-6 text-text-primary">
                    {formatBirthDate(member.dataNascimento)}
                  </dd>
                </div>

                <div className="rounded-2xl border border-[#E6E8EF] bg-white px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
                    Discipulador
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium leading-6 text-text-primary">
                    {member.discipuladorNome ?? "Nao informado"}
                  </dd>
                </div>

                <div className="rounded-2xl border border-[#E6E8EF] bg-white px-4 py-3 sm:col-span-2">
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
                    Ministerios
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {member.ministerios.length > 0 ? (
                      member.ministerios.map((ministerio) => (
                        <span
                          key={ministerio}
                          className="inline-flex rounded-full bg-[#EEF8F1] px-3 py-1.5 text-xs font-semibold text-[#11643A]"
                        >
                          {ministerio}
                        </span>
                      ))
                    ) : (
                      <span className="text-[15px] font-medium leading-6 text-text-primary">
                        Nao informado
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            {CategoriasTrajetoriaEntries.map(([categoria, passos]) => {
              const completedCount = passos.filter((step) =>
                isStepCompleted(member.passosConcluidos, step)
              ).length;

              return (
                <section
                  key={categoria}
                  className="rounded-[28px] border border-[#E5E9F2] bg-[#FBFCFE] p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-heading text-xl font-extrabold tracking-[-0.03em] text-text-primary">
                        {categoria}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        {CategoriaTrajetoriaDescriptions[categoria]}
                      </p>
                    </div>

                    <span className="inline-flex rounded-full bg-[#EEF3FF] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-badge-text">
                      {completedCount}/{passos.length} concluídos
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {passos.map((step) => {
                      const isCompleted = isStepCompleted(
                        member.passosConcluidos,
                        step
                      );

                      return (
                        <div
                          key={step}
                          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                            isCompleted
                              ? "border-[#C9D8F7] bg-[#EEF3FF]"
                              : "border-[#E6E8EF] bg-white"
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-bold ${
                              isCompleted
                                ? "border-brand bg-brand text-white"
                                : "border-[#C7CCD8] bg-white text-[#C7CCD8]"
                            }`}
                            aria-hidden="true"
                          >
                            {isCompleted ? "✓" : ""}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-medium leading-6 text-text-primary">
                              {step}
                            </p>
                            <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-text-muted">
                              {isCompleted ? "Concluído" : "Pendente"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
