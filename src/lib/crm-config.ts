// TASK-007 — Configuração central do CRM operacional mínimo.
// Fonte única de verdade para status, prioridade e motivo de encerramento,
// usada pelo badge, pelos filtros, pelos cards e pelo modal de detalhes.

// MVP 1.1 — Fase 1: pipeline operacional linear (sql/008).
// Substitui o conjunto de status do TASK-007. FINALIZADO é o único status
// final — o desfecho fica em `motivo_finalizacao`, não em status separados
// (ver MOTIVO_FINALIZACAO_OPTIONS mais abaixo).
export type LeadStatus =
  | "NOVO_LEAD"
  | "PRE_ANALISE"
  | "DOCUMENTOS_SOLICITADOS"
  | "DOCUMENTACAO_COMPLETA"
  | "CONSULTA_AGENDADA"
  | "CONTRATO"
  | "EXECUCAO"
  | "FINALIZADO";

export interface StatusOption {
  value: LeadStatus;
  emoji: string;
  label: string;
  badgeClass: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "NOVO_LEAD",
    emoji: "🔴",
    label: "Novo lead",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  {
    value: "PRE_ANALISE",
    emoji: "🔵",
    label: "Pré-análise",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    value: "DOCUMENTOS_SOLICITADOS",
    emoji: "🟣",
    label: "Documentos solicitados",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    value: "DOCUMENTACAO_COMPLETA",
    emoji: "🟢",
    label: "Documentação completa",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
  },
  {
    value: "CONSULTA_AGENDADA",
    emoji: "📅",
    label: "Consulta agendada",
    badgeClass: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    value: "CONTRATO",
    emoji: "📄",
    label: "Contrato",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    value: "EXECUCAO",
    emoji: "⚙️",
    label: "Execução",
    badgeClass: "bg-ouro-50 text-ouro-600 border-ouro-500/40",
  },
  {
    value: "FINALIZADO",
    emoji: "⚫",
    label: "Finalizado",
    badgeClass: "bg-ink/10 text-ink/70 border-ink/20",
  },
];

const STATUS_MAP = new Map(STATUS_OPTIONS.map((option) => [option.value, option]));

// Leads criados antes da migração MVP 1.1 (esquema TASK-007 e anterior)
// podem, em tese, ainda chegar com um status antigo (ex: um insert feito
// direto no banco fora da migração). Mapeamos pro equivalente mais próximo
// do pipeline novo pra não quebrar a exibição.
const LEGACY_STATUS_MAP: Record<string, LeadStatus> = {
  novo: "NOVO_LEAD",
  primeiro_contato_pendente: "PRE_ANALISE",
  em_analise: "PRE_ANALISE",
  aguardando_documento: "DOCUMENTOS_SOLICITADOS",
  elegivel: "DOCUMENTACAO_COMPLETA",
  nao_elegivel: "FINALIZADO",
  arquivado: "FINALIZADO",
  contatado: "PRE_ANALISE",
  convertido: "DOCUMENTACAO_COMPLETA",
  perdido: "FINALIZADO",
};

export function resolveStatus(status: string): StatusOption {
  const normalized = LEGACY_STATUS_MAP[status] ?? (status as LeadStatus);
  return (
    STATUS_MAP.get(normalized) ?? {
      value: normalized as LeadStatus,
      emoji: "•",
      label: status,
      badgeClass: "bg-ink/5 text-ink/60 border-ink/10",
    }
  );
}

// Único status que representa um caso encerrado (não precisa mais de ação).
export const CLOSED_STATUSES: LeadStatus[] = ["FINALIZADO"];

// MVP 1.1 — desfecho do pipeline quando status = FINALIZADO. Não usar em
// nenhum outro status (ver constraint em sql/008).
export type MotivoFinalizacao =
  | "CONTRATADO_CONCLUIDO"
  | "NAO_ELEGIVEL"
  | "DESISTENCIA_CLIENTE"
  | "SEM_RETORNO"
  | "ARQUIVADO"
  | "DUPLICADO"
  | "ENCAMINHADO";

export const MOTIVO_FINALIZACAO_OPTIONS: { value: MotivoFinalizacao; label: string }[] = [
  { value: "CONTRATADO_CONCLUIDO", label: "Contratado / concluído" },
  { value: "NAO_ELEGIVEL", label: "Não elegível" },
  { value: "DESISTENCIA_CLIENTE", label: "Desistência do cliente" },
  { value: "SEM_RETORNO", label: "Sem retorno" },
  { value: "ARQUIVADO", label: "Arquivado" },
  { value: "DUPLICADO", label: "Duplicado" },
  { value: "ENCAMINHADO", label: "Encaminhado" },
];

export function motivoFinalizacaoLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return MOTIVO_FINALIZACAO_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

