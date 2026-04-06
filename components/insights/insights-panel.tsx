"use client";

import { useCallback, useMemo, useState } from "react";

import {
  computeCelulaRankings,
  computeTrajectoryInsights,
} from "@/lib/trajetoria";
import type { CategoryInsight, CelulaOption, CelulaRanking, MemberListItem } from "@/lib/types";

type InsightsPanelProps = {
  members: MemberListItem[];
  totalCelulas?: number;
  celulas?: CelulaOption[];
  unidadeTipo?: string;
  hideRankings?: boolean;
};

function StatCard({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        accent
          ? "bg-linear-to-br from-brand-dark to-brand text-white"
          : "bg-white border border-border-default"
      }`}
    >
      <p
        className={`font-heading text-2xl font-extrabold tracking-[-0.03em] ${
          accent ? "text-white" : "text-text-primary"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 text-xs font-semibold uppercase tracking-wide ${
          accent ? "text-white/70" : "text-text-muted"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function CategoryAccordion({
  category,
  totalMembers,
}: {
  category: CategoryInsight;
  totalMembers: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <div className="rounded-2xl border border-border-default bg-white overflow-hidden">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[#FAFBFD]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-semibold text-text-primary truncate">
            {category.name}
          </span>
          <span className="shrink-0 rounded-full bg-[#F4F6FB] px-2.5 py-0.5 text-xs font-bold text-brand-dark">
            {category.percentage}%
          </span>
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-border-default px-4 py-3.5 space-y-2.5">
          {category.steps.map((step) => (
            <div key={step.name} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-sm text-text-secondary truncate block">
                  {step.name}
                </span>
                <span className="text-xs text-text-muted">
                  {step.completedCount} {step.completedCount === 1 ? "membro concluiu" : "membros concluiram"} esta etapa
                </span>
              </div>
              <span className="shrink-0 text-sm font-semibold text-text-primary tabular-nums">
                {step.completedCount}{" "}
                <span className="text-text-muted font-normal">
                  / {totalMembers}
                </span>
              </span>
            </div>
          ))}
          <div className="mt-1 pt-2.5 border-t border-border-default flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-brand-dark">
              Etapa completa
            </span>
            <span className="text-sm font-bold text-brand-dark tabular-nums">
              {category.membersWithAllSteps}{" "}
              <span className="text-text-muted font-normal">
                / {totalMembers}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const RANK_STYLES: Record<number, string> = {
  0: "bg-[#FFF8E1] border-[#F9E07F] text-[#8B6E00]",
  1: "bg-[#F5F5F5] border-[#D6D6D6] text-[#5C5C5C]",
  2: "bg-[#FFF3E8] border-[#F0C9A0] text-[#8B5E2F]",
};

function CelulaRankingList({ rankings }: { rankings: CelulaRanking[] }) {
  if (rankings.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {rankings.map((celula, index) => {
        const rankBadge =
          RANK_STYLES[index] ??
          "bg-[#F4F6FB] border-[#E2E5ED] text-text-muted";

        return (
          <div
            key={celula.id}
            className="flex items-center gap-3 rounded-2xl border border-border-default bg-white px-4 py-3 sm:gap-4"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold ${rankBadge}`}
            >
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-bold text-text-primary">
                  {celula.nome}
                </span>
                <span className="shrink-0 text-sm font-extrabold text-brand-dark">
                  {celula.percentage}%
                </span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-border-default">
                <div
                  className="h-full rounded-full bg-linear-to-r from-brand-dark to-[#7B97D1] transition-all duration-500"
                  style={{ width: `${celula.percentage}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-text-muted">
                {celula.memberCount}{" "}
                {celula.memberCount === 1 ? "membro" : "membros"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getRankingSubtitle(tipo?: string): string {
  if (!tipo) return "Comparativo de progresso entre as celulas do setor.";
  const lower = tipo.toLowerCase();
  const article = /^[aeiou]/i.test(lower) ? "da" : "do";
  return `Comparativo de progresso entre as celulas ${article} ${lower}.`;
}

export function CelulaRankingSection({
  rankings,
  unidadeTipo,
}: {
  rankings: CelulaRanking[];
  unidadeTipo?: string;
}) {
  if (rankings.length === 0) return null;

  return (
    <div className="rounded-[24px] bg-white border border-border-default p-5 sm:p-6">
      <h3 className="font-heading text-lg font-extrabold tracking-[-0.03em] text-text-primary">
        Trajetoria por celula
      </h3>
      <p className="mt-1 text-sm leading-6 text-text-secondary">
        {getRankingSubtitle(unidadeTipo)}
      </p>

      <div className="mt-4">
        <CelulaRankingList rankings={rankings} />
      </div>
    </div>
  );
}

export function InsightsPanel({
  members,
  totalCelulas,
  celulas,
  unidadeTipo,
  hideRankings,
}: InsightsPanelProps) {
  const insights = useMemo(
    () => computeTrajectoryInsights(members),
    [members]
  );

  const rankings = useMemo(
    () => (celulas ? computeCelulaRankings(celulas, members) : []),
    [celulas, members]
  );

  if (insights.totalMembers === 0 && rankings.length === 0) {
    return null;
  }

  const showRankings = rankings.length > 0;

  return (
    <section className="space-y-4">
      <div className="rounded-[24px] bg-white border border-border-default p-5 sm:p-6">
        <h3 className="font-heading text-lg font-extrabold tracking-[-0.03em] text-text-primary">
          Panorama geral
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard
            value={`${insights.overallPercentage}%`}
            label="Trajetoria geral"
            accent
          />
          <StatCard
            value={String(insights.totalMembers)}
            label={insights.totalMembers === 1 ? "Membro" : "Membros"}
          />
          {totalCelulas !== undefined ? (
            <StatCard
              value={String(totalCelulas)}
              label={totalCelulas === 1 ? "Celula" : "Celulas"}
            />
          ) : null}
          <StatCard
            value={String(insights.membersWithFullTrajectory)}
            label="Trajetoria completa"
          />
          <StatCard
            value={String(insights.membersServingInMinistry)}
            label="Servindo em ministerio"
          />
          <StatCard
            value={String(insights.membersWithDiscipulador)}
            label="Discipulando"
          />
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">
            Progresso por etapa
          </h4>
          {insights.categories.map((cat) => (
            <CategoryAccordion
              key={cat.name}
              category={cat}
              totalMembers={insights.totalMembers}
            />
          ))}
        </div>
      </div>

      {showRankings && !hideRankings ? (
        <CelulaRankingSection rankings={rankings} unidadeTipo={unidadeTipo} />
      ) : null}
    </section>
  );
}
