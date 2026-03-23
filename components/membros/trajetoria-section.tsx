import type {
  CategoriaTrajetoria,
  PassoTrajetoria,
} from "@/app/types/trajetoria";
import { MEMBER_FORM_FIELDS } from "@/lib/mapeamento/constants";

type TrajetoriaSectionProps = {
  categoria: CategoriaTrajetoria;
  passos: readonly PassoTrajetoria[];
  selectedPassos: PassoTrajetoria[];
  onTogglePasso: (passo: PassoTrajetoria) => void;
};

export function TrajetoriaSection({
  categoria,
  passos,
  selectedPassos,
  onTogglePasso,
}: TrajetoriaSectionProps) {
  const selectedCount = passos.filter((passo) =>
    selectedPassos.includes(passo)
  ).length;

  return (
    <details
      open
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">
            {categoria}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {selectedCount} de {passos.length} concluidos
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {passos.length} passos
        </span>
      </summary>

      <div className="border-t border-slate-200 px-4 py-3">
        <div className="grid gap-3">
          {passos.map((passo) => {
            const checked = selectedPassos.includes(passo);

            return (
              <label
                key={passo}
                className="flex min-h-16 items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  name={MEMBER_FORM_FIELDS.passosConcluidos}
                  value={passo}
                  checked={checked}
                  onChange={() => onTogglePasso(passo)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-950 focus:ring-2 focus:ring-slate-400"
                />
                <span className="text-sm font-medium leading-6 text-slate-800">
                  {passo}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </details>
  );
}
