import { connection } from "next/server";
import Image from "next/image";

import { MemberForm } from "@/components/membros/member-form";
import { resolveCelulaAccess } from "@/lib/mapeamento/acesso";
import { loadCelulaOptionById } from "@/lib/mapeamento/celulas";
import { ACCESS_CODE_SEARCH_PARAM } from "@/lib/mapeamento/constants";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParamValue(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function AccessCodeGate({
  defaultValue,
  errorMessage,
}: {
  defaultValue: string;
  errorMessage: string | null;
}) {
  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(26,28,31,0.08)] sm:p-8">
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-[#D8E2FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#17305E]">
            Acesso do lider
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-[-0.04em] text-[#1A1C1F] sm:text-[2.4rem]">
            Informe o codigo da sua celula
          </h1>
          <p className="text-sm leading-6 text-[#444750] sm:text-base">
            O cadastro de membros so e liberado para a celula vinculada ao
            codigo informado.
          </p>
        </div>

        <form method="get" className="space-y-4 text-left">
          <label className="block space-y-3">
            <span className="block text-sm font-bold text-[#444750]">
              Codigo de acesso
            </span>
            <input
              type="text"
              name={ACCESS_CODE_SEARCH_PARAM}
              defaultValue={defaultValue}
              autoComplete="one-time-code"
              autoCapitalize="characters"
              spellCheck={false}
              required
              placeholder="Ex.: CEL-1001"
              className="min-h-[64px] w-full rounded-2xl border border-[#D9DCE4] bg-[#F7F8FC] px-5 text-lg font-semibold uppercase tracking-[0.08em] text-[#1A1C1F] outline-none transition placeholder:text-[#7A7F8C] focus:border-[#5974AD] focus:bg-white"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-linear-to-b from-[#3F5B93] to-[#5974AD] px-5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_18px_40px_rgba(63,91,147,0.22)] transition hover:brightness-105"
          >
            Entrar na celula
          </button>
        </form>
      </div>
    </section>
  );
}

export default async function Home({ searchParams }: HomePageProps) {
  await connection();

  const params = await searchParams;
  const rawCode = readSearchParamValue(params[ACCESS_CODE_SEARCH_PARAM]);
  const resolvedAccess = resolveCelulaAccess(rawCode);
  const hasProvidedCode = Boolean(rawCode?.trim());
  const accessError = hasProvidedCode && !resolvedAccess
    ? "Codigo invalido. Confira o codigo da sua celula e tente novamente."
    : null;
  const { celulas, loadError } = resolvedAccess
    ? await loadCelulaOptionById(resolvedAccess.celulaId)
    : { celulas: [], loadError: null };

  return (
    <main className="min-h-screen bg-[#F9F9FD] text-[#1A1C1F]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#F9F9FD]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[816px] items-center justify-center px-6 py-4">
          <Image
            src="/figma/pastoreio-logo.png"
            alt="Pastore.io"
            width={320}
            height={70}
            priority
            className="h-11 w-auto sm:h-14"
          />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[816px] px-4 py-8 sm:px-6 sm:py-10">
        {resolvedAccess ? (
          <MemberForm
            celulas={celulas}
            loadError={loadError}
            lockedAccessCode={resolvedAccess.code}
          />
        ) : (
          <AccessCodeGate
            defaultValue={rawCode ?? ""}
            errorMessage={accessError}
          />
        )}
      </div>
    </main>
  );
}
