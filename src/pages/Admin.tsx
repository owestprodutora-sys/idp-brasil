import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { DashboardCards } from "@/components/admin/DashboardCards";
import { LeadDetailModal } from "@/components/admin/LeadDetailModal";
import { LeadFilters, type LeadFiltersValue } from "@/components/admin/LeadFilters";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { isProximaAcaoVencida } from "@/lib/crm-config";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Lead } from "@/types/lead";

const DEFAULT_FILTERS: LeadFiltersValue = {
  status: "todos",
  prioridade: "todas",
  data: "todos",
};

export default function Admin() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState<LeadFiltersValue>(DEFAULT_FILTERS);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    async function loadLeads() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isActive) return;

      if (error) {
        console.error("[Supabase] Erro ao carregar leads:", error);
        setErrorMessage(
          "Não foi possível carregar os leads agora. Tente novamente em instantes.",
        );
      } else {
        setLeads((data ?? []) as Lead[]);
      }
      setIsLoading(false);
    }

    loadLeads();
    return () => {
      isActive = false;
    };
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  function handleLeadUpdated(updated: Lead) {
    setLeads((current) => current.map((lead) => (lead.id === updated.id ? updated : lead)));
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
        if (lead.status === "novo") score -= 1000;
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
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="font-display text-lg font-semibold text-selo-700">
              IDP <span className="text-ouro-600">Brasil</span>
            </Link>
            <h1 className="mt-1 font-display text-2xl font-semibold text-selo-900">
              Painel Adrieli
            </h1>
          </div>

          <Button
            variant="outline"
            onClick={handleSignOut}
            className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
          >
            Sair
          </Button>
        </div>

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
