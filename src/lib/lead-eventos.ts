// FASE 4A — FEATURE 009. Insert puro em `lead_eventos`. Quem decide SE um
// evento deve ser gravado (comparando valor antigo x novo, pra nunca gerar
// evento duplicado) é quem chama esta função — ver handleSave em
// LeadDetailModal.tsx.

import { supabase } from "@/lib/supabase";
import type { LeadEventoTipo } from "@/lib/lead-evento-config";

// Mesmo padrão pragmático já usado em documento-checklist.ts (UsuarioAcao):
// guarda o nome de quem disparou a ação no momento do insert.
export interface UsuarioAcao {
  id: string | null;
  nome: string;
}

export async function registrarLeadEvento(
  leadId: string,
  tipo: LeadEventoTipo,
  descricao: string | null,
  usuario: UsuarioAcao,
): Promise<void> {
  const { error } = await supabase.from("lead_eventos").insert({
    lead_id: leadId,
    tipo,
    descricao,
    usuario_id: usuario.id,
    usuario_nome: usuario.nome,
  });

  if (error) {
    // Não bloqueia o fluxo de salvar o lead por causa disso — só avisa no
    // console, mesmo critério já usado no registro de documento_historico.
    console.error("[Supabase] Erro ao registrar evento do lead:", error);
  }
}
