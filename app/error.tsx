"use client";

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen bg-[#F9F9FD] text-text-primary">
      <div className="mx-auto flex w-full max-w-[816px] flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 sm:px-10">
          <h1 className="font-heading text-2xl font-extrabold tracking-[-0.03em] text-rose-900 sm:text-3xl">
            Algo deu errado
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-rose-800">
            Ocorreu um erro inesperado. Tente novamente e, se o problema
            persistir, volte mais tarde.
          </p>

          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand-dark px-6 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#2D4E8A]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </main>
  );
}
