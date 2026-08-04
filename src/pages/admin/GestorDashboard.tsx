import { ArrowLeft, ClipboardList, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AlertasOperacionais } from "@/components/admin/AlertasOperacionais";
import { Button } from "@/components/ui/button";
import { FinanceiroCards } from "@/components/admin/FinanceiroCards";
import { FinanceiroTable } from "@/components/admin/FinanceiroTable";
import { GestorLeadsTable } from "@/components/admin/GestorLeadsTable";
import { GestorMetricsCards } from "@/components/admin/GestorMetricsCards";
import { IndicadoresFinanceiros } from "@/components/admin/IndicadoresFinanceiros";
import { LeadDetailModal } from "@/components/admin/LeadDetailModal";
import { LeadFilters, type LeadFiltersValue } from "@/components/admin/LeadFilters";
import { StatusTabs } from "@/components/admin/StatusTabs";
import { useAuth } from "@/hooks/useAuth";
import { useFinanceiro } from "@/hooks/useFinanceiro";
import { useLeads } from "@/hooks/useLeads";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Lead } from "@/types/lead";

const DEFAULT_FILTERS: LeadFiltersValue = {
  status: "todos",
  prioridade: "todas",
  data: "todos",
  semContatoRecente: false,
};

// Dashboard do Gestor (TASK-007A / TASK-007B) — visão geral da operação,
// com alertas de gargalos e uma visão de acompanhamento de leads somente
// leitura. Não substitui e não duplica o CRM operacional da Especialista.
export function GestorDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { leads, isLoading, errorMessage, updateLead } = useLeads();
  // FASE 5A — Centro Financeiro Operacional (FEATURE 019/020/021).
  const financeiro = useFinanceiro();
  const [view, setView] = useState<"visao_geral" | "acompanhar_leads" | "financeiro">(
    "visao_geral",
  );
  const [filters, setFilters] = useState<LeadFiltersValue>(DEFAULT_FILTERS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  function handleLeadUpdated(updated: Lead) {
    updateLead(updated);
    setSelectedLead(updated);
  }

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  const leadsFiltrados = useMemo(() => {
    const now = Date.now();
    return leads.filter((lead) => {
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
      return true;
    });
  }, [leads, filters]);

  return (
    <div className="min-h-screen bg-paper px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <AdminHeader title="Painel do Gestor" roleLabel="Gestor" onSignOut={handleSignOut} />

        <div className="mt-8 space-y-6">
          {!isSupabaseConfigured && (
            <p className="rounded-lg border border-ouro-500/40 bg-ouro-50 px-4 py-3 text-sm text-selo-900">
              O Supabase ainda não está configurado neste ambiente (arquivo
              `.env`), então não é possível carregar as métricas.
            </p>
          )}

          {isSupabaseConfigured && isLoading && (
            <p className="text-sm text-ink/60">Carregando métricas...</p>
          )}

          {isSupabaseConfigured && !isLoading && errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          {isSupabaseConfigured && !isLoading && !errorMessage && view === "visao_geral" && (
            <>
              <div className="flex items-center justify-between gap-4">
                <GestorMetricsCards leads={leads} />
              </div>

              <AlertasOperacionais leads={leads} />

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setView("acompanhar_leads")}
                  className="h-11 bg-selo-700 text-paper hover:bg-selo-600"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Acompanhar Leads
                </Button>

                <Button
                  onClick={() => setView("financeiro")}
                  variant="outline"
                  className="h-11 border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Ver Financeiro
                </Button>
              </div>
            </>
          )}

          {isSupabaseConfigured && !isLoading && !errorMessage && view === "acompanhar_leads" && (
            <>
              <Button
                variant="outline"
                onClick={() => setView("visao_geral")}
                className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar à visão geral
              </Button>

              <p className="text-xs text-ink/45">
                Visão somente leitura — edições de status, prioridade e observações continuam
                sendo feitas pela especialista no próprio CRM.
              </p>

              <StatusTabs
                leads={leads}
                value={filters.status}
                onChange={(status) => setFilters((current) => ({ ...current, status }))}
              />

              <LeadFilters value={filters} onChange={setFilters} />

              {leadsFiltrados.length === 0 ? (
                <p className="text-sm text-ink/60">Nenhum lead encontrado com esses filtros.</p>
              ) : (
                <GestorLeadsTable leads={leadsFiltrados} />
              )}
            </>
          )}

          {isSupabaseConfigured && !isLoading && !errorMessage && view === "financeiro" && (
            <>
              <Button
                variant="outline"
                onClick={() => setView("visao_geral")}
                className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar à visão geral
              </Button>

              {financeiro.errorMessage && (
                <p className="text-sm text-red-600">{financeiro.errorMessage}</p>
              )}

              {financeiro.isLoading ? (
                <p className="text-sm text-ink/60">Carregando dados financeiros...</p>
              ) : (
                <>
                  <FinanceiroCards registros={financeiro.registros} />
                  <IndicadoresFinanceiros registros={financeiro.registros} />
                  <FinanceiroTable
                    leads={leads}
                    registros={financeiro.registros}
                    onOpenLead={setSelectedLead}
                  />
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
