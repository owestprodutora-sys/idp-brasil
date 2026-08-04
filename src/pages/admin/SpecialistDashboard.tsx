import { ArrowLeft, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AgendaPlaceholder } from "@/components/admin/AgendaPlaceholder";
import { Button } from "@/components/ui/button";
import { CasosCriticos } from "@/components/admin/CasosCriticos";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { FilaDeTrabalho } from "@/components/admin/FilaDeTrabalho";
import { FollowUpPanel } from "@/components/admin/FollowUpPanel";
import { IndicadoresOperacionais } from "@/components/admin/IndicadoresOperacionais";
import { LeadDetailModal } from "@/components/admin/LeadDetailModal";
import { LeadFilters, type LeadFiltersValue } from "@/components/admin/LeadFilters";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { MeuDiaPanel, type MeuDiaCardKey } from "@/components/admin/MeuDiaPanel";
import { SpecialistFinanceiroCards } from "@/components/admin/SpecialistFinanceiroCards";
import { SpecialistIndicadoresComissao } from "@/components/admin/SpecialistIndicadoresComissao";
import { StatusTabs } from "@/components/admin/StatusTabs";
import { useAuth } from "@/hooks/useAuth";
import { useFinanceiro } from "@/hooks/useFinanceiro";
import { useLeads } from "@/hooks/useLeads";
import { useMeuDiaData } from "@/hooks/useMeuDiaData";
import { CLOSED_STATUSES, isProximaAcaoVencida, isSemContatoRecente, type LeadStatus } from "@/lib/crm-config";
import { listarAlertasDoLead } from "@/lib/lead-alertas";
import { agruparDocumentosPorLead, buildMeuDiaResumo } from "@/lib/meu-dia";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Lead } from "@/types/lead";

const DEFAULT_FILTERS: LeadFiltersValue = {
  status: "todos",
  prioridade: "todas",
  data: "todos",
  semContatoRecente: false,
};

