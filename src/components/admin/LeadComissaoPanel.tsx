import { useEffect, useState } from "react";

import {
  IDP_PIX_KEY,
  isPixKeyConfigured,
  resolveStatusComissao,
} from "@/lib/comissao";
import { formatCurrency } from "@/lib/financeiro";
import { formatDate } from "@/lib/format";
import { registrarLeadEvento, type UsuarioAcao } from "@/lib/lead-eventos";
import { supabase } from "@/lib/supabase";
import type { LeadFinanceiro, StatusComissao } from "@/types/lead-financeiro";

interface LeadComissaoPanelProps {
  leadId: string;
  role: "gestor" | "especialista" | undefined;
  usuario: UsuarioAcao;
  // Sincroniza com o que acabou de ser salvo em LeadFinanceiroPanel (mesmo
  // leadId), pra refletir na hora um valor_comissao_idp recém-calculado
  // sem esperar o modal reabrir. Ver LeadDetailModal.
  registroSincronizado: LeadFinanceiro | null;
}

// FASE 5A.1 — FEATURE 023/024/025. Bloco único porque as três features
// descrevem o mesmo dado (o repasse de comissão de um lead) sob três
// ângulos — separar em componentes diferentes duplicaria o carregamento e
// o cálculo do mesmo registro. Quem decide o que aparece é o `role`:
//   especialista -> vê valor + chave Pix + "marcar pagamento realizado"
//   gestor       -> vê valor + "confirmar pagamento" / "voltar para pendente"
export function LeadComissaoPanel({
  leadId,
  role,
  usuario,
  registroSincronizado,
}: LeadComissaoPanelProps) {
  const [registro, setRegistro] = useState<LeadFinanceiro | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [observacoes, setObservacoes] = useState("");
  const [isSavingObs, setIsSavingObs] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function carregar() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("lead_financeiro")
        .select("*")
        .eq("lead_id", leadId)
        .maybeSingle();

      if (!isActive) return;

      if (error) {
        console.error("[Supabase] Erro ao carregar comissão do lead:", error);
      } else {
        const r = (data as LeadFinanceiro | null) ?? null;
        setRegistro(r);
        setObservacoes(r?.observacoes_comissao ?? "");
      }
      setIsLoading(false);
    }

    carregar();
    return () => {
      isActive = false;
    };
  }, [leadId]);

  // Sincroniza com o LeadFinanceiroPanel quando ele salva na mesma sessão
  // (mesmo registro, mesmo leadId) — evita mostrar um valor_comissao_idp
  // desatualizado até o modal reabrir.
  useEffect(() => {
    if (registroSincronizado && registroSincronizado.lead_id === leadId) {
      setRegistro(registroSincronizado);
      setObservacoes(registroSincronizado.observacoes_comissao ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registroSincronizado]);

  async function persistir(
    campos: Partial<
      Pick<
        LeadFinanceiro,
        | "status_comissao"
        | "data_informado_pagamento_comissao"
        | "data_confirmacao_comissao"
        | "observacoes_comissao"
      >
    >,
    eventoTipo: Parameters<typeof registrarLeadEvento>[1],
    eventoDescricao: string | null,
  ) {
    if (!registro) return;
    setIsActing(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("lead_financeiro")
      .update(campos)
      .eq("lead_id", leadId)
      .select()
      .single();

    setIsActing(false);

    if (error) {
      console.error("[Supabase] Erro ao atualizar comissão:", error);
      setErrorMessage("Não foi possível salvar a comissão agora. Tente novamente.");
      return;
    }

    setRegistro(data as LeadFinanceiro);
    await registrarLeadEvento(leadId, eventoTipo, eventoDescricao, usuario);
  }

  async function marcarPagamentoRealizado() {
    await persistir(
      {
        status_comissao: "AGUARDANDO_CONFERENCIA",
        data_informado_pagamento_comissao: new Date().toISOString().slice(0, 10),
      },
      "COMISSAO_PAGAMENTO_INFORMADO",
      "Especialista informou o pagamento da comissão via Pix.",
    );
  }

  async function confirmarPagamento() {
    await persistir(
      {
        status_comissao: "PAGO",
        data_confirmacao_comissao: new Date().toISOString().slice(0, 10),
      },
      "COMISSAO_CONFIRMADA",
      "Gestor confirmou o recebimento da comissão.",
    );
  }

  async function voltarParaPendente() {
    await persistir(
      {
        status_comissao: "PENDENTE",
        data_informado_pagamento_comissao: null,
        data_confirmacao_comissao: null,
      },
      "COMISSAO_REVERTIDA",
      "Gestor reverteu o status da comissão para pendente.",
    );
  }

  async function marcarIsento() {
    await persistir({ status_comissao: "ISENTO" }, "COMISSAO_ISENTA", null);
  }

  async function salvarObservacoes() {
    if (!registro) return;
    setIsSavingObs(true);
    setErrorMessage(null);

    const valor = observacoes.trim() === "" ? null : observacoes.trim();
    const { data, error } = await supabase
      .from("lead_financeiro")
      .update({ observacoes_comissao: valor })
      .eq("lead_id", leadId)
      .select()
      .single();

    setIsSavingObs(false);

    if (error) {
      console.error("[Supabase] Erro ao salvar observação da comissão:", error);
      setErrorMessage("Não foi possível salvar a observação agora.");
      return;
    }

    setRegistro(data as LeadFinanceiro);
  }

  async function copiarChavePix() {
    try {
      await navigator.clipboard.writeText(IDP_PIX_KEY);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (clipboardError) {
      console.error("[Clipboard] Erro ao copiar chave Pix:", clipboardError);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-ink/45">Carregando comissão...</p>;
  }

  if (!registro) {
    return (
      <p className="text-sm text-ink/45">
        Cadastre os dados financeiros acima primeiro para calcular a comissão.
      </p>
    );
  }

  const status: StatusComissao = registro.status_comissao;
  const statusOption = resolveStatusComissao(status);
  const observacoesChanged = observacoes !== (registro.observacoes_comissao ?? "");

  return (
    <div className="space-y-3 rounded-lg border border-selo-700/10 bg-selo-50/40 px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/45">Comissão IDP</p>
          <p className="font-display text-lg font-semibold text-selo-900">
            {formatCurrency(registro.valor_comissao_idp)}
          </p>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusOption.badgeClass}`}
        >
          {statusOption.emoji} {statusOption.label}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-xs text-ink/60">
        <div>
          <dt className="text-ink/45">Pagamento informado em</dt>
          <dd>{formatDate(registro.data_informado_pagamento_comissao)}</dd>
        </div>
        <div>
          <dt className="text-ink/45">Confirmado em</dt>
          <dd>{formatDate(registro.data_confirmacao_comissao)}</dd>
        </div>
      </dl>

      {/* FEATURE 024 — ação da especialista. Só faz sentido oferecer o
          botão quando ainda não foi informado (senão duplicaria o aviso ao
          gestor). */}
      {role === "especialista" && status === "PENDENTE" && (
        <div className="space-y-2 border-t border-selo-700/10 pt-3">
          {isPixKeyConfigured ? (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-ink/60">Chave Pix da IDP:</span>
              <code className="rounded bg-white px-2 py-1 text-xs text-selo-900">
                {IDP_PIX_KEY}
              </code>
              <button
                type="button"
                onClick={copiarChavePix}
                className="text-xs font-medium text-selo-700 underline-offset-2 hover:underline"
              >
                {copyFeedback ? "Copiado!" : "Copiar"}
              </button>
            </div>
          ) : (
            <p className="text-xs text-ink/45">
              Chave Pix da IDP ainda não configurada neste ambiente (VITE_IDP_PIX_KEY).
            </p>
          )}
          <button
            type="button"
            disabled={isActing}
            onClick={marcarPagamentoRealizado}
            className="h-9 rounded-lg bg-selo-700 px-4 text-sm font-medium text-paper hover:bg-selo-600 disabled:opacity-50"
          >
            {isActing ? "Salvando..." : "Marcar pagamento realizado"}
          </button>
        </div>
      )}

      {/* FEATURE 025 — ação do gestor. */}
      {role === "gestor" && status === "AGUARDANDO_CONFERENCIA" && (
        <div className="flex flex-wrap gap-3 border-t border-selo-700/10 pt-3">
          <button
            type="button"
            disabled={isActing}
            onClick={confirmarPagamento}
            className="h-9 rounded-lg bg-selo-700 px-4 text-sm font-medium text-paper hover:bg-selo-600 disabled:opacity-50"
          >
            {isActing ? "Salvando..." : "Confirmar pagamento"}
          </button>
          <button
            type="button"
            disabled={isActing}
            onClick={voltarParaPendente}
            className="h-9 rounded-lg border border-selo-700/30 px-4 text-sm text-selo-700 hover:bg-selo-700/5 disabled:opacity-50"
          >
            Voltar para pendente
          </button>
        </div>
      )}

      {role === "gestor" && status === "PAGO" && (
        <div className="border-t border-selo-700/10 pt-3">
          <button
            type="button"
            disabled={isActing}
            onClick={voltarParaPendente}
            className="h-9 rounded-lg border border-selo-700/30 px-4 text-sm text-selo-700 hover:bg-selo-700/5 disabled:opacity-50"
          >
            Voltar para pendente
          </button>
        </div>
      )}

      {role === "gestor" && status === "PENDENTE" && (
        <div className="border-t border-selo-700/10 pt-3">
          <button
            type="button"
            disabled={isActing}
            onClick={marcarIsento}
            className="text-xs text-ink/45 hover:text-selo-700 hover:underline disabled:opacity-50"
          >
            Marcar comissão como isenta
          </button>
        </div>
      )}

      {role === "gestor" && status === "ISENTO" && (
        <div className="border-t border-selo-700/10 pt-3">
          <button
            type="button"
            disabled={isActing}
            onClick={voltarParaPendente}
            className="text-xs text-ink/45 hover:text-selo-700 hover:underline disabled:opacity-50"
          >
            Reverter isenção
          </button>
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45">
          Observações da comissão
        </span>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={2}
          placeholder="Ex: pagamento combinado direto com o gestor."
          className="w-full resize-none rounded-lg border border-selo-700/20 bg-white px-3 py-2 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
        />
        {observacoesChanged && (
          <button
            type="button"
            disabled={isSavingObs}
            onClick={salvarObservacoes}
            className="mt-2 h-8 rounded-lg border border-selo-700/30 px-3 text-xs text-selo-700 hover:bg-selo-700/5 disabled:opacity-50"
          >
            {isSavingObs ? "Salvando..." : "Salvar observação"}
          </button>
        )}
      </label>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}
