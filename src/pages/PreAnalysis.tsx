import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { DiseaseChecklist } from "@/components/pre-analysis/DiseaseChecklist";
import { PreAnalysisDone } from "@/components/pre-analysis/PreAnalysisDone";
import { ProgressBar } from "@/components/pre-analysis/ProgressBar";
import { YesNoQuestion } from "@/components/pre-analysis/YesNoQuestion";
import type { PreAnalysisAnswers } from "@/types/pre-analysis";

// 4 perguntas reais + 1 etapa final de confirmação = 5 "etapas" pra barra de progresso
const REAL_QUESTIONS_COUNT = 4;
const PROGRESS_STEPS = 5;

const STEP_MESSAGES = [
  "Vamos entender melhor o seu caso.",
  "Faltam apenas algumas informações.",
  "Agora vamos falar sobre sua condição de saúde.",
  "Estamos quase terminando.",
];
const FINAL_STEP_MESSAGE = "Última etapa da sua pré-análise.";

export default function PreAnalysis() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<Partial<PreAnalysisAnswers>>({});

  const percent = finished ? 100 : ((step + 1) / PROGRESS_STEPS) * 100;

  function goNext(patch: Partial<PreAnalysisAnswers>) {
    const updated = { ...answers, ...patch };
    setAnswers(updated);

    if (step === REAL_QUESTIONS_COUNT - 1) {
      setFinished(true);
    } else {
      setStep((current) => current + 1);
    }
  }

  function goBack() {
    if (finished) {
      setFinished(false);
      return;
    }
    setStep((current) => Math.max(0, current - 1));
  }

  function handleContinue() {
    navigate("/cadastro", { state: { answers } });
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper px-6 py-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <Link
          to="/"
          className="mb-6 self-start font-display text-base font-semibold text-selo-700"
        >
          IDP <span className="text-ouro-600">Brasil</span>
        </Link>

        <div className="flex items-start gap-4">
          {(step > 0 || finished) && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Voltar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-selo-700 hover:bg-selo-50"
            >
              ←
            </button>
          )}
          <ProgressBar
            percent={percent}
            message={finished ? FINAL_STEP_MESSAGE : STEP_MESSAGES[step]}
          />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full">
            {finished ? (
              <PreAnalysisDone onContinue={handleContinue} />
            ) : (
              <>
                {step === 0 && (
                  <YesNoQuestion
                    question="Você é aposentado(a)?"
                    onAnswer={(value) => goNext({ aposentado: value as "sim" | "nao" })}
                  />
                )}
                {step === 1 && (
                  <YesNoQuestion
                    question="No seu pagamento de aposentadoria existe desconto de Imposto de Renda (IR)?"
                    helperText='Exemplo: no extrato ou contracheque aparece um desconto chamado "Imposto de Renda" ou "IR".'
                    showNaoSei
                    onAnswer={(value) => goNext({ tributavel: value })}
                  />
                )}
                {step === 2 && (
                  <DiseaseChecklist
                    defaultValue={answers.qualDoenca}
                    onAnswer={(qualDoenca) => goNext({ qualDoenca })}
                  />
                )}
                {step === 3 && (
                  <YesNoQuestion
                    question="Você possui algum documento médico que comprove essa doença?"
                    helperText="Exemplos: laudo médico, relatório médico, exames ou atestado."
                    showNaoSei
                    onAnswer={(value) => goNext({ laudo: value })}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
