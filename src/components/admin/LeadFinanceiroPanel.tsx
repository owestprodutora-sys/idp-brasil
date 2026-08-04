import { useEffect, useState } from "react";

import {
  FORMA_PAGAMENTO_OPTIONS,
  STATUS_FINANCEIRO_OPTIONS,
  calcularFinanceiro,
  formatCurrency,
} from "@/lib/financeiro";
import { toDateInputValue } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import type { LeadFinanceiro, StatusFinanceiro } from "@/types/lead-financeiro";

interface LeadFinanceiroPanelProps {
  leadId: string;
  onSaved?: (registro: LeadFinanceiro) => void;
}

// FEATURE 018 — Centro Financeiro do Lead. Relação 1:1 com o lead (ver
// unique(lead_id) em sql/013): se ainda não existe registro, mostramos o
// formulário vazio e criamos no primeiro "Salvar" (upsert por lead_id).
export function LeadFinanceiroPanel({ leadId, onSaved }: LeadFinanceiroPanelProps) {
  const [registro, setRegistro] = useState<LeadFinanceiro | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [valorRecuperacao, setValorRecuperacao] = useState("");
  const [percentualHonorarios, setPercentualHonorarios] = useState("");
  const [percentualComissaoIdp, setPercentualComissaoIdp] = useState("");
  const [statusFinanceiro, setStatusFinanceiro] = useState<StatusFinanceiro>("PENDENTE");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [dataPrevista, setDataPrevista] = useState("");
  const [dataRecebimento, setDataRecebimento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedJustNow, setSavedJustNow] = useState(false);

  function aplicarRegistro(r: LeadFinanceiro | null) {
    setRegistro(r);
    setValorRecuperacao(r?.valor_recuperacao_estimado?.toString() ?? "");
    setPercentualHonorarios(r?.percentual_honorarios?.toString() ?? "");
    setPercentualComissaoIdp(r?.percentual_comissao_idp?.toString() ?? "");
    setStatusFinanceiro(r?.status_financeiro ?? "PENDENTE");
    setFormaPagamento(r?.forma_pagamento ?? "");
    setDataPrevista(toDateInputValue(r?.data_prevista_pagamento));
    setDataRecebimento(toDateInputValue(r?.data_recebimento));
    setObservacoes(r?.observacoes ?? "");
  }

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
        console.error("[Supabase] Erro ao carregar financeiro do lead:", error);
      } else {
        aplicarRegistro((data as LeadFinanceiro | null) ?? null);
      }
      setIsLoading(false);
    }

    carregar();
    return () => {
      isActive = false;
    };
  }, [leadId]);

  const parsedValorRecuperacao = valorRecuperacao === "" ? null : Number(valorRecuperacao);
  const parsedPercentualHonorarios =
    percentualHonorarios === "" ? null : Number(percentualHonorarios);
  const parsedPercentualComissaoIdp =
    percentualComissaoIdp === "" ? null : Number(percentualComissaoIdp);

  // Sempre recalculado — nunca guardamos o valor digitado direto pros
  // campos derivados (evita divergência entre o exibido e o salvo).
  const calculo = calcularFinanceiro(
    parsedValorRecuperacao,
    parsedPercentualHonorarios,
    parsedPercentualComissaoIdp,
  );

  async function handleSave() {
    setIsSaving(true);
    setErrorMessage(null);
    setSavedJustNow(false);

    const payload = {
      lead_id: leadId,
      valor_recuperacao_estimado: parsedValorRecuperacao,
      percentual_honorarios: parsedPercentualHonorarios,
      valor_honorarios: calculo.valorHonorarios,
      percentual_comissao_idp: parsedPercentualComissaoIdp,
      valor_comissao_idp: calculo.valorComissaoIdp,
      valor_especialista: calculo.valorEspecialista,
      status_financeiro: statusFinanceiro,
      forma_pagamento: formaPagamento === "" ? null : formaPagamento,
      data_prevista_pagamento: dataPrevista === "" ? null : dataPrevista,
      data_recebimento: dataRecebimento === "" ? null : dataRecebimento,
      observacoes: observacoes.trim() === "" ? null : observacoes.trim(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("lead_financeiro")
      .upsert(payload, { onConflict: "lead_id" })
      .select()
      .single();

    setIsSaving(false);

    if (error) {
      console.error("[Supabase] Erro ao salvar financeiro:", error);
      setErrorMessage("Não foi possível salvar os dados financeiros. Tente novamente.");
      return;
    }

    aplicarRegistro(data as LeadFinanceiro);
    setSavedJustNow(true);
    onSaved?.(data as LeadFinanceiro);
  }

  const hasChanges =
    !registro ||
    (registro.valor_recuperacao_estimado ?? null) !== parsedValorRecuperacao ||
    (registro.percentual_honorarios ?? null) !== parsedPercentualHonorarios ||
    (registro.percentual_comissao_idp ?? null) !== parsedPercentualComissaoIdp ||
    registro.status_financeiro !== statusFinanceiro ||
    (registro.forma_pagamento ?? "") !== formaPagamento ||
    toDateInputValue(registro.data_prevista_pagamento) !== dataPrevista ||
    toDateInputValue(registro.data_recebimento) !== dataRecebimento ||
    (registro.observacoes ?? "") !== observacoes;

  if (isLoading) {
    return <p className="text-sm text-ink/45">Carregando dados financeiros...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45">
            Valor recuperado estimado
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={valorRecuperacao}
            onChange={(e) => setValorRecuperacao(e.target.value)}
            placeholder="0,00"
            className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45">
            % Honorários
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={percentualHonorarios}
            onChange={(e) => setPercentualHonorarios(e.target.value)}
            placeholder="0"
            className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45">
            % Comissão IDP
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={percentualComissaoIdp}
            onChange={(e) => setPercentualComissaoIdp(e.target.value)}
            placeholder="0"
            className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45">Status</span>
          <select
            value={statusFinanceiro}
            onChange={(e) => setStatusFinanceiro(e.target.value as StatusFinanceiro)}
            className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
          >
            {STATUS_FINANCEIRO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45">
            Forma de pagamento
          </span>
          <select
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
          >
            <option value="">—</option>
            {FORMA_PAGAMENTO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45">
            Data prevista
          </span>
          <input
            type="date"
            value={dataPrevista}
            onChange={(e) => setDataPrevista(e.target.value)}
            className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45">
            Data do recebimento
          </span>
          <input
            type="date"
            value={dataRecebimento}
            onChange={(e) => setDataRecebimento(e.target.value)}
            className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
          />
        </label>
      </div>

      {/* Campos derivados — sempre recalculados, nunca editáveis diretamente
          (FEATURE 018, REGRAS). */}
      <dl className="grid grid-cols-3 gap-4 rounded-lg border border-selo-700/10 bg-selo-50/40 px-3 py-3 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">Honorários</dt>
          <dd className="mt-0.5 font-medium text-selo-900">
            {formatCurrency(calculo.valorHonorarios)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">Comissão IDP</dt>
          <dd className="mt-0.5 font-medium text-selo-900">
            {formatCurrency(calculo.valorComissaoIdp)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/45">Especialista</dt>
          <dd className="mt-0.5 font-medium text-selo-900">
            {formatCurrency(calculo.valorEspecialista)}
          </dd>
        </div>
      </dl>

      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45">
          Observações
        </span>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={2}
          placeholder="Ex: pagamento combinado em duas etapas."
          className="w-full resize-none rounded-lg border border-selo-700/20 bg-white px-3 py-2 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
        />
      </label>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      {savedJustNow && !hasChanges && (
        <p className="text-sm text-selo-700">Dados financeiros salvos.</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving || !hasChanges}
        className="h-10 rounded-lg bg-selo-700 px-4 text-sm font-medium text-paper hover:bg-selo-600 disabled:opacity-50"
      >
        {isSaving ? "Salvando..." : "Salvar financeiro"}
      </button>
    </div>
  );
}
