import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { PreAnalysisAnswers } from "@/types/pre-analysis";

/**
 * Stub temporário — evita rota quebrada enquanto o TASK-006
 * (formulário real de Cadastro + Supabase) não é implementado.
 * As respostas da Pré-Análise já chegam aqui via location.state.
 */
export default function Register() {
  const location = useLocation();
  const answers = location.state?.answers as Partial<PreAnalysisAnswers> | undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
      <h1 className="font-display text-2xl font-semibold text-selo-900">
        Cadastro em construção
      </h1>
      <p className="max-w-sm text-sm text-ink/60">
        Esta etapa será implementada na próxima tarefa (TASK-006).
      </p>
      {answers && (
        <pre className="mt-2 max-w-sm overflow-auto rounded-lg bg-selo-50 p-3 text-left text-xs text-selo-900">
          {JSON.stringify(answers, null, 2)}
        </pre>
      )}
      <Button asChild variant="outline">
        <Link to="/">Voltar para a Landing</Link>
      </Button>
    </div>
  );
}
