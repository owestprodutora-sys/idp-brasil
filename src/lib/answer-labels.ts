type TriState = "sim" | "nao" | "nao_sei" | string | null | undefined;

export function yesNoLabel(value: TriState): string {
  if (value === "sim") return "✅ Sim";
  if (value === "nao") return "❌ Não";
  if (value === "nao_sei") return "❔ Não sei";
  return "—";
}

export function documentLabel(value: TriState): string {
  if (value === "sim") return "✅ Possui";
  if (value === "nao") return "❌ Não possui";
  if (value === "nao_sei") return "❔ Não sei";
  return "—";
}

const STATUS_DETAIL_LABELS: Record<string, string> = {
  novo: "🟡 Aguardando análise da especialista",
  em_analise: "🔵 Em análise",
  contatado: "🟣 Contatado",
  convertido: "🟢 Convertido",
  perdido: "⚪ Perdido",
};

export function statusDetailLabel(status: string): string {
  return STATUS_DETAIL_LABELS[status] ?? status;
}
