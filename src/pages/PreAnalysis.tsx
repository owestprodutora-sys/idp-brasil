import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { DiseaseChecklist } from "@/components/pre-analysis/DiseaseChecklist";
import { PreAnalysisDone } from "@/components/pre-analysis/PreAnalysisDone";
import { ProgressBar } from "@/components/pre-analysis/ProgressBar";
import { YesNoQuestion } from "@/components/pre-analysis/YesNoQuestion";
import type { PreAnalysisAnswers } from "@/types/pre-analysis";

// 4 perguntas reais + 1 etapa final de confirmação = 5 etapas
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
    navigate("/cadastro", {
      state: { answers },
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper px-6 py-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <Link
          to="/"
          className="self-start font-display text-base font-semibold text-selo-700"
        >
          IDP <span className="text-ouro-600">Brasil</span>
        </Link>

        <div className="mb-6 mt-2 flex flex-col gap-1.5">
          <span className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-selo-700">
            <CheckIcon />
            Pré-análise 100% gratuita e sem compromisso
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs text-ink/50">
            <LockIcon />
            Seus dados são tratados com segurança e utilizados apenas para
            análise do seu caso.
          </span>
        </div>

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
                    onAnswer={(value) =>
                      goNext({
                        aposentado: value as "sim" | "nao",
                      })
                    }
                  />
                )}

                {step === 1 && (
                  <YesNoQuestion
                    question="No seu pagamento de aposentadoria existe desconto de Imposto de Renda (IR)?"
                    helperText='Exemplo: no extrato ou contracheque aparece um desconto chamado "Imposto de Renda" ou "IR".'
                    showNaoSei
                    onAnswer={(value) =>
                      goNext({
                        tributavel: value,
                      })
                    }
                  />
                )}

                {step === 2 && (
                  <DiseaseChecklist
                    defaultValue={answers.qualDoenca}
                    onAnswer={(qualDoenca) =>
                      goNext({
                        qualDoenca,
                      })
                    }
                  />
                )}

                {step === 3 && (
                  <YesNoQuestion
                    question="Você possui algum documento médico que comprove essa doença?"
                    helperText="Exemplos: laudo médico, relatório médico, exames ou atestado."
                    showNaoSei
                    onAnswer={(value) =>
                      goNext({
                        laudo: value,
                      })
                    }
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5 shrink-0 text-selo-600"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.12" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5 shrink-0 text-ink/40"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4.5"
        y="9"
        width="11"
        height="8"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}