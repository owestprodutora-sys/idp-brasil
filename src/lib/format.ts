// Helpers de formatação de data/hora em pt-BR, usados no Painel Adrieli.

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  // Campos "date" do Postgres vêm como "AAAA-MM-DD" (sem horário); anexar
  // T00:00:00 evita que o fuso horário local jogue a data pro dia anterior.
  const withTime = value.length === 10 ? `${value}T00:00:00` : value;
  const date = new Date(withTime);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

// Formato "AAAA-MM-DD" esperado por inputs type="date" e pelas colunas
// `date` do Supabase.
export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 10);
}
