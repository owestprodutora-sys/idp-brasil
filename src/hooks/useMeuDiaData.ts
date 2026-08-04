import { useEffect, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Documento } from "@/types/documento";

export interface UseMeuDiaDataResult {
  documentos: Documento[];
  leadIdsFinalizadosHoje: Set<string>;
  isLoading: boolean;
  errorMessage: string | null;
}

// FASE 4B — FEATURE 013/014/015/016. Busca, uma única vez por carregamento
// do Painel Adrieli, os dados que o Dashboard Operacional precisa e que o
// useLeads não traz: o checklist documental de TODOS os leads (pra contar
// "aguardando validação" / "inválidos" e alimentar Fila de Trabalho e
// Casos Críticos) e os leads com evento CASO_FINALIZADO hoje em
// lead_eventos (tabela já existente desde a FASE 4A — aqui só é lida,
// nenhum insert novo). Nenhuma regra de negócio nova.
export function useMeuDiaData(): UseMeuDiaDataResult {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [leadIdsFinalizadosHoje, setLeadIdsFinalizadosHoje] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    async function loadMeuDiaData() {
      setIsLoading(true);

      const inicioDeHoje = new Date();
      inicioDeHoje.setHours(0, 0, 0, 0);

      const [documentosResult, eventosResult] = await Promise.all([
        supabase.from("documentos").select("*"),
        supabase
          .from("lead_eventos")
          .select("lead_id")
          .eq("tipo", "CASO_FINALIZADO")
          .gte("criado_em", inicioDeHoje.toISOString()),
      ]);

      if (!isActive) return;

      if (documentosResult.error || eventosResult.error) {
        console.error(
          "[Supabase] Erro ao carregar dados do Meu Dia:",
          documentosResult.error ?? eventosResult.error,
        );
        setErrorMessage("Não foi possível carregar os indicadores do dia.");
      } else {
        setDocumentos((documentosResult.data ?? []) as Documento[]);
        setLeadIdsFinalizadosHoje(
          new Set(
            ((eventosResult.data ?? []) as { lead_id: string }[]).map((row) => row.lead_id),
          ),
        );
      }
      setIsLoading(false);
    }

    loadMeuDiaData();
    return () => {
      isActive = false;
    };
  }, []);

  return { documentos, leadIdsFinalizadosHoje, isLoading, errorMessage };
}