// Painel operacional da Especialista (ex-TASK-008/TASK-007). O conteúdo é o
// mesmo de antes do TASK-007A — só passou a usar o hook useLeads
// compartilhado e o AdminHeader comum aos dois dashboards.
export function SpecialistDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { leads, isLoading, errorMessage, updateLead } = useLeads();
  // FASE 5A.1 — Painel Financeiro da Especialista (FEATURE 022/028).
  // Mesmo hook já usado no Dashboard do Gestor (useFinanceiro.ts).
  const financeiro = useFinanceiro();
  // FASE 4B — Dashboard Operacional "Meu Dia". Dados adicionais (documentos
  // de todos os leads + eventos de finalização de hoje) que o useLeads não
  // traz — ver hooks/useMeuDiaData.ts.
  const meuDia = useMeuDiaData();
  // FASE 5A.1 (ajuste de UX) — mesmo padrão de navegação do
  // GestorDashboard#view: o financeiro fica oculto por padrão, atrás de um
  // botão "Ver Financeiro" / "Voltar ao CRM", em vez de aparecer direto no
  // corpo do painel.
  const [view, setView] = useState<"crm" | "financeiro">("crm");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState<LeadFiltersValue>(DEFAULT_FILTERS);
  // Filtro extra aplicado pelos cards do Meu Dia que não têm equivalente
  // em LeadFiltersValue (esses continuam sendo controlados por `filters`,
  // reaproveitando handleSelectStatusFromCard — ver "novosLeads" abaixo).
  const [meuDiaExtraFilter, setMeuDiaExtraFilter] = useState<Exclude<
    MeuDiaCardKey,
    "novosLeads"
  > | null>(null);

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  function handleLeadUpdated(updated: Lead) {
    updateLead(updated);
    setSelectedLead(updated);
  }

  // Cards clicáveis do dashboard: clicar de novo no card ativo remove o
  // filtro (comportamento de toggle), sem precisar abrir o menu de filtros.
  function handleSelectStatusFromCard(status: LeadStatus) {
    setFilters((current) => ({
      ...current,
      status: current.status === status ? "todos" : status,
    }));
  }

  function handleToggleSemContatoRecenteFromCard() {
    setFilters((current) => ({
      ...current,
      semContatoRecente: !current.semContatoRecente,
    }));
  }

  // FEATURE 013 — cards do Meu Dia aplicam o filtro correspondente na
  // lista de leads. "Novos leads" reaproveita o mesmo toggle de status já
  // usado pelo card equivalente em DashboardCards (mesmo estado, mesmo
  // comportamento); os demais usam o filtro extra abaixo.
  function handleToggleMeuDiaCard(key: MeuDiaCardKey) {
    if (key === "novosLeads") {
      handleSelectStatusFromCard("NOVO_LEAD");
      return;
    }
    setMeuDiaExtraFilter((current) => (current === key ? null : key));
  }

  const meuDiaActiveCard: MeuDiaCardKey | null =
    filters.status === "NOVO_LEAD" ? "novosLeads" : meuDiaExtraFilter;

  const documentosPorLead = useMemo(
    () => agruparDocumentosPorLead(meuDia.documentos),
    [meuDia.documentos],
  );

  const meuDiaResumo = useMemo(
    () => buildMeuDiaResumo(leads, meuDia.documentos, meuDia.leadIdsFinalizadosHoje),
    [leads, meuDia.documentos, meuDia.leadIdsFinalizadosHoje],
  );

  const visibleLeads = useMemo(() => {
    const now = Date.now();
    const filtered = leads.filter((lead) => {
      if (filters.status !== "todos" && lead.status !== filters.status) return false;
      if (filters.prioridade !== "todas" && (lead.prioridade ?? "normal") !== filters.prioridade) {
        return false;
      }
      if (filters.data !== "todos") {
        const createdAt = new Date(lead.created_at).getTime();
        const diasLimite = filters.data === "hoje" ? 1 : filters.data === "7dias" ? 7 : 30;
        const limite = now - diasLimite * 24 * 60 * 60 * 1000;
        if (createdAt < limite) return false;
      }
      if (filters.semContatoRecente && !isSemContatoRecente(lead.status, lead.ultimo_contato)) {
        return false;
      }
      if (meuDiaExtraFilter) {
        const documentosDoLead = documentosPorLead.get(lead.id) ?? [];
        if (meuDiaExtraFilter === "followUpsVencidos") {
          const encerrado = CLOSED_STATUSES.includes(
            lead.status as (typeof CLOSED_STATUSES)[number],
          );
          if (encerrado || !isProximaAcaoVencida(lead.data_proximo_contato)) return false;
        } else if (meuDiaExtraFilter === "documentosAguardandoValidacao") {
          if (!documentosDoLead.some((d) => d.status === "RECEBIDO")) return false;
        } else if (meuDiaExtraFilter === "documentosInvalidos") {
          if (!documentosDoLead.some((d) => d.status === "INVALIDO")) return false;
        } else if (meuDiaExtraFilter === "casosCriticos") {
          if (listarAlertasDoLead(lead, documentosDoLead).length === 0) return false;
        } else if (meuDiaExtraFilter === "finalizadosHoje") {
          if (!meuDia.leadIdsFinalizadosHoje.has(lead.id)) return false;
        }
      }
      return true;
    });

    // Ordenação inicial: leads novos primeiro, depois alta prioridade,
    // depois próximas ações vencidas — resto por data de registro (recente primeiro).
    return [...filtered].sort((a, b) => {
      const scoreOf = (lead: Lead) => {
        let score = 0;
        if (lead.status === "NOVO_LEAD") score -= 1000;
        if (lead.prioridade === "alta") score -= 100;
        if (isProximaAcaoVencida(lead.data_proximo_contato)) score -= 10;
        return score;
      };

      const diff = scoreOf(a) - scoreOf(b);
      if (diff !== 0) return diff;

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [leads, filters, meuDiaExtraFilter, documentosPorLead, meuDia.leadIdsFinalizadosHoje]);

  return (
    <div className="min-h-screen bg-paper px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <AdminHeader title="Painel Adrieli" roleLabel="Especialista" onSignOut={handleSignOut} />

        <div className="mt-8 space-y-6">
          {!isSupabaseConfigured && (
            <p className="rounded-lg border border-ouro-500/40 bg-ouro-50 px-4 py-3 text-sm text-selo-900">
              O Supabase ainda não está configurado neste ambiente (arquivo
              `.env`), então não é possível carregar os leads.
            </p>
          )}

          {isSupabaseConfigured && isLoading && (
            <p className="text-sm text-ink/60">Carregando leads...</p>
          )}

          {isSupabaseConfigured && !isLoading && errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          {isSupabaseConfigured && !isLoading && !errorMessage && leads.length === 0 && (
            <p className="text-sm text-ink/60">Nenhum lead recebido ainda.</p>
          )}

          {isSupabaseConfigured && !isLoading && !errorMessage && leads.length > 0 && view === "crm" && (
            <>
              {/* FASE 5A.1 (ajuste de UX) — mesmo botão "Ver Financeiro" do
                  GestorDashboard, na mesma posição relativa (topo do
                  conteúdo do painel). */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setView("financeiro")}
                  variant="outline"
                  className="h-11 border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Ver Financeiro
                </Button>
              </div>

              {/* FASE 4B — Dashboard Operacional "Meu Dia". Ordem sugerida
                  pelo spec: Meu Dia → Próximas tarefas → Casos críticos →
                  Indicadores → Agenda, todos acima do CRM operacional que
                  já existia (cards, follow-up, abas, tabela). */}
              {meuDia.errorMessage && (
                <p className="text-sm text-red-600">{meuDia.errorMessage}</p>
              )}

              {!meuDia.isLoading && !meuDia.errorMessage && (
                <>
                  <MeuDiaPanel
                    resumo={meuDiaResumo}
                    activeCard={meuDiaActiveCard}
                    onToggleCard={handleToggleMeuDiaCard}
                  />

                  <FilaDeTrabalho
                    leads={leads}
                    documentosPorLead={documentosPorLead}
                    onOpenLead={setSelectedLead}
                  />

                  <CasosCriticos
                    leads={leads}
                    documentosPorLead={documentosPorLead}
                    onOpenLead={setSelectedLead}
                  />

                  <IndicadoresOperacionais
                    leads={leads}
                    documentos={meuDia.documentos}
                    followUpsVencidos={meuDiaResumo.followUpsVencidos}
                  />

                  <AgendaPlaceholder />
                </>
              )}

              <DashboardCards
                leads={leads}
                activeStatus={filters.status}
                semContatoRecenteAtivo={filters.semContatoRecente}
                onSelectStatus={handleSelectStatusFromCard}
                onToggleSemContatoRecente={handleToggleSemContatoRecenteFromCard}
              />

              <FollowUpPanel leads={leads} onConfirmado={handleLeadUpdated} />

              <StatusTabs
                leads={leads}
                value={filters.status}
                onChange={(status) => setFilters((current) => ({ ...current, status }))}
              />

              <LeadFilters value={filters} onChange={setFilters} />

              {visibleLeads.length === 0 ? (
                <p className="text-sm text-ink/60">
                  Nenhum lead encontrado com esses filtros.
                </p>
              ) : (
                <LeadsTable leads={visibleLeads} onView={setSelectedLead} />
              )}
            </>
          )}

          {isSupabaseConfigured && !isLoading && !errorMessage && view === "financeiro" && (
            <>
              {/* FASE 5A.1 (ajuste de UX) — mesmo botão "Voltar" do
                  GestorDashboard#view === "financeiro". */}
              <Button
                variant="outline"
                onClick={() => setView("crm")}
                className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao CRM
              </Button>

              {financeiro.errorMessage && (
                <p className="text-sm text-red-600">{financeiro.errorMessage}</p>
              )}

              {financeiro.isLoading ? (
                <p className="text-sm text-ink/60">Carregando dados financeiros...</p>
              ) : (
                <>
                  <SpecialistFinanceiroCards registros={financeiro.registros} />
                  <SpecialistIndicadoresComissao registros={financeiro.registros} />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdated={handleLeadUpdated}
        />
      )}
    </div>
  );
}
