// FASE 5A — Centro Financeiro Operacional. Fonte única de verdade pro
// status financeiro, pelo cálculo automático de honorários/comissão/
// especialista e pelos indicadores agregados do Dashboard Financeiro.
// Mesmo padrão já usado em crm-config.ts e documento-config.ts: nunca
// calcular direto no componente.

import type { LeadFinanceiro, StatusFinanceiro } from "@/types/lead-financeiro";

export interface StatusFinanceiroOption {
  value: StatusFinanceiro;
  emoji: string;
  label: string;
  badgeClass: string;
}

export const STATUS_FINANCEIRO_OPTIONS: StatusFinanceiroOption[] = [
  {
    value: "PENDENTE",
    emoji: "🔴",
    label: "Pendente",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  {
    value: "PARCIAL",
    emoji: "🟡",
    label: "Parcial",
    badgeClass: "bg-ouro-50 text-ouro-600 border-ouro-500/40",
  },
  {
    value: "RECEBIDO",
    emoji: "🟢",
    label: "Recebido",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
  },
  {
    value: "CANCELADO",
    emoji: "⚫",
    label: "Cancelado",
    badgeClass: "bg-ink/10 text-ink/60 border-ink/20",
  },
];

const STATUS_FINANCEIRO_MAP = new Map(
  STATUS_FINANCEIRO_OPTIONS.map((option) => [option.value, option]),
);

export function resolveStatusFinanceiro(status: string): StatusFinanceiroOption {
  return (
    STATUS_FINANCEIRO_MAP.get(status as StatusFinanceiro) ?? {
      value: status as StatusFinanceiro,
      emoji: "•",
      label: status,
      badgeClass: "bg-ink/5 text-ink/60 border-ink/10",
    }
  );
}

// Ordenação da Lista Financeira (FEATURE 021): pendentes primeiro, depois
// parciais, depois recebidos — cancelados por último (não é dinheiro ativo).
const STATUS_FINANCEIRO_ORDEM: Record<StatusFinanceiro, number> = {
  PENDENTE: 0,
  PARCIAL: 1,
  RECEBIDO: 2,
  CANCELADO: 3,
};

export function statusFinanceiroOrdem(status: string): number {
  return STATUS_FINANCEIRO_ORDEM[status as StatusFinanceiro] ?? 99;
}

export const FORMA_PAGAMENTO_OPTIONS: { value: string; label: string }[] = [
  { value: "pix", label: "PIX" },
  { value: "transferencia", label: "Transferência" },
  { value: "boleto", label: "Boleto" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "outro", label: "Outro" },
];

export function formaPagamentoLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return FORMA_PAGAMENTO_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export interface FinanceiroCalculo {
  valorHonorarios: number | null;
  valorComissaoIdp: number | null;
  valorEspecialista: number | null;
}

// FEATURE 018 — REGRAS. Honorários e comissão nunca são digitados
// diretamente: sempre recalculados a partir do valor recuperado estimado e
// dos dois percentuais, pra nunca haver cálculo duplicado/divergente entre
// o que fica salvo e o que aparece em tela.
//
// Exemplo do spec: recuperação com honorários de 20.000 e comissão IDP de
// 15% → comissão IDP 3.000, especialista 17.000.
export function calcularFinanceiro(
  valorRecuperacaoEstimado: number | null,
  percentualHonorarios: number | null,
  percentualComissaoIdp: number | null,
): FinanceiroCalculo {
  if (valorRecuperacaoEstimado === null || percentualHonorarios === null) {
    return { valorHonorarios: null, valorComissaoIdp: null, valorEspecialista: null };
  }

  const valorHonorarios = round2(valorRecuperacaoEstimado * (percentualHonorarios / 100));

  if (percentualComissaoIdp === null) {
    return { valorHonorarios, valorComissaoIdp: null, valorEspecialista: null };
  }

  const valorComissaoIdp = round2(valorHonorarios * (percentualComissaoIdp / 100));
  const valorEspecialista = round2(valorHonorarios - valorComissaoIdp);

  return { valorHonorarios, valorComissaoIdp, valorEspecialista };
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

// FEATURE 019/020 — resumo agregado usado tanto pelos Cards do Dashboard
// quanto pelos Indicadores Financeiros. Centralizado aqui pra não duplicar
// a mesma soma/média em dois componentes.
export interface ResumoFinanceiro {
  honorariosPrevistos: number;
  honorariosRecebidos: number;
  comissaoIdpPrevista: number;
  comissaoIdpRecebida: number;
  valoresPendentes: number;
  quantidadeContratos: number;
  ticketMedio: number;
  honorariosMedio: number;
  comissaoMedia: number;
  receitaPrevista: number;
  receitaRecebida: number;
}

export function calcularResumoFinanceiro(registros: LeadFinanceiro[]): ResumoFinanceiro {
  // Cancelado não entra em nenhuma soma prevista/recebida/pendente — não é
  // dinheiro ativo do negócio.
  const ativos = registros.filter((r) => r.status_financeiro !== "CANCELADO");
  const recebidos = ativos.filter((r) => r.status_financeiro === "RECEBIDO");

  const sum = (arr: LeadFinanceiro[], key: keyof LeadFinanceiro) =>
    arr.reduce((acc, r) => acc + (typeof r[key] === "number" ? (r[key] as number) : 0), 0);

  const honorariosPrevistos = sum(ativos, "valor_honorarios");
  const honorariosRecebidos = sum(recebidos, "valor_honorarios");
  const comissaoIdpPrevista = sum(ativos, "valor_comissao_idp");
  const comissaoIdpRecebida = sum(recebidos, "valor_comissao_idp");
  const quantidadeContratos = ativos.length;

  const media = (total: number) => (quantidadeContratos > 0 ? round2(total / quantidadeContratos) : 0);

  return {
    honorariosPrevistos: round2(honorariosPrevistos),
    honorariosRecebidos: round2(honorariosRecebidos),
    comissaoIdpPrevista: round2(comissaoIdpPrevista),
    comissaoIdpRecebida: round2(comissaoIdpRecebida),
    valoresPendentes: round2(honorariosPrevistos - honorariosRecebidos),
    quantidadeContratos,
    ticketMedio: media(sum(ativos, "valor_recuperacao_estimado")),
    honorariosMedio: media(honorariosPrevistos),
    comissaoMedia: media(comissaoIdpPrevista),
    // "Receita" aqui é a receita da IDP Brasil (a comissão) — não o valor
    // total do contrato do cliente.
    receitaPrevista: round2(comissaoIdpPrevista),
    receitaRecebida: round2(comissaoIdpRecebida),
  };
}
