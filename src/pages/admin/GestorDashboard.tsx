import { useNavigate } from "react-router-dom";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { FinanceiroPlaceholder } from "@/components/admin/FinanceiroPlaceholder";
import { GestorMetricsCards } from "@/components/admin/GestorMetricsCards";
import { useAuth } from "@/hooks/useAuth";
import { useLeads } from "@/hooks/useLeads";
import { isSupabaseConfigured } from "@/lib/supabase";

// Dashboard do Gestor (TASK-007A) — visão geral da operação. Estrutura
// mínima preparada para expansão futura (financeiro, mais métricas, mais
// perfis); não replica o CRM operacional da Especialista de propósito.
export function GestorDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { leads, isLoading, errorMessage } = useLeads();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  const convertidos = leads.filter((lead) => lead.status === "elegivel").length;

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

          {isSupabaseConfigured && !isLoading && !errorMessage && (
            <>
              <GestorMetricsCards leads={leads} />
              <FinanceiroPlaceholder clientesConvertidos={convertidos} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
