"use client";

import { useActionState, useState, type ReactNode } from "react";

import { initialDeleteState, type DeleteState } from "@/lib/types";

type DeleteConfirmationProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  confirmingLabel?: string;
  cancelLabel?: string;
  triggerLabel: string;
  hiddenFields: ReactNode;
  action: (
    prevState: DeleteState,
    formData: FormData
  ) => Promise<DeleteState>;
};

export function DeleteConfirmation({
  title,
  description,
  confirmLabel = "Sim, excluir",
  confirmingLabel = "Excluindo...",
  cancelLabel = "Cancelar",
  triggerLabel,
  hiddenFields,
  action,
}: DeleteConfirmationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    action,
    initialDeleteState
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border-2 border-rose-200 px-5 text-sm font-bold uppercase tracking-[0.08em] text-rose-700 transition hover:border-rose-300 hover:bg-rose-50"
      >
        {triggerLabel}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-text-primary/45 px-3 pb-3 pt-10 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirmation-title"
          onClick={() => {
            if (!pending) setIsOpen(false);
          }}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(26,28,31,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-6 pb-2 pt-5 sm:pt-6">
              <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-[#DCE3F1] sm:hidden" />

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7 text-rose-600"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
              </div>

              <h2
                id="delete-confirmation-title"
                className="font-heading text-2xl font-extrabold tracking-[-0.03em] text-text-primary"
              >
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {description}
              </p>

              {state.status === "error" && state.message ? (
                <div
                  className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
                  role="alert"
                >
                  {state.message}
                </div>
              ) : null}
            </div>

            <form action={formAction} className="px-6 pb-6 pt-4">
              {hiddenFields}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={pending}
                  className="flex min-h-13 w-full items-center justify-center rounded-xl bg-rose-600 px-5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? confirmingLabel : confirmLabel}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-13 w-full items-center justify-center rounded-xl border border-[#D4D9E4] px-5 text-sm font-bold uppercase tracking-[0.08em] text-text-secondary transition hover:bg-[#F4F6FB] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {cancelLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
