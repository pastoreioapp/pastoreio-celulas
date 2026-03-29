"use client";

import { useState } from "react";

import {
  ACCESS_CODE_SEARCH_PARAM,
  ACCESS_TYPE_SEARCH_PARAM,
  ACCESS_TYPE_CELULA,
  ACCESS_TYPE_SETOR,
  type AccessType,
} from "@/lib/constants";

type AccessCodeGateProps = {
  defaultValue: string;
  defaultType: AccessType;
  errorMessage: string | null;
};

const MODE_CONFIG = {
  [ACCESS_TYPE_CELULA]: {
    badge: "Acesso do lider",
    title: "Informe o codigo da sua celula",
    description:
      "O cadastro de membros so e liberado para a celula vinculada ao codigo informado.",
    placeholder: "Digite o codigo da celula",
    submitLabel: "Entrar na celula",
  },
  [ACCESS_TYPE_SETOR]: {
    badge: "Acesso de supervisores e pastores",
    title: "Informe o codigo da sua unidade",
    description:
      "Visualize todas as celulas da unidade vinculada ao codigo informado.",
    placeholder: "Digite o codigo da unidade",
    submitLabel: "Acessar unidade",
  },
} as const;

export function AccessCodeGate({
  defaultValue,
  defaultType,
  errorMessage,
}: AccessCodeGateProps) {
  const [code, setCode] = useState(defaultValue);
  const [accessType, setAccessType] = useState<AccessType>(defaultType);
  const [dismissedError, setDismissedError] = useState(false);
  const visibleError = dismissedError ? null : errorMessage;
  const config = MODE_CONFIG[accessType];

  function handleToggle(type: AccessType) {
    setAccessType(type);
    setDismissedError(true);
  }

  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(26,28,31,0.08)] sm:p-8">
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <div className="inline-flex rounded-full border border-[#E2E5ED] bg-[#F7F8FC] p-1">
          <button
            type="button"
            onClick={() => handleToggle(ACCESS_TYPE_CELULA)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition ${
              accessType === ACCESS_TYPE_CELULA
                ? "bg-badge-bg text-badge-text shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Celula
          </button>
          <button
            type="button"
            onClick={() => handleToggle(ACCESS_TYPE_SETOR)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition ${
              accessType === ACCESS_TYPE_SETOR
                ? "bg-badge-bg text-badge-text shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Supervisores e Pastores
          </button>
        </div>

        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-badge-bg px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-badge-text">
            {config.badge}
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-[-0.04em] text-text-primary sm:text-[2.4rem]">
            {config.title}
          </h1>
          <p className="text-sm leading-6 text-text-secondary sm:text-base">
            {config.description}
          </p>
        </div>

        <form method="get" className="space-y-4 text-left">
          <input
            type="hidden"
            name={ACCESS_TYPE_SEARCH_PARAM}
            value={accessType}
          />

          <label className="block space-y-3">
            <span className="block text-sm font-bold text-text-secondary">
              Codigo de acesso
            </span>
            <input
              type="text"
              name={ACCESS_CODE_SEARCH_PARAM}
              value={code}
              autoComplete="one-time-code"
              autoCapitalize="characters"
              spellCheck={false}
              required
              placeholder={config.placeholder}
              onChange={(event) => {
                setCode(event.target.value);

                if (!dismissedError && errorMessage) {
                  setDismissedError(true);
                }
              }}
              className={`min-h-[64px] w-full rounded-2xl border bg-[#F7F8FC] px-5 text-lg font-semibold uppercase tracking-[0.08em] text-text-primary outline-none transition placeholder:text-[#7A7F8C] focus:bg-white ${
                visibleError
                  ? "border-rose-300 focus:border-rose-500"
                  : "border-[#D9DCE4] focus:border-brand"
              }`}
            />
          </label>

          {visibleError ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
              {visibleError}
            </p>
          ) : null}

          <button
            type="submit"
            className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-linear-to-b from-brand-dark to-brand px-5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_18px_40px_rgba(63,91,147,0.22)] transition hover:brightness-105"
          >
            {config.submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
