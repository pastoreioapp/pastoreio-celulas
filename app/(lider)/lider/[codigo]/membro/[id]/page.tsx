import { notFound } from "next/navigation";

import { updateLeaderMemberAction } from "@/app/actions/membros";
import { MemberForm } from "@/components/membros/member-form";
import {
  loadMemberByIdAndCelulaId,
  mapMemberToFormValues,
} from "@/lib/membros";
import { buildLeaderMembersRoute } from "@/lib/routes";
import { resolveLeaderRouteAccess } from "@/lib/rotas";

type LeaderEditMemberPageProps = {
  params: Promise<{ codigo: string; id: string }>;
};

export default async function LeaderEditMemberPage(
  props: LeaderEditMemberPageProps
) {
  const { codigo, id } = await props.params;
  const access = await resolveLeaderRouteAccess(codigo);

  if (!access) {
    notFound();
  }

  const { member, loadError } = await loadMemberByIdAndCelulaId(
    id,
    access.celula.id
  );

  if (!member && !loadError) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(26,28,31,0.08)] sm:p-6">
        <span className="inline-flex rounded-full bg-badge-bg px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-badge-text">
          Edicao de membro
        </span>
        <h2 className="font-heading mt-3 text-3xl font-extrabold tracking-[-0.04em] text-text-primary">
          Atualizar {member?.nome ?? "membro"} em {access.celula.nome}
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Revise os dados cadastrados anteriormente e atualize a trajetória sempre que a caminhada deste membro avançar.
        </p>
      </div>

      <MemberForm
        celulas={[access.celula]}
        initialValues={member ? mapMemberToFormValues(member) : undefined}
        loadError={loadError}
        lockedAccessCode={access.access.code}
        backHref={buildLeaderMembersRoute(access.access.code)}
        backLabel="Voltar para membros"
        formAction={updateLeaderMemberAction}
        submitLabel="Atualizar membro"
        resetLabel="Restaurar dados atuais"
        title="Trajetoria de Crescimento"
        description="Atualize os passos concluidos para manter o acompanhamento desta pessoa em dia."
      />
    </section>
  );
}
