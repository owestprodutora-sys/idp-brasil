import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { LeadDetailModal } from "@/components/admin/LeadDetailModal";
import { LeadFilters, type LeadFiltersValue } from "@/components/admin/LeadFilters";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { useAuth } from "@/hooks/useAuth";
import { useLeads } from "@/hooks/useLeads";
import { isProximaAcaoVencida } from "@/lib/crm-config";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Lead } from "@/types/lead";

const DEFAULT_FILTERS: LeadFiltersValue = {
  status: "todos",
  prioridade: "todas",
  data: "todos",
};

// Painel operacional da Especialista (ex-TASK-008/TASK-007). O conteúdo é o
// mesmo de antes do TASK-007A — só passou a usar o hook useLeads
// compartilhado e o AdminHeader comum aos dois dashboards.
export function SpecialistDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { leads, isLoading, errorMessage, updateLead } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState<LeadFiltersValue>(DEFAULT_FILTERS);

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  function handleLeadUpdated(updated: Lead) {
    updateLead(updated);
    setSelectedLead(updated);
  }

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
  }, [leads, filters]);

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

          {isSupabaseConfigured && !isLoading && !errorMessage && leads.length > 0 && (
            <>
              <DashboardCards leads={leads} />

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
