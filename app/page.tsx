import { connection } from "next/server";

import {
  TotalCategoriasTrajetoria,
  TotalPassosTrajetoria,
} from "@/app/types/trajetoria";
import { MemberForm } from "@/components/membros/member-form";
import { loadCelulaOptions } from "@/lib/mapeamento/celulas";

export default async function Home() {
  await connection();

  const { celulas, loadError } = await loadCelulaOptions();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-6 sm:px-6 sm:py-8">
      <section className="rounded-[2rem] bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-950/20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
          Mapeamento de membros
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Cadastro simples para acompanhar a trajetoria da celula.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
          Selecione a celula, informe o nome do membro e marque os passos
          concluidos para salvar o registro com clareza e rapidez.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-sm text-slate-300">Etapas</p>
            <p className="mt-1 text-lg font-semibold">
              {TotalCategoriasTrajetoria} blocos
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-sm text-slate-300">Passos</p>
            <p className="mt-1 text-lg font-semibold">
              {TotalPassosTrajetoria} checkpoints
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-sm text-slate-300">Celulas ativas</p>
            <p className="mt-1 text-lg font-semibold">{celulas.length}</p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <MemberForm celulas={celulas} loadError={loadError} />
      </section>
    </main>
  );
}
