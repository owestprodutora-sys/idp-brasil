// TASK-007 — Configuração central do CRM operacional mínimo.
// Fonte única de verdade para status, prioridade e motivo de encerramento,
// usada pelo badge, pelos filtros, pelos cards e pelo modal de detalhes.

export type LeadStatus =
  | "novo"
  | "primeiro_contato_pendente"
  | "em_analise"
  | "aguardando_documento"
  | "elegivel"
  | "nao_elegivel"
  | "arquivado";

export interface StatusOption {
  value: LeadStatus;
  emoji: string;
  label: string;
  badgeClass: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "novo",
    emoji: "🔴",
    label: "Novo lead",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  {
    value: "primeiro_contato_pendente",
    emoji: "🟠",
    label: "Primeiro contato pendente",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    value: "em_analise",
    emoji: "🔵",
    label: "Em análise",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    value: "aguardando_documento",
    emoji: "🟣",
    label: "Aguardando documento",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    value: "elegivel",
    emoji: "🟢",
    label: "Elegível / Em andamento",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
  },
  {
    value: "nao_elegivel",
    emoji: "⚫",
    label: "Não elegível",
    badgeClass: "bg-ink/10 text-ink/70 border-ink/20",
  },
  {
    value: "arquivado",
    emoji: "⚪",
    label: "Arquivado",
    badgeClass: "bg-ink/5 text-ink/45 border-ink/10",
  },
];

const STATUS_MAP = new Map(STATUS_OPTIONS.map((option) => [option.value, option]));

// Alguns leads antigos (criados antes do TASK-007) podem ter status do
// esquema anterior. Mapeamos para o equivalente mais próximo do novo
// conjunto para não quebrar a exibição.
const LEGACY_STATUS_MAP: Record<string, LeadStatus> = {
  contatado: "primeiro_contato_pendente",
  convertido: "elegivel",
  perdido: "arquivado",
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

// Status que representam um caso encerrado (não precisam mais de ação).
export const CLOSED_STATUSES: LeadStatus[] = ["elegivel", "nao_elegivel", "arquivado"];

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
  if (resolveStatus(status).value !== "aguardando_documento") return false;

  const referencia = ultimoContato ?? createdAt;
  const dias = (Date.now() - new Date(referencia).getTime()) / (1000 * 60 * 60 * 24);
  return dias > DIAS_AGUARDANDO_DOCUMENTO_ATRASADO;
}
