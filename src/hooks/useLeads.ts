import { useEffect, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Lead } from "@/types/lead";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  function updateLead(updated: Lead) {
    setLeads((current) => current.map((lead) => (lead.id === updated.id ? updated : lead)));
  }

  return { leads, isLoading, errorMessage, updateLead };
}
