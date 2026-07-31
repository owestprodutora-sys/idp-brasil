import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DiseaseSelect } from "@/components/pre-analysis/DiseaseSelect";
import { PreAnalysisDone } from "@/components/pre-analysis/PreAnalysisDone";
import { ProgressBar } from "@/components/pre-analysis/ProgressBar";
import { YesNoQuestion } from "@/components/pre-analysis/YesNoQuestion";
import type { PreAnalysisAnswers } from "@/types/pre-analysis";

type YesNo = "sim" | "nao";

const TOTAL_QUESTIONS = 5;

export default function PreAnalysis() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<Partial<PreAnalysisAnswers>>({});

  const percent = finished ? 100 : ((step + 1) / TOTAL_QUESTIONS) * 100;

  function goNext(patch: Partial<PreAnalysisAnswers>) {
    const updated = { ...answers, ...patch };
    setAnswers(updated);

    if (step === TOTAL_QUESTIONS - 1) {
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
        <div className="flex items-center gap-4">
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
            stepLabel={finished ? "Concluído" : `Pergunta ${step + 1} de ${TOTAL_QUESTIONS}`}
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
                    onAnswer={(value: YesNo) => goNext({ aposentado: value })}
                  />
                )}
                {step === 1 && (
                  <YesNoQuestion
                    question="Recebe aposentadoria tributável?"
                    onAnswer={(value: YesNo) => goNext({ tributavel: value })}
                  />
                )}
                {step === 2 && (
                  <YesNoQuestion
                    question="Possui alguma doença prevista em lei?"
                    onAnswer={(value: YesNo) => goNext({ doenca: value })}
                  />
                )}
                {step === 3 && (
                  <DiseaseSelect
                    question="Qual doença?"
                    defaultValue={answers.qualDoenca}
                    onAnswer={(value) => goNext({ qualDoenca: value })}
                  />
                )}
                {step === 4 && (
                  <YesNoQuestion
                    question="Já possui laudo médico?"
                    onAnswer={(value: YesNo) => goNext({ laudo: value })}
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
