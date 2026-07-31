import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  novo: "bg-ouro-50 text-ouro-600 border-ouro-500/30",
  em_analise: "bg-selo-50 text-selo-700 border-selo-700/20",
  contatado: "bg-blue-50 text-blue-700 border-blue-200",
  convertido: "bg-green-50 text-green-700 border-green-200",
  perdido: "bg-ink/5 text-ink/50 border-ink/10",
};

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  em_analise: "Em análise",
  contatado: "Contatado",
  convertido: "Convertido",
  perdido: "Perdido",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-ink/5 text-ink/60 border-ink/10";
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        style,
      )}
    >
      {label}
    </span>
  );
}
