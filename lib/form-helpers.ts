import "server-only";

export function readTrimmedString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function readOptionalTrimmedString(value: FormDataEntryValue | null) {
  const trimmed = readTrimmedString(value);
  return trimmed ? trimmed : null;
}

function normalizeAccessCodeValue(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function normalizeAccessCode(code: string | null | undefined) {
  return typeof code === "string" ? normalizeAccessCodeValue(code) : "";
}
