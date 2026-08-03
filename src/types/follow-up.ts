// MVP 1.1 — Fase 2 (FEATURE 002). Um registro de follow-up confirmado
// manualmente pela especialista — nunca gerado por envio automático.
export interface FollowUpLog {
  id: string;
  lead_id: string;
  mensagem: string;
  enviado_em: string;
  usuario_id: string | null;
  usuario_nome: string | null;
}
