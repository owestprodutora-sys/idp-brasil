import { useState, type ReactNode } from "react";
import { MessageCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { documentLabel, yesNoLabel } from "@/lib/answer-labels";
import {
  MOTIVO_ENCERRAMENTO_OPTIONS,
  PRIORITY_OPTIONS,
  PROXIMA_ACAO_SUGESTOES,
  STATUS_OPTIONS,
} from "@/lib/crm-config";
import { formatDateTime, toDateInputValue } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Lead } from "@/types/lead";

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdated: (lead: Lead) => void;
}

export function LeadDetailModal({ lead, onClose, onUpdated }: LeadDetailModalProps) {
  const [status, setStatus] = useState(lead.status);
  const [prioridade, setPrioridade] = useState(lead.prioridade ?? "normal");
  const [observacoes, setObservacoes] = useState(lead.observacoes ?? "");
  const [ultimoContato, setUltimoContato] = useState(toDateInputValue(lead.ultimo_contato));
  const [proximaAcao, setProximaAcao] = useState(lead.proxima_acao ?? "");
  const [dataProximoContato, setDataProximoContato] = useState(
    toDateInputValue(lead.data_proximo_contato),
  );
  const [motivoEncerramento, setMotivoEncerramento] = useState(lead.motivo_encerramento ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedJustNow, setSavedJustNow] = useState(false);

  const whatsappLink = buildWhatsAppLink(
    lead.whatsapp,
    `Olá, ${lead.nome}! Aqui é a equipe da IDP Brasil, sobre a sua pré-análise de isenção do Imposto de Renda.`,
  );

  const hasChanges =
    status !== lead.status ||
    prioridade !== (lead.prioridade ?? "normal") ||
    observacoes !== (lead.observacoes ?? "") ||
    ultimoContato !== toDateInputValue(lead.ultimo_contato) ||
    proximaAcao !== (lead.proxima_acao ?? "") ||
    dataProximoContato !== toDateInputValue(lead.data_proximo_contato) ||
    motivoEncerramento !== (lead.motivo_encerramento ?? "");

  async function handleSave() {
    setIsSaving(true);
    setErrorMessage(null);
    setSavedJustNow(false);

    const updates = {
      status,
      prioridade,
      observacoes: observacoes.trim() === "" ? null : observacoes.trim(),
      ultimo_contato: ultimoContato === "" ? null : ultimoContato,
      proxima_acao: proximaAcao.trim() === "" ? null : proximaAcao.trim(),
      data_proximo_contato: dataProximoContato === "" ? null : dataProximoContato,
      motivo_encerramento: motivoEncerramento === "" ? null : motivoEncerramento,
    };

    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", lead.id)
      .select()
      .single();

    setIsSaving(false);

    if (error) {
      console.error("[Supabase] Erro ao atualizar lead:", error);
      setErrorMessage("Não foi possível salvar as alterações. Tente novamente.");
      return;
    }

    onUpdated(data as Lead);
    setSavedJustNow(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-selo-900/40 p-0 sm:items-center sm:p-6">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-selo-900">{lead.nome}</h2>
            <p className="mt-0.5 text-xs text-ink/45">
              Registrado em {formatDateTime(lead.created_at)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/50 hover:bg-selo-50 hover:text-selo-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <Info label="Telefone" value={lead.whatsapp} />
          <Info label="Cidade" value={`${lead.cidade} / ${lead.estado}`} />
        </dl>

        <div className="mt-6 space-y-4 border-t border-selo-700/10 pt-6 text-sm">
          <Info label="Aposentado" value={yesNoLabel(lead.aposentado)} />
          <Info label="Há desconto de Imposto de Renda" value={yesNoLabel(lead.tributavel)} />
          <Info label="Doença informada" value={`🩺 ${lead.qual_doenca ?? "—"}`} />
          <Info label="Documentação médica" value={documentLabel(lead.laudo)} />
        </div>

        <div className="mt-6 space-y-4 border-t border-selo-700/10 pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            Atendimento
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Prioridade">
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.emoji ? `${option.emoji} ${option.label}` : option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Último contato">
              <input
                type="date"
                value={ultimoContato}
                onChange={(e) => setUltimoContato(e.target.value)}
                className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
              />
            </Field>

            <Field label="Próximo contato">
              <input
                type="date"
                value={dataProximoContato}
                onChange={(e) => setDataProximoContato(e.target.value)}
                className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
              />
            </Field>
          </div>

          <Field label="Próxima ação">
            <input
              type="text"
              list="proxima-acao-sugestoes"
              value={proximaAcao}
              onChange={(e) => setProximaAcao(e.target.value)}
              placeholder="Ex: Solicitar documento"
              className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
            />
            <datalist id="proxima-acao-sugestoes">
              {PROXIMA_ACAO_SUGESTOES.map((sugestao) => (
                <option key={sugestao} value={sugestao} />
              ))}
            </datalist>
          </Field>

          <Field label="Observações internas">
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: cliente prefere contato após 18h."
              rows={3}
              className="w-full resize-none rounded-lg border border-selo-700/20 bg-white px-3 py-2 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
            />
          </Field>

          <Field label="Motivo de encerramento">
            <select
              value={motivoEncerramento}
              onChange={(e) => setMotivoEncerramento(e.target.value)}
              className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
            >
              <option value="">—</option>
              {MOTIVO_ENCERRAMENTO_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
        {savedJustNow && !hasChanges && (
          <p className="mt-4 text-sm text-selo-700">Alterações salvas.</p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="h-11 flex-1 bg-selo-700 text-paper hover:bg-selo-600"
          >
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-11 flex-1 border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Abrir WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink/45">{label}</dt>
      <dd className="mt-0.5 font-medium text-selo-900">{value}</dd>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45">{label}</span>
      {children}
    </label>
  );
}
