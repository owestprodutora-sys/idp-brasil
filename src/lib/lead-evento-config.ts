// FASE 4A — Fonte única de verdade dos tipos de evento de `lead_eventos`
// (mesmo padrão já usado em crm-config.ts e documento-config.ts).
//
// Só os tipos gravados nesta fase têm option aqui. Novos tipos (ver lista
// futura no comentário de sql/012_lead_eventos.sql) podem ser gravados no
// banco sem quebrar nada — resolveLeadEventoTipo() cai num fallback
// genérico enquanto a option correspondente não for adicionada.

export type LeadEventoTipo =
  | "LEAD_CRIADO"
  | "STATUS_ALTERADO"
  | "PRIORIDADE_ALTERADA"
  | "SERVICO_ALTERADO"
  | "OBSERVACAO_ADICIONADA"
  | "CASO_FINALIZADO"
  // FASE 5A.1 — Centro de Comissões (FEATURE 027). Reutiliza lead_eventos;
  // nenhuma tabela de histórico nova.
  | "COMISSAO_PAGAMENTO_INFORMADO"
  | "COMISSAO_CONFIRMADA"
  | "COMISSAO_REVERTIDA"
  | "COMISSAO_ISENTA";

export interface LeadEventoTipoOption {
  value: LeadEventoTipo;
  icone: string;
  label: string;
}

export const LEAD_EVENTO_TIPO_OPTIONS: LeadEventoTipoOption[] = [
  { value: "LEAD_CRIADO", icone: "🆕", label: "Lead criado" },
  { value: "STATUS_ALTERADO", icone: "🔄", label: "Status alterado" },
  { value: "PRIORIDADE_ALTERADA", icone: "⭐", label: "Prioridade alterada" },
  { value: "SERVICO_ALTERADO", icone: "🧾", label: "Serviço alterado" },
  { value: "OBSERVACAO_ADICIONADA", icone: "📝", label: "Observação adicionada" },
  { value: "CASO_FINALIZADO", icone: "⚫", label: "Caso finalizado" },
  {
    value: "COMISSAO_PAGAMENTO_INFORMADO",
    icone: "💸",
    label: "Pagamento da comissão informado",
  },
  { value: "COMISSAO_CONFIRMADA", icone: "✅", label: "Pagamento da comissão confirmado" },
  { value: "COMISSAO_REVERTIDA", icone: "↩️", label: "Comissão revertida para pendente" },
  { value: "COMISSAO_ISENTA", icone: "🟣", label: "Comissão marcada como isenta" },
];

const LEAD_EVENTO_TIPO_MAP = new Map(LEAD_EVENTO_TIPO_OPTIONS.map((o) => [o.value, o]));

export function resolveLeadEventoTipo(tipo: string): LeadEventoTipoOption {
  return (
    LEAD_EVENTO_TIPO_MAP.get(tipo as LeadEventoTipo) ?? {
      value: tipo as LeadEventoTipo,
      icone: "•",
      label: tipo,
    }
  );
}
