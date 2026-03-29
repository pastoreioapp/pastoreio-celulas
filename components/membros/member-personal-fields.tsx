import { MEMBER_FORM_FIELDS } from "@/lib/constants";
import type { SaveMemberFieldErrors } from "@/lib/types";

type MemberPersonalFieldsProps = {
  estadoCivil: string;
  telefone: string;
  dataNascimento: string;
  discipuladorNome: string;
  ministerios: string;
  disabled: boolean;
  fieldErrors: SaveMemberFieldErrors;
  onEstadoCivilChange: (value: string) => void;
  onTelefoneChange: (value: string) => void;
  onDataNascimentoChange: (value: string) => void;
  onDiscipuladorNomeChange: (value: string) => void;
  onMinisteriosChange: (value: string) => void;
};

export function MemberPersonalFields({
  estadoCivil,
  telefone,
  dataNascimento,
  discipuladorNome,
  ministerios,
  disabled,
  fieldErrors,
  onEstadoCivilChange,
  onTelefoneChange,
  onDataNascimentoChange,
  onDiscipuladorNomeChange,
  onMinisteriosChange,
}: MemberPersonalFieldsProps) {
  return (
    <section className="space-y-5">
      <div className="px-1">
        <h2 className="font-heading text-2xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-[1.9rem]">
          Dados do membro
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Registre as informações pessoais para facilitar o acompanhamento desta pessoa.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-3 block text-sm font-bold text-text-secondary">
            Estado civil
          </span>
          <input
            type="text"
            name={MEMBER_FORM_FIELDS.estadoCivil}
            value={estadoCivil}
            onChange={(event) => onEstadoCivilChange(event.target.value)}
            disabled={disabled}
            placeholder="Ex.: Solteiro(a)"
            className="min-h-14 w-full rounded-xl border-2 border-transparent bg-surface-input px-5 text-base font-medium text-text-primary outline-none transition placeholder:text-text-secondary/40 focus:border-brand focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          />
          {fieldErrors.estadoCivil ? (
            <p className="px-1 pt-2 text-sm font-medium text-rose-700">
              {fieldErrors.estadoCivil}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-bold text-text-secondary">
            Telefone
          </span>
          <input
            type="tel"
            name={MEMBER_FORM_FIELDS.telefone}
            value={telefone}
            onChange={(event) => onTelefoneChange(event.target.value)}
            disabled={disabled}
            placeholder="(00) 00000-0000"
            className="min-h-14 w-full rounded-xl border-2 border-transparent bg-surface-input px-5 text-base font-medium text-text-primary outline-none transition placeholder:text-text-secondary/40 focus:border-brand focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          />
          {fieldErrors.telefone ? (
            <p className="px-1 pt-2 text-sm font-medium text-rose-700">
              {fieldErrors.telefone}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-bold text-text-secondary">
            Data de nascimento
          </span>
          <input
            type="date"
            name={MEMBER_FORM_FIELDS.dataNascimento}
            value={dataNascimento}
            onChange={(event) => onDataNascimentoChange(event.target.value)}
            disabled={disabled}
            className="min-h-14 w-full rounded-xl border-2 border-transparent bg-surface-input px-5 text-base font-medium text-text-primary outline-none transition focus:border-brand focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          />
          {fieldErrors.dataNascimento ? (
            <p className="px-1 pt-2 text-sm font-medium text-rose-700">
              {fieldErrors.dataNascimento}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-bold text-text-secondary">
            Discipulador
          </span>
          <input
            type="text"
            name={MEMBER_FORM_FIELDS.discipuladorNome}
            value={discipuladorNome}
            onChange={(event) => onDiscipuladorNomeChange(event.target.value)}
            disabled={disabled}
            placeholder="Nome de quem discipula"
            className="min-h-14 w-full rounded-xl border-2 border-transparent bg-surface-input px-5 text-base font-medium text-text-primary outline-none transition placeholder:text-text-secondary/40 focus:border-brand focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          />
          {fieldErrors.discipuladorNome ? (
            <p className="px-1 pt-2 text-sm font-medium text-rose-700">
              {fieldErrors.discipuladorNome}
            </p>
          ) : null}
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-3 block text-sm font-bold text-text-secondary">
            Ministérios
          </span>
          <textarea
            name={MEMBER_FORM_FIELDS.ministerios}
            value={ministerios}
            onChange={(event) => onMinisteriosChange(event.target.value)}
            disabled={disabled}
            placeholder="Ex.: Louvor, Intercessao, Midia"
            rows={3}
            className="w-full rounded-xl border-2 border-transparent bg-surface-input px-5 py-4 text-base font-medium text-text-primary outline-none transition placeholder:text-text-secondary/40 focus:border-brand focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          />
          <p className="mt-2 px-1 text-sm leading-6 text-text-muted">
            Informe um ou mais ministérios separados por vírgula, ponto e vírgula ou quebra de linha.
          </p>
          {fieldErrors.ministerios ? (
            <p className="px-1 pt-2 text-sm font-medium text-rose-700">
              {fieldErrors.ministerios}
            </p>
          ) : null}
        </label>
      </div>
    </section>
  );
}
