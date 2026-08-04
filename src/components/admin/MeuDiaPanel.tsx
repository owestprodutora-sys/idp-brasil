import { cn } from "@/lib/utils";
import type { MeuDiaResumo } from "@/lib/meu-dia";

export type MeuDiaCardKey =
  | "novosLeads"
  | "followUpsVencidos"
  | "documentosAguardandoValidacao"
  | "documentosInvalidos"
  | "casosCriticos"
  | "finalizadosHoje";

// FASE 4B — FEATURE 013. Só exibe números já calculados em
// lib/meu-dia.ts (buildMeuDiaResumo) — nenhum recálculo de regra aqui.
// Cada card é clicável e aplica o filtro correspondente na lista de leads
// (ver SpecialistDashboard.tsx), com o mesmo comportamento de toggle já
// usado em DashboardCards.tsx (clicar de novo no card ativo remove o
// filtro).
export function MeuDiaPanel({
  resumo,
  activeCard,
  onToggleCard,
}: {
  resumo: MeuDiaResumo;
  activeCard: MeuDiaCardKey | null;
  onToggleCard: (key: MeuDiaCardKey) => void;
}) {
  const cards: { key: MeuDiaCardKey; label: string; value: number; alert?: boolean }[] = [
    { key: "novosLeads", label: "Novos leads", value: resumo.novosLeads },
    {
      key: "followUpsVencidos",
      label: "Follow-ups vencidos",
      value: resumo.followUpsVencidos,
      alert: resumo.followUpsVencidos > 0,
    },
    {
      key: "documentosAguardandoValidacao",
      label: "Documentos aguardando validação",
      value: resumo.documentosAguardandoValidacao,
    },
    {
      key: "documentosInvalidos",
      label: "Documentos inválidos",
      value: resumo.documentosInvalidos,
      alert: resumo.documentosInvalidos > 0,
    },
    {
      key: "casosCriticos",
      label: "Casos críticos",
      value: resumo.casosCriticos,
      alert: resumo.casosCriticos > 0,
    },
  ];

  // "Casos finalizados hoje (quando houver)" — o card só aparece quando
  // há pelo menos um finalizado hoje, conforme pedido no spec.
  if (resumo.finalizadosHoje > 0) {
    cards.push({ key: "finalizadosHoje", label: "Finalizados hoje", value: resumo.finalizadosHoje });
  }

  return (
    <div className="rounded-2xl border border-selo-700/10 bg-white px-5 py-5">
      <h2 className="font-display text-base font-semibold text-selo-900">Meu Dia</h2>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => onToggleCard(card.key)}
            aria-pressed={activeCard === card.key}
            className={cn(
              "rounded-xl border bg-white px-4 py-3 text-left transition-colors hover:border-selo-700/30",
              card.alert ? "border-ouro-500/40 bg-ouro-50" : "border-selo-700/10",
              activeCard === card.key && "border-selo-700 ring-1 ring-selo-700",
            )}
          >
            <p
              className={cn(
                "font-display text-2xl font-semibold",
                card.alert ? "text-ouro-600" : "text-selo-900",
              )}
            >
              {card.value}
            </p>
            <p className="mt-0.5 text-xs text-ink/50">{card.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
