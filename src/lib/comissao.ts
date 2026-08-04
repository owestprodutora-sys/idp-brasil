// FASE 5A.1 — Centro de Comissões (MVP). Fonte única de verdade pro status
// do repasse manual (especialista -> IDP Brasil, via Pix) e pelos
// indicadores agregados usados no painel da Especialista e no Dashboard de
// Comissões do Gestor. Mesmo padrão de financeiro.ts: nunca calcular ou
// resumir direto no componente.
//
// IMPORTANTE — não há gateway/API Pix/split aqui (ver PROMPT — FASE 5A.1).
// `valor_comissao_idp` já é calculado e persistido pela FASE 5A
// (lib/financeiro.ts#calcularFinanceiro); este arquivo nunca recalcula
// esse valor, só agrega o que já existe em lead_financeiro.

import { calcularResumoFinanceiro } from "@/lib/financeiro";
import type { LeadFinanceiro, StatusComissao } from "@/types/lead-financeiro";

export interface StatusComissaoOption {
  value: StatusComissao;
  emoji: string;
  label: string;
  badgeClass: string;
}

export const STATUS_COMISSAO_OPTIONS: StatusComissaoOption[] = [
  {
    value: "PENDENTE",
    emoji: "🔴",
    label: "Pendente",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  {
    value: "AGUARDANDO_CONFERENCIA",
    emoji: "🟡",
    label: "Aguardando conferência",
    badgeClass: "bg-ouro-50 text-ouro-600 border-ouro-500/40",
  },
  {
    value: "PAGO",
    emoji: "🟢",
    label: "Pago",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
  },
  {
    value: "ISENTO",
    emoji: "🟣",
    label: "Isento",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

const STATUS_COMISSAO_MAP = new Map(STATUS_COMISSAO_OPTIONS.map((o) => [o.value, o]));

export function resolveStatusComissao(status: string): StatusComissaoOption {
  return (
    STATUS_COMISSAO_MAP.get(status as StatusComissao) ?? {
      value: status as StatusComissao,
      emoji: "•",
      label: status,
      badgeClass: "bg-ink/5 text-ink/60 border-ink/10",
    }
  );
}

// Mesmo critério de ordenação de financeiro.ts#statusFinanceiroOrdem:
// pendente primeiro (precisa de ação), depois aguardando conferência
// (precisa do gestor), pago por último — isento fica no fim (não é fluxo
// ativo).
const STATUS_COMISSAO_ORDEM: Record<StatusComissao, number> = {
  PENDENTE: 0,
  AGUARDANDO_CONFERENCIA: 1,
  PAGO: 2,
  ISENTO: 3,
};

export function statusComissaoOrdem(status: string): number {
  return STATUS_COMISSAO_ORDEM[status as StatusComissao] ?? 99;
}

// FEATURE 024 — chave Pix da IDP Brasil (destino do repasse). Configurável
// por ambiente, mesmo padrão de lib/supabase.ts (VITE_*). Não há campo no
// banco pra isso: é um dado fixo da operação, não por lead/especialista.
export const IDP_PIX_KEY: string = import.meta.env.VITE_IDP_PIX_KEY ?? "";
export const isPixKeyConfigured = IDP_PIX_KEY.trim().length > 0;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// FEATURE 022/026/028 — resumo agregado de comissões, usado pelo painel da
// Especialista e pelo Dashboard de Comissões do Gestor. Reaproveita
// calcularResumoFinanceiro (honorários e comissão prevista/recebida do
// cliente) em vez de resomar os mesmos campos aqui.
export interface ResumoComissoes {
  quantidadePendente: number;
  quantidadeAguardandoConferencia: number;
  quantidadePaga: number;
  quantidadeIsenta: number;
  comissaoPrevista: number;
  comissaoPendente: number; // PENDENTE + AGUARDANDO_CONFERENCIA (ainda não repassado)
  comissaoAguardandoConferencia: number;
  comissaoPaga: number;
  saldoLiquidoPrevisto: number; // honorários previstos - comissão prevista
  saldoLiquidoRecebido: number; // honorários recebidos - comissão paga
  ultimoPagamento: string | null; // data mais recente de confirmação/informe
}

export function calcularResumoComissoes(registros: LeadFinanceiro[]): ResumoComissoes {
  // Cancelado não é dinheiro ativo do negócio (mesmo critério de
  // calcularResumoFinanceiro) — também não faz sentido cobrar comissão
  // sobre um contrato cancelado.
  const ativos = registros.filter((r) => r.status_financeiro !== "CANCELADO");

  const resumoFinanceiro = calcularResumoFinanceiro(registros);

  const porStatus = (status: StatusComissao) => ativos.filter((r) => r.status_comissao === status);

  const somaComissao = (arr: LeadFinanceiro[]) =>
    round2(arr.reduce((acc, r) => acc + (r.valor_comissao_idp ?? 0), 0));

  const pendentes = porStatus("PENDENTE");
  const aguardando = porStatus("AGUARDANDO_CONFERENCIA");
  const pagas = porStatus("PAGO");
  const isentas = porStatus("ISENTO");

  const comissaoPaga = somaComissao(pagas);

  const datas = ativos
    .map((r) => r.data_confirmacao_comissao ?? r.data_informado_pagamento_comissao)
    .filter((d): d is string => Boolean(d))
    .sort();
  const ultimoPagamento = datas.length > 0 ? datas[datas.length - 1] : null;

  return {
    quantidadePendente: pendentes.length,
    quantidadeAguardandoConferencia: aguardando.length,
    quantidadePaga: pagas.length,
    quantidadeIsenta: isentas.length,
    comissaoPrevista: resumoFinanceiro.comissaoIdpPrevista,
    comissaoPendente: somaComissao(pendentes),
    comissaoAguardandoConferencia: somaComissao(aguardando),
    comissaoPaga,
    saldoLiquidoPrevisto: round2(
      resumoFinanceiro.honorariosPrevistos - resumoFinanceiro.comissaoIdpPrevista,
    ),
    saldoLiquidoRecebido: round2(resumoFinanceiro.honorariosRecebidos - comissaoPaga),
    ultimoPagamento,
  };
}
