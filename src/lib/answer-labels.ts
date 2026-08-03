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

// A label detalhada de status agora vem de @/lib/crm-config (resolveStatus),
// que também alimenta o StatusBadge e o seletor editável do modal.
