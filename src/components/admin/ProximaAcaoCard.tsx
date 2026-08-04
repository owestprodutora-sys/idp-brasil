import type { ProximaAcao, ProximaAcaoBotao, ProximaAcaoUrgencia } from "@/lib/proxima-acao";

const URGENCIA_BADGE: Record<ProximaAcaoUrgencia, { label: string; className: string }> = {
  alta: { label: "Urgente", className: "bg-red-50 text-red-700 border-red-200" },
  media: { label: "Em dia", className: "bg-ouro-50 text-ouro-600 border-ouro-500/40" },
  baixa: { label: "Sem urgência", className: "bg-ink/5 text-ink/50 border-ink/10" },
};

// FASE 4A — FEATURE 011. Responsabilidade exclusiva: renderização + botão
// de ação. Quem decide o que o botão faz é quem usa o componente (ver
// integração em LeadDetailModal.tsx) — este componente só repassa o clique.
export function ProximaAcaoCard({
  proximaAcao,
  onAction,
}: {
  proximaAcao: ProximaAcao;
  onAction?: (botao: ProximaAcaoBotao) => void;
}) {
  const badge = URGENCIA_BADGE[proximaAcao.urgencia];

  return (
    <div className="rounded-xl border border-selo-700/10 bg-selo-50/40 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            Próxima ação
          </h3>
          <p className="mt-1 font-medium text-selo-900">{proximaAcao.titulo}</p>
          <p className="mt-0.5 text-sm text-ink/60">{proximaAcao.descricao}</p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      {proximaAcao.botao && (
        <button
          type="button"
          onClick={() => onAction?.(proximaAcao.botao!)}
          className="mt-2 text-xs font-semibold text-selo-700 hover:underline"
        >
          {proximaAcao.botao.label}
        </button>
      )}
    </div>
  );
}
