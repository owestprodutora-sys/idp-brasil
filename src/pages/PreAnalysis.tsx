import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

/**
 * Stub temporário — evita rota quebrada enquanto o TASK-005
 * (fluxo real de Pré-Análise, uma pergunta por tela) não é implementado.
 */
export default function PreAnalysis() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
      <h1 className="font-display text-2xl font-semibold text-selo-900">
        Pré-Análise em construção
      </h1>
      <p className="max-w-sm text-sm text-ink/60">
        Esta etapa será implementada na próxima tarefa (TASK-005).
      </p>
      <Button asChild variant="outline">
        <Link to="/">Voltar para a Landing</Link>
      </Button>
    </div>
  );
}
