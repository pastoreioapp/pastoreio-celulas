"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { SaveMemberIcon } from "@/components/ui/icons";

type SubmitButtonProps = {
  disabled?: boolean;
  label?: string;
  pendingLabel?: string;
  icon?: ReactNode;
};

export function SubmitButton({
  disabled = false,
  label = "Salvar membro",
  pendingLabel = "Salvando membro...",
  icon,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="flex min-h-15 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-linear-to-b from-brand-dark to-brand px-5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_-4px_24px_rgba(26,28,31,0.06)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {icon ?? <SaveMemberIcon className="h-5 w-5 shrink-0 text-white" />}
      {pending ? pendingLabel : label}
    </button>
  );
}
