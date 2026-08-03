export interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  cidade: string;
  estado: string;
  aposentado: string | null;
  tributavel: string | null;
  doenca: string | null;
  qual_doenca: string | null;
  laudo: string | null;
  lgpd_aceito: boolean;
  status: string;
  // Campos de CRM operacional (TASK-007)
  prioridade: string | null;
  // Preparação para múltiplos profissionais (TASK-007B) — hoje sempre nulo,
  // já que só existe a Adrieli. Ver lib/crm-config.ts#responsavelLabel.
  profissional_id: string | null;
  observacoes: string | null;
  ultimo_contato: string | null;
  proxima_acao: string | null;
  data_proximo_contato: string | null;
  motivo_encerramento: string | null;
  created_at: string;
}
