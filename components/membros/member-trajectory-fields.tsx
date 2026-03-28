import {
  CategoriasTrajetoriaEntries,
  type PassoTrajetoria,
  TotalPassosTrajetoria,
} from "@/lib/mapeamento/trajetoria";
import { TrajetoriaSection } from "@/components/trajetoria/trajetoria-section";
import { MEMBER_FORM_FIELDS } from "@/lib/mapeamento/constants";

type MemberTrajectoryFieldsProps = {
  selectedPassos: PassoTrajetoria[];
  onTogglePasso: (passo: PassoTrajetoria) => void;
  title: string;
  description?: string | null;
  fieldError?: string;
};

export function MemberTrajectoryFields({
  selectedPassos,
  onTogglePasso,
  title,
  description,
  fieldError,
}: MemberTrajectoryFieldsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 px-1">
        <div>
          <h2 className="font-heading text-2xl font-extrabold tracking-[-0.03em] text-[#1A1C1F] sm:text-[1.9rem]">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-[#444750]">
              {description}
            </p>
          ) : null}
          <p className="mt-2 text-sm leading-6 text-[#444750]">
            {selectedPassos.length} de {TotalPassosTrajetoria} passos marcados
          </p>
        </div>
        <span className="rounded-full bg-[#D8E2FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#001A42]">
          Passo a Passo
        </span>
      </div>

      {CategoriasTrajetoriaEntries.map(([categoria, passos], index) => (
        <TrajetoriaSection
          key={categoria}
          categoria={categoria}
          passos={passos}
          selectedPassos={selectedPassos}
          onTogglePasso={onTogglePasso}
          defaultOpen={index === 0}
        />
      ))}

      {selectedPassos.map((passo) => (
        <input
          key={passo}
          type="hidden"
          name={MEMBER_FORM_FIELDS.passosConcluidos}
          value={passo}
        />
      ))}

      {fieldError ? (
        <p className="px-1 text-sm font-medium text-rose-700">
          {fieldError}
        </p>
      ) : null}
    </section>
  );
}
