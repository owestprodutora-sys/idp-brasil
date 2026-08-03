import { useEffect, useState, type ReactNode } from "react";
import { MessageCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { documentLabel, yesNoLabel } from "@/lib/answer-labels";
import {
  MOTIVO_ENCERRAMENTO_OPTIONS,
  MOTIVO_FINALIZACAO_OPTIONS,
  PRIORITY_OPTIONS,
  PROXIMA_ACAO_SUGESTOES,
  SERVICO_OPTIONS,
  STATUS_OPTIONS,
  origemLabel,
} from "@/lib/crm-config";
import { resolveDocumentoStatus } from "@/lib/documento-config";
import { sincronizarChecklistDocumentos } from "@/lib/documento-checklist";
import { formatDateTime, toDateInputValue } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useAuth } from "@/hooks/useAuth";
import type { Documento, DocumentoHistorico } from "@/types/documento";
import type { Lead } from "@/types/lead";

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdated: (lead: Lead) => void;
}

export function LeadDetailModal({ lead, onClose, onUpdated }: LeadDetailModalProps) {
  const { profile, session } = useAuth();
  const [status, setStatus] = useState(lead.status);
  const [servico, setServico] = useState(lead.servico ?? "");
  const [prioridade, setPrioridade] = useState(lead.prioridade ?? "normal");
  const [observacoes, setObservacoes] = useState(lead.observacoes ?? "");
  const [ultimoContato, setUltimoContato] = useState(toDateInputValue(lead.ultimo_contato));
  const [proximaAcao, setProximaAcao] = useState(lead.proxima_acao ?? "");
  const [dataProximoContato, setDataProximoContato] = useState(
    toDateInputValue(lead.data_proximo_contato),
  );
  const [motivoEncerramento, setMotivoEncerramento] = useState(lead.motivo_encerramento ?? "");
  const [motivoFinalizacao, setMotivoFinalizacao] = useState(lead.motivo_finalizacao ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedJustNow, setSavedJustNow] = useState(false);
  // FEATURE 004 — aviso quando a troca de serviço não pôde substituir o
  // checklist antigo porque já existiam documentos além de PENDENTE.
  const [avisoChecklist, setAvisoChecklist] = useState(false);
  // FEATURE 004 — checklist documental do lead (somente leitura por
  // enquanto; upload/validação entram nas Features 005-007).
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isLoadingDocumentos, setIsLoadingDocumentos] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function carregarDocumentos() {
      setIsLoadingDocumentos(true);
      const { data, error } = await supabase
        .from("documentos")
        .select("*")
        .eq("lead_id", lead.id)
        .order("criado_em", { ascending: true });

      if (!isActive) return;

      if (error) {
        console.error("[Supabase] Erro ao carregar documentos:", error);
      } else {
        setDocumentos((data ?? []) as Documento[]);
      }
      setIsLoadingDocumentos(false);
    }

    carregarDocumentos();
    return () => {
      isActive = false;
    };
  }, [lead.id]);

  // FEATURE 005 — upload manual. id do documento cujo input está com envio
  // em andamento (desabilita só aquele item, não o modal inteiro).
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // FEATURE 006 — preview em painel lateral (PDF/PNG/JPG). Bucket é
  // privado, então cada abertura pede uma signed URL nova.
  const [previewDocumento, setPreviewDocumento] = useState<Documento | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!previewDocumento?.storage_path) {
      setPreviewUrl(null);
      return;
    }

    let isActive = true;
    setPreviewUrl(null);
    setPreviewError(null);

    supabase.storage
      .from("documentos-clientes")
      .createSignedUrl(previewDocumento.storage_path, 300)
      .then(({ data, error }) => {
        if (!isActive) return;
        if (error || !data) {
          console.error("[Storage] Erro ao gerar preview:", error);
          setPreviewError("Não foi possível abrir o preview deste documento.");
          return;
        }
        setPreviewUrl(data.signedUrl);
      });

    return () => {
      isActive = false;
    };
  }, [previewDocumento]);

  async function handleUpload(documento: Documento, file: File) {
    setUploadingId(documento.id);
    setUploadError(null);

    const isSubstituicao = documento.storage_path !== null;
    const path = `${lead.id}/${documento.tipo}-${Date.now()}-${file.name}`;

    const { error: uploadErr } = await supabase.storage
      .from("documentos-clientes")
      .upload(path, file);

    if (uploadErr) {
      console.error("[Storage] Erro ao enviar documento:", uploadErr);
      setUploadError("Não foi possível enviar o arquivo. Tente novamente.");
      setUploadingId(null);
      return;
    }

    const usuarioNome = profile?.nome ?? session?.user.email ?? "Equipe";
    const { data: atualizado, error: updateErr } = await supabase
      .from("documentos")
      .update({
        storage_path: path,
        arquivo_nome_original: file.name,
        mime_type: file.type || null,
        tamanho_bytes: file.size,
        status: "RECEBIDO",
        responsavel_id: session?.user.id ?? null,
        responsavel_nome: usuarioNome,
        atualizado_em: new Date().toISOString(),
      })
      .eq("id", documento.id)
      .select()
      .single();

    if (updateErr) {
      console.error("[Supabase] Erro ao atualizar documento:", updateErr);
      setUploadError("Arquivo enviado, mas não foi possível atualizar o registro.");
      setUploadingId(null);
      return;
    }

    await supabase.from("documento_historico").insert({
      documento_id: documento.id,
      lead_id: lead.id,
      acao: isSubstituicao ? "DOCUMENTO_SUBSTITUIDO" : "DOCUMENTO_ENVIADO",
      usuario_id: session?.user.id ?? null,
      usuario_nome: usuarioNome,
    });

    setDocumentos((current) =>
      current.map((d) => (d.id === documento.id ? (atualizado as Documento) : d)),
    );
    setHistoricoPorDocumento((current) => {
      if (!(documento.id in current)) return current;
      const resto = { ...current };
      delete resto[documento.id];
      return resto;
    });
    setUploadingId(null);
  }

  // FEATURE 007 — os 3 botões rápidos de validação.
  const VALIDACAO_ACOES = {
    VALIDADO: { label: "Documento correto", historico: "DOCUMENTO_VALIDADO" },
    SOLICITAR_NOVO: { label: "Solicitar novo", historico: "NOVA_VERSAO_SOLICITADA" },
    INVALIDO: { label: "Documento inválido", historico: "DOCUMENTO_REJEITADO" },
  } as const;

  const [validandoId, setValidandoId] = useState<string | null>(null);
  const [validandoAcao, setValidandoAcao] = useState<keyof typeof VALIDACAO_ACOES | null>(null);
  const [validandoObs, setValidandoObs] = useState("");
  const [validandoSalvando, setValidandoSalvando] = useState(false);

  function abrirValidacao(documento: Documento, acao: keyof typeof VALIDACAO_ACOES) {
    setValidandoId(documento.id);
    setValidandoAcao(acao);
    setValidandoObs("");
  }

  async function confirmarValidacao(documento: Documento) {
    if (!validandoAcao) return;
    setValidandoSalvando(true);

    const usuarioNome = profile?.nome ?? session?.user.email ?? "Equipe";
    const observacao = validandoObs.trim() || null;

    const { data: atualizado, error: updateErr } = await supabase
      .from("documentos")
      .update({
        status: validandoAcao,
        observacoes: observacao,
        responsavel_id: session?.user.id ?? null,
        responsavel_nome: usuarioNome,
        atualizado_em: new Date().toISOString(),
      })
      .eq("id", documento.id)
      .select()
      .single();

    if (updateErr) {
      console.error("[Supabase] Erro ao validar documento:", updateErr);
      setUploadError("Não foi possível registrar a validação. Tente novamente.");
      setValidandoSalvando(false);
      return;
    }

    await supabase.from("documento_historico").insert({
      documento_id: documento.id,
      lead_id: lead.id,
      acao: VALIDACAO_ACOES[validandoAcao].historico,
      observacao,
      usuario_id: session?.user.id ?? null,
      usuario_nome: usuarioNome,
    });

    setDocumentos((current) =>
      current.map((d) => (d.id === documento.id ? (atualizado as Documento) : d)),
    );
    setHistoricoPorDocumento((current) => {
      if (!(documento.id in current)) return current;
      const resto = { ...current };
      delete resto[documento.id];
      return resto;
    });
    setValidandoSalvando(false);
    setValidandoId(null);
    setValidandoAcao(null);
  }

  // FEATURE 008 (visual) — histórico por documento, carregado sob demanda
  // (evita 1 query por item da lista logo ao abrir o modal).
  const ACAO_HISTORICO_LABEL: Record<DocumentoHistorico["acao"], string> = {
    CHECKLIST_GERADO: "Item do checklist gerado",
    DOCUMENTO_ENVIADO: "Documento enviado",
    DOCUMENTO_SUBSTITUIDO: "Documento substituído",
    DOCUMENTO_VALIDADO: "Marcado como correto",
    DOCUMENTO_REJEITADO: "Marcado como inválido",
    NOVA_VERSAO_SOLICITADA: "Nova versão solicitada",
  };

  const [historicoAbertoId, setHistoricoAbertoId] = useState<string | null>(null);
  const [historicoPorDocumento, setHistoricoPorDocumento] = useState<
    Record<string, DocumentoHistorico[]>
  >({});
  const [historicoCarregando, setHistoricoCarregando] = useState(false);

  async function toggleHistorico(documentoId: string) {
    if (historicoAbertoId === documentoId) {
      setHistoricoAbertoId(null);
      return;
    }

    setHistoricoAbertoId(documentoId);

    if (historicoPorDocumento[documentoId]) return;

    setHistoricoCarregando(true);
    const { data, error } = await supabase
      .from("documento_historico")
      .select("*")
      .eq("documento_id", documentoId)
      .order("criado_em", { ascending: false });

    setHistoricoCarregando(false);

    if (error) {
      console.error("[Supabase] Erro ao carregar histórico:", error);
      return;
    }

    setHistoricoPorDocumento((current) => ({
      ...current,
      [documentoId]: (data ?? []) as DocumentoHistorico[],
    }));
  }

  const whatsappLink = buildWhatsAppLink(
    lead.whatsapp,
    `Olá, ${lead.nome}! Aqui é a equipe da IDP Brasil, sobre a sua pré-análise de isenção do Imposto de Renda.`,
  );

  const hasChanges =
    status !== lead.status ||
    servico !== (lead.servico ?? "") ||
    prioridade !== (lead.prioridade ?? "normal") ||
    observacoes !== (lead.observacoes ?? "") ||
    ultimoContato !== toDateInputValue(lead.ultimo_contato) ||
    proximaAcao !== (lead.proxima_acao ?? "") ||
    dataProximoContato !== toDateInputValue(lead.data_proximo_contato) ||
    motivoEncerramento !== (lead.motivo_encerramento ?? "") ||
    motivoFinalizacao !== (lead.motivo_finalizacao ?? "");

  async function sincronizarESetarChecklist(novoServico: string | null, servicoAnterior: string | null) {
    try {
      const usuarioNome = profile?.nome ?? session?.user.email ?? "Equipe";
      const resultado = await sincronizarChecklistDocumentos(lead.id, novoServico, servicoAnterior, {
        id: session?.user.id ?? null,
        nome: usuarioNome,
      });
      setDocumentos(resultado.documentos);
      setAvisoChecklist(resultado.avisoTrocaComDocumentosAvancados);
    } catch (checklistError) {
      console.error("[Documentos] Erro ao sincronizar checklist:", checklistError);
      setErrorMessage("Não foi possível gerar/atualizar o checklist de documentos.");
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setErrorMessage(null);
    setSavedJustNow(false);
    setAvisoChecklist(false);

    const servicoAnterior = lead.servico ?? null;
    const novoServico = servico === "" ? null : servico;

    const updates = {
      status,
      servico: novoServico,
      prioridade,
      observacoes: observacoes.trim() === "" ? null : observacoes.trim(),
      ultimo_contato: ultimoContato === "" ? null : ultimoContato,
      proxima_acao: proximaAcao.trim() === "" ? null : proximaAcao.trim(),
      data_proximo_contato: dataProximoContato === "" ? null : dataProximoContato,
      motivo_encerramento: motivoEncerramento === "" ? null : motivoEncerramento,
      // Motivo de finalização só faz sentido quando o status é FINALIZADO —
      // se a especialista reabrir o caso, limpamos o motivo antigo.
      motivo_finalizacao: status === "FINALIZADO" && motivoFinalizacao !== "" ? motivoFinalizacao : null,
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

    // FEATURE 004 — o checklist documental é gerado/atualizado sempre que
    // o serviço do lead é definido ou trocado. Só dispara quando o valor
    // realmente mudou (a própria função também tem esse early return, mas
    // evitamos a chamada de rede à toa).
    if (novoServico !== servicoAnterior) {
      await sincronizarESetarChecklist(novoServico, servicoAnterior);
    }
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
          <Info label="E-mail" value={lead.email ?? "—"} />
          <Info label="Cidade" value={`${lead.cidade} / ${lead.estado}`} />
          <Info label="Origem" value={origemLabel(lead.origem)} />
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

            <Field label="Serviço">
              <select
                value={servico}
                onChange={(e) => setServico(e.target.value)}
                className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
              >
                <option value="">Não definido</option>
                {SERVICO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            {status === "FINALIZADO" && (
              <Field label="Motivo de finalização">
                <select
                  value={motivoFinalizacao}
                  onChange={(e) => setMotivoFinalizacao(e.target.value)}
                  className="h-10 w-full rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
                >
                  <option value="">Selecione o motivo</option>
                  {MOTIVO_FINALIZACAO_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            )}

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

        <div className="mt-6 space-y-3 border-t border-selo-700/10 pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            Documentos
          </h3>

          {isLoadingDocumentos ? (
            <p className="text-sm text-ink/45">Carregando checklist...</p>
          ) : documentos.length === 0 ? (
            <p className="text-sm text-ink/45">
              {servico === ""
                ? "Defina um serviço acima e salve para gerar o checklist."
                : "Nenhum documento neste checklist ainda."}
            </p>
          ) : (
            <ul className="space-y-2">
              {documentos.map((documento) => {
                const statusOption = resolveDocumentoStatus(documento.status);
                const isUploading = uploadingId === documento.id;
                return (
                  <li
                    key={documento.id}
                    className="rounded-lg border border-selo-700/10 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        {documento.storage_path ? (
                          <button
                            type="button"
                            onClick={() => setPreviewDocumento(documento)}
                            className="block truncate text-left text-selo-900 underline-offset-2 hover:underline"
                          >
                            {documento.nome}
                          </button>
                        ) : (
                          <span className="block truncate text-selo-900">{documento.nome}</span>
                        )}
                        {documento.arquivo_nome_original && (
                          <span className="block truncate text-xs text-ink/45">
                            {documento.arquivo_nome_original}
                          </span>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusOption.badgeClass}`}
                        >
                          {statusOption.emoji} {statusOption.label}
                        </span>
                        <label className="cursor-pointer text-xs font-medium text-selo-700 underline-offset-2 hover:underline">
                          {isUploading ? "Enviando..." : documento.storage_path ? "Substituir" : "Adicionar"}
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (file) handleUpload(documento, file);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {documento.storage_path && validandoId !== documento.id && (
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-selo-700/10 pt-2">
                        {(Object.keys(VALIDACAO_ACOES) as (keyof typeof VALIDACAO_ACOES)[]).map(
                          (acao) => (
                            <button
                              key={acao}
                              type="button"
                              onClick={() => abrirValidacao(documento, acao)}
                              className="text-xs font-medium text-ink/60 hover:text-selo-700 hover:underline"
                            >
                              {VALIDACAO_ACOES[acao].label}
                            </button>
                          ),
                        )}
                        <button
                          type="button"
                          onClick={() => toggleHistorico(documento.id)}
                          className="text-xs text-ink/45 hover:text-selo-700 hover:underline"
                        >
                          {historicoAbertoId === documento.id ? "Ocultar histórico" : "Histórico"}
                        </button>
                      </div>
                    )}

                    {historicoAbertoId === documento.id && (
                      <ul className="mt-2 space-y-1.5 border-t border-selo-700/10 pt-2">
                        {historicoCarregando && !historicoPorDocumento[documento.id] ? (
                          <li className="text-xs text-ink/45">Carregando...</li>
                        ) : (historicoPorDocumento[documento.id] ?? []).length === 0 ? (
                          <li className="text-xs text-ink/45">Sem eventos registrados.</li>
                        ) : (
                          historicoPorDocumento[documento.id].map((evento) => (
                            <li key={evento.id} className="text-xs text-ink/60">
                              <span className="font-medium text-selo-900">
                                {ACAO_HISTORICO_LABEL[evento.acao]}
                              </span>{" "}
                              — {formatDateTime(evento.criado_em)}
                              {evento.usuario_nome ? ` · ${evento.usuario_nome}` : ""}
                              {evento.observacao && (
                                <span className="block text-ink/45">{evento.observacao}</span>
                              )}
                            </li>
                          ))
                        )}
                      </ul>
                    )}

                    {validandoId === documento.id && (
                      <div className="mt-2 space-y-2 border-t border-selo-700/10 pt-2">
                        <p className="text-xs font-medium text-selo-900">
                          {validandoAcao && VALIDACAO_ACOES[validandoAcao].label} — observação
                          (opcional)
                        </p>
                        <textarea
                          value={validandoObs}
                          onChange={(e) => setValidandoObs(e.target.value)}
                          rows={2}
                          className="w-full resize-none rounded-lg border border-selo-700/20 bg-white px-2 py-1.5 text-xs text-selo-900 focus:border-selo-700 focus:outline-none"
                        />
                        <div className="flex gap-3">
                          <button
                            type="button"
                            disabled={validandoSalvando}
                            onClick={() => confirmarValidacao(documento)}
                            className="text-xs font-semibold text-selo-700 hover:underline disabled:opacity-50"
                          >
                            {validandoSalvando ? "Salvando..." : "Confirmar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setValidandoId(null)}
                            className="text-xs text-ink/45 hover:underline"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
        </div>

        {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
        {savedJustNow && !hasChanges && (
          <p className="mt-4 text-sm text-selo-700">Alterações salvas.</p>
        )}
        {avisoChecklist && (
          <p className="mt-4 rounded-lg border border-ouro-500/40 bg-ouro-50 p-3 text-sm text-ouro-600">
            O serviço mudou, mas este lead já tem documentos além de pendente. O checklist
            anterior foi preservado — nenhum documento foi removido.
          </p>
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

      {previewDocumento && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-selo-900/40">
          <div className="flex h-full w-full flex-col bg-white shadow-xl sm:w-[420px]">
            <div className="flex items-center justify-between border-b border-selo-700/10 p-4">
              <span className="truncate text-sm font-medium text-selo-900">
                {previewDocumento.nome}
              </span>
              <button
                type="button"
                onClick={() => setPreviewDocumento(null)}
                aria-label="Fechar preview"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/50 hover:bg-selo-50 hover:text-selo-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-selo-900/5 p-2">
              {previewError ? (
                <p className="p-4 text-sm text-red-600">{previewError}</p>
              ) : !previewUrl ? (
                <p className="p-4 text-sm text-ink/45">Carregando...</p>
              ) : previewDocumento.mime_type === "application/pdf" ? (
                <iframe src={previewUrl} title={previewDocumento.nome} className="h-full w-full" />
              ) : (
                <img src={previewUrl} alt={previewDocumento.nome} className="w-full" />
              )}
            </div>
          </div>
        </div>
      )}
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
