"use client";

import { useMemo } from "react";

import { computeTrajectoryInsights } from "@/lib/mapeamento/trajetoria";
import type { MemberListItem } from "@/lib/mapeamento/types";

type InsightsPanelProps = {
  members: MemberListItem[];
  totalCelulas?: number;
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
          ? "bg-linear-to-br from-[#3F5B93] to-[#5974AD] text-white"
          : "bg-white border border-[#E7EAF3]"
      }`}
    >
      <p
        className={`font-heading text-2xl font-extrabold tracking-[-0.03em] ${
          accent ? "text-white" : "text-[#1A1C1F]"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 text-xs font-semibold uppercase tracking-wide ${
          accent ? "text-white/70" : "text-[#5C6070]"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function ProgressBar({
  label,
  percentage,
  description,
}: {
  label: string;
  percentage: number;
  description?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1A1C1F]">{label}</span>
        <span className="text-sm font-bold text-[#3F5B93]">{percentage}%</span>
      </div>
      {description ? (
        <p className="mt-0.5 text-xs text-[#5C6070]">{description}</p>
      ) : null}
      <div className="mt-2 h-2.5 rounded-full bg-[#E7EAF3]">
        <div
          className="h-full rounded-full bg-linear-to-r from-[#3F5B93] to-[#7B97D1] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function InsightsPanel({ members, totalCelulas }: InsightsPanelProps) {
  const insights = useMemo(
    () => computeTrajectoryInsights(members),
    [members]
  );

  if (insights.totalMembers === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[24px] bg-white border border-[#E7EAF3] p-5 sm:p-6">
        <h3 className="font-heading text-lg font-extrabold tracking-[-0.03em] text-[#1A1C1F]">
          Panorama geral
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
          {totalCelulas === undefined ? (
            <StatCard
              value={String(insights.membersWithDiscipulador)}
              label="Com discipulador"
            />
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#5C6070]">
            Progresso por etapa
          </h4>
          {insights.categories.map((cat) => (
            <ProgressBar
              key={cat.name}
              label={cat.name}
              percentage={cat.percentage}
              description={cat.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
