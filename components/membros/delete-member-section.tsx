"use client";

import { deleteLeaderMemberAction } from "@/app/actions/membros";
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";
import { MEMBER_FORM_FIELDS } from "@/lib/constants";

type DeleteMemberSectionProps = {
  memberId: string;
  celulaId: string;
  accessCode: string;
  memberNome: string;
};

export function DeleteMemberSection({
  memberId,
  celulaId,
  accessCode,
  memberNome,
}: DeleteMemberSectionProps) {
  return (
    <section className="rounded-[28px] border border-rose-100 bg-white p-5 sm:p-6">
      <h3 className="font-heading text-lg font-extrabold tracking-[-0.03em] text-text-primary">
        Zona de perigo
      </h3>
      <p className="mt-1 text-sm leading-6 text-text-secondary">
        Ao excluir {memberNome}, todos os dados e a trajetória registrada serão
        removidos permanentemente.
      </p>
      <div className="mt-4">
        <DeleteConfirmation
          title={`Excluir ${memberNome}?`}
          description="Esta acao nao pode ser desfeita. Todos os dados deste membro, incluindo a trajetoria de crescimento, serao permanentemente removidos."
          triggerLabel="Excluir membro"
          confirmLabel="Sim, excluir membro"
          confirmingLabel="Excluindo membro..."
          action={deleteLeaderMemberAction}
          hiddenFields={
            <>
              <input
                type="hidden"
                name={MEMBER_FORM_FIELDS.id}
                value={memberId}
              />
              <input
                type="hidden"
                name={MEMBER_FORM_FIELDS.celulaId}
                value={celulaId}
              />
              <input
                type="hidden"
                name={MEMBER_FORM_FIELDS.codigoAcesso}
                value={accessCode}
              />
            </>
          }
        />
      </div>
    </section>
  );
}
