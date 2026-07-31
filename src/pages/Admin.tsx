import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { LeadDetailModal } from "@/components/admin/LeadDetailModal";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Lead } from "@/types/lead";

export default function Admin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

  return (
    <div className="min-h-screen bg-paper px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="font-display text-lg font-semibold text-selo-700">
              IDP <span className="text-ouro-600">Brasil</span>
            </Link>
            <h1 className="mt-1 font-display text-2xl font-semibold text-selo-900">
              Painel Adrieli
            </h1>
          </div>
        </div>

        <div className="mt-8">
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
            <p className="text-sm text-ink/60">
              Nenhum lead recebido ainda.
            </p>
          )}

          {isSupabaseConfigured && !isLoading && !errorMessage && leads.length > 0 && (
            <LeadsTable leads={leads} onView={setSelectedLead} />
          )}
        </div>
      </div>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
