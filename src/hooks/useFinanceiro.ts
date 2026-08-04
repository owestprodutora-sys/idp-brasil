import { useEffect, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { LeadFinanceiro } from "@/types/lead-financeiro";

// FASE 5A — carrega todos os registros de lead_financeiro, usados pelos
// Cards, Indicadores e Lista Financeira do Dashboard do Gestor. Mesmo
// padrão do useLeads.ts.
export function useFinanceiro() {
  const [registros, setRegistros] = useState<LeadFinanceiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    async function loadFinanceiro() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("lead_financeiro")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isActive) return;

      if (error) {
        console.error("[Supabase] Erro ao carregar financeiro:", error);
        setErrorMessage(
          "Não foi possível carregar os dados financeiros agora. Tente novamente em instantes.",
        );
      } else {
        setRegistros((data ?? []) as LeadFinanceiro[]);
      }
      setIsLoading(false);
    }

    loadFinanceiro();
    return () => {
      isActive = false;
    };
  }, []);

  function updateRegistro(updated: LeadFinanceiro) {
    setRegistros((current) => {
      const existe = current.some((r) => r.id === updated.id);
      if (!existe) return [updated, ...current];
      return current.map((r) => (r.id === updated.id ? updated : r));
    });
  }

  return { registros, isLoading, errorMessage, updateRegistro };
}
