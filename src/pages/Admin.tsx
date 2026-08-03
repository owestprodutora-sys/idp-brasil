import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { GestorDashboard } from "@/pages/admin/GestorDashboard";
import { SpecialistDashboard } from "@/pages/admin/SpecialistDashboard";

// Roteador por perfil (TASK-007A):
// Decide qual dashboard mostrar depois do login.
// A URL /admin continua sendo o destino para todos os perfis.
// Novos perfis futuros podem ser adicionados aqui.

export default function Admin() {
  const { profile, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-sm text-ink/50">
        Carregando...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
        <p className="max-w-sm text-sm text-ink/60">
          Seu login funcionou, mas ainda não existe um perfil cadastrado para
          esta conta. Peça para um gestor cadastrar seu nome, e-mail e função
          na tabela{" "}
          <code className="rounded bg-ink/5 px-1 py-0.5">
            profiles
          </code>
          .
        </p>

        <Button
          variant="outline"
          onClick={handleSignOut}
          className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
        >
          Sair
        </Button>
      </div>
    );
  }

  if (profile.role === "gestor") {
    return <GestorDashboard />;
  }

  return <SpecialistDashboard />;
}