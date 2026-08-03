import { Check, Copy, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { calcularProximoContato, precisaDeAcompanhamento } from "@/lib/crm-config";
import { formatDate } from "@/lib/format";
import { mensagemSugerida } from "@/lib/followup-messages";
import { supabase } from "@/lib/supabase";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Lead } from "@/types/lead";

// MVP 1.1 — Fase 2. FEATURE 002 (motor de follow-up) + FEATURE 003
// (cadência). Fluxo, sempre manual:
//   1. Sistema identifica quem precisa de contato e mostra aqui.
//   2. Especialista copia a mensagem sugerida (ou abre o WhatsApp direto).
//   3. Envia manualmente.
//   4. Clica em "Confirmar envio" — só então o sistema registra o envio e
//      recalcula o próximo contato (ultimo_contato + intervalo padrão).
// Não existe envio automático de mensagem em nenhum passo.
export function FollowUpPanel({
  leads,
  onConfirmado,
}: {
  leads: Lead[];
  onConfirmado: (lead: Lead) => void;
}) {
  const { profile, session } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const pendentes = useMemo(() => {
    return leads
      .filter((lead) => precisaDeAcompanhamento(lead.status, lead.data_proximo_contato))
      .sort((a, b) => {
        // Sem data agendada vem primeiro (nunca teve follow-up definido);
        // o resto, do mais atrasado pro menos atrasado.
        if (!a.data_proximo_contato && !b.data_proximo_contato) return 0;
        if (!a.data_proximo_contato) return -1;
        if (!b.data_proximo_contato) return 1;
        return (
          new Date(a.data_proximo_contato).getTime() -
          new Date(b.data_proximo_contato).getTime()
        );
      });
  }, [leads]);

  async function handleCopiar(lead: Lead, mensagem: string) {
    try {
      await navigator.clipboard.writeText(mensagem);
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId((current) => (current === lead.id ? null : current)), 2000);
    } catch (error) {
      console.error("[Clipboard] Não foi possível copiar a mensagem:", error);
    }
  }

  async function handleConfirmarEnvio(lead: Lead, mensagem: string) {
    setSendingId(lead.id);
    setErrorId(null);

    const hoje = new Date().toISOString().slice(0, 10);
    const proximoContato = calcularProximoContato(hoje);
    const usuarioNome = profile?.nome ?? session?.user.email ?? "Equipe";

    const { error: logError } = await supabase.from("follow_up_logs").insert({
      lead_id: lead.id,
      mensagem,
      usuario_id: session?.user.id ?? null,
      usuario_nome: usuarioNome,
    });

    if (logError) {
      console.error("[Supabase] Erro ao registrar follow-up:", logError);
      setErrorId(lead.id);
      setSendingId(null);
      return;
    }

    const { data, error } = await supabase
      .from("leads")
      .update({ ultimo_contato: hoje, data_proximo_contato: proximoContato })
      .eq("id", lead.id)
      .select()
      .single();

    setSendingId(null);

    if (error) {
      console.error("[Supabase] Erro ao atualizar cadência do lead:", error);
      setErrorId(lead.id);
      return;
    }

    onConfirmado(data as Lead);
  }

  if (pendentes.length === 0) {
    return (
      <div className="rounded-2xl border border-selo-700/10 bg-white px-5 py-5">
        <h2 className="font-display text-base font-semibold text-selo-900">
          Acompanhamento
        </h2>
        <p className="mt-2 text-sm text-ink/50">
          Nenhum cliente precisando de contato agora — cadência em dia.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-selo-700/10 bg-white px-5 py-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-selo-900">
          Acompanhamento
        </h2>
        <span className="text-xs text-ink/45">
          {pendentes.length} cliente{pendentes.length > 1 ? "s" : ""} precisando de contato
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {pendentes.map((lead) => {
          const mensagem = mensagemSugerida(lead);
          const whatsappLink = buildWhatsAppLink(lead.whatsapp, mensagem);
          const vencida = Boolean(lead.data_proximo_contato);

          return (
            <li
              key={lead.id}
              className="rounded-xl border border-ouro-500/30 bg-ouro-50 px-4 py-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-selo-900">{lead.nome}</p>
                  <StatusBadge status={lead.status} />
                </div>
                <p className="text-xs text-ink/50">
                  {vencida
                    ? `Contato previsto para ${formatDate(lead.data_proximo_contato)}`
                    : "Sem contato agendado ainda"}
                </p>
              </div>

              <p className="mt-2 rounded-lg border border-selo-700/10 bg-white px-3 py-2 text-sm text-ink/70">
                {mensagem}
              </p>

              {errorId === lead.id && (
                <p className="mt-2 text-xs text-red-600">
                  Não foi possível confirmar o envio agora. Tente novamente.
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopiar(lead, mensagem)}
                  className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
                >
                  {copiedId === lead.id ? (
                    <>
                      <Check className="mr-1.5 h-4 w-4" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-4 w-4" /> Copiar mensagem
                    </>
                  )}
                </Button>

                <Button asChild variant="outline" size="sm" className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-1.5 h-4 w-4" /> Abrir WhatsApp
                  </a>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={sendingId === lead.id}
                  onClick={() => handleConfirmarEnvio(lead, mensagem)}
                  className="bg-selo-700 text-paper hover:bg-selo-600"
                >
                  {sendingId === lead.id ? "Confirmando..." : "Confirmar envio"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
