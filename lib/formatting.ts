const ptBRDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatPhone(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return value;
}

export function formatBirthDate(value: string | null): string {
  if (!value) {
    return "Nao informada";
  }

  return ptBRDateFormatter.format(new Date(`${value}T00:00:00.000Z`));
}

export function formatCreatedAt(value: string): string {
  return ptBRDateFormatter.format(new Date(value));
}