// MVP 1.1 — catálogo inicial de serviços (item 4, checklist documental usa
// o mesmo slug pra saber quais documentos pedir).
export const SERVICO_OPTIONS: { value: string; label: string }[] = [
  { value: "isencao_ir", label: "Isenção IR" },
  { value: "inss_acima_teto", label: "INSS acima do teto" },
  { value: "ipva_pcd", label: "IPVA PCD" },
];

export function servicoLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return SERVICO_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export const ORIGEM_OPTIONS: { value: string; label: string }[] = [
  { value: "site", label: "Site" },
  { value: "indicacao", label: "Indicação" },
  { value: "outro", label: "Outro" },
];

export function origemLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return ORIGEM_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export type LeadPriority = "alta" | "normal" | "baixa";

export interface PriorityOption {
  value: LeadPriority;
  emoji: string;
  label: string;
  badgeClass: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: "alta", emoji: "⭐", label: "Alta", badgeClass: "bg-ouro-50 text-ouro-600 border-ouro-500/40" },
  { value: "normal", emoji: "", label: "Normal", badgeClass: "bg-ink/5 text-ink/60 border-ink/10" },
  { value: "baixa", emoji: "", label: "Baixa", badgeClass: "bg-ink/5 text-ink/40 border-ink/10" },
];

const PRIORITY_MAP = new Map(PRIORITY_OPTIONS.map((option) => [option.value, option]));

export function resolvePriority(prioridade: string | null | undefined): PriorityOption {
  return PRIORITY_MAP.get((prioridade ?? "normal") as LeadPriority) ?? PRIORITY_OPTIONS[1];
}

export const MOTIVO_ENCERRAMENTO_OPTIONS: { value: string; label: string }[] = [
  { value: "nao_aposentado", label: "Não aposentado" },
  { value: "sem_desconto_ir", label: "Não possui desconto de IR" },
  { value: "doenca_nao_enquadrada", label: "Doença não enquadrada" },
  { value: "falta_documentacao", label: "Falta de documentação" },
  { value: "cliente_desistiu", label: "Cliente desistiu" },
  { value: "cliente_nao_respondeu", label: "Cliente não respondeu" },
  { value: "outro", label: "Outro" },
];

export function motivoEncerramentoLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return MOTIVO_ENCERRAMENTO_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

// Sugestões pra próxima ação (campo de texto livre com datalist — não é
// um enum fechado, só uma ajuda pra digitar mais rápido).
export const PROXIMA_ACAO_SUGESTOES: string[] = [
  "Solicitar documento",
  "Retornar ligação",
  "Avaliar laudo",
  "Enviar orientação",
  "Finalizar análise",
];

// Um lead é considerado "sem contato recente" se está em andamento (não
// encerrado) e o último contato foi há mais de N dias (ou nunca houve).
const DIAS_SEM_CONTATO_RECENTE = 3;

export function isSemContatoRecente(
  status: string,
  ultimoContato: string | null | undefined,
): boolean {
  const resolved = resolveStatus(status);
  if (CLOSED_STATUSES.includes(resolved.value)) return false;

  if (!ultimoContato) return true;

  const dias = (Date.now() - new Date(ultimoContato).getTime()) / (1000 * 60 * 60 * 24);
  return dias > DIAS_SEM_CONTATO_RECENTE;
}

export function isProximaAcaoVencida(dataProximoContato: string | null | undefined): boolean {
  if (!dataProximoContato) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const data = new Date(`${dataProximoContato}T00:00:00`);
  return data.getTime() < hoje.getTime();
}

// TASK-007B — Preparação para múltiplos profissionais. A tabela já tem a
// coluna `profissional_id` (sql/007), mas hoje ela sempre vem nula, porque
// só existe a Adrieli. Enquanto não há gerenciamento de profissionais,
// mostramos o nome dela fixo — sem precisar buscar em `profiles` (que hoje
// só permite a cada usuário ler o próprio perfil).
const RESPONSAVEL_UNICO_NOME = "Adrieli Drewlo Dias";

export function responsavelLabel(): string {
  return RESPONSAVEL_UNICO_NOME;
}

// Um lead "aguardando documento" que não teve contato recente é um gargalo
// visível pro gestor (cliente pode ter esquecido de enviar, ou a
// especialista pode ter esquecido de cobrar).
const DIAS_AGUARDANDO_DOCUMENTO_ATRASADO = 5;

export function isAguardandoDocumentoAtrasado(
  status: string,
  ultimoContato: string | null | undefined,
  createdAt: string,
): boolean {
  if (resolveStatus(status).value !== "DOCUMENTOS_SOLICITADOS") return false;

  const referencia = ultimoContato ?? createdAt;
  const dias = (Date.now() - new Date(referencia).getTime()) / (1000 * 60 * 60 * 24);
  return dias > DIAS_AGUARDANDO_DOCUMENTO_ATRASADO;
}
