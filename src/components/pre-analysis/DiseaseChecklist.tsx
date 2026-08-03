import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DISEASES = [
  "Neoplasia Maligna (Câncer)",
  "Doença de Parkinson",
  "Alzheimer e Outras Demências",
  "Cardiopatia Grave",
  "Esclerose Múltipla",
  "Cegueira ou Visão Monocular",
  "Nefropatia Grave",
  "Hepatopatia Grave",
  "Hanseníase",
  "Tuberculose Ativa",
  "AIDS (HIV)",
  "Alienação Mental",
  "Paralisia Irreversível e Incapacitante",
  "Acidente em Serviço ou Moléstia Profissional",
  "Contaminação por Radiação",
  "Espondiloartrose Anquilosante",
  "Doença de Paget em Estágio Avançado",
  "Fibrose Cística",
];

const TAIL_OPTIONS = ["Outra doença", "Não encontrei minha doença", "Não sei informar"];

interface DiseaseChecklistProps {
  defaultValue?: string;
  onAnswer: (qualDoenca: string) => void;
}

export function DiseaseChecklist({ defaultValue, onAnswer }: DiseaseChecklistProps) {
  const [selected, setSelected] = useState(defaultValue ?? "");

  return (
    <div>
      <h1 className="text-balance font-display text-2xl font-semibold leading-snug text-selo-900 md:text-3xl">
        Qual doença foi diagnosticada pelo seu médico?
      </h1>

      <div className="mt-6 max-h-[42vh] overflow-y-auto rounded-xl border border-selo-700/15 bg-white">
        <ul>
          {DISEASES.map((disease) => (
            <DiseaseOption
              key={disease}
              label={disease}
              isSelected={selected === disease}
              onSelect={() => setSelected(disease)}
            />
          ))}
        </ul>
      </div>

      <div className="mt-3 space-y-2">
        {TAIL_OPTIONS.map((option) => (
          <DiseaseOption
            key={option}
            label={option}
            isSelected={selected === option}
            onSelect={() => setSelected(option)}
            variant="standalone"
          />
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink/55">
        Não se preocupe caso sua doença não esteja na lista. Nossa
        especialista fará a análise do seu caso.
      </p>

      <Button
        size="lg"
        disabled={!selected}
        onClick={() => onAnswer(selected)}
        className="mt-6 h-12 w-full bg-ouro-500 text-base text-selo-900 hover:bg-ouro-400 disabled:opacity-40"
      >
        Continuar
      </Button>
    </div>
  );
}

function DiseaseOption({
  label,
  isSelected,
  onSelect,
  variant = "list",
}: {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  variant?: "list" | "standalone";
}) {
  return (
    <li className={variant === "standalone" ? "list-none" : "list-none border-b border-selo-700/10 last:border-b-0"}>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className={cn(
          "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium transition-colors",
          variant === "standalone" && "rounded-xl border",
          isSelected
            ? variant === "standalone"
              ? "border-selo-700 bg-selo-50 text-selo-900"
              : "bg-selo-50 text-selo-900"
            : variant === "standalone"
              ? "border-selo-700/20 bg-white text-selo-900 hover:bg-selo-50"
              : "text-selo-900 hover:bg-selo-50",
        )}
      >
        <span>{label}</span>
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
            isSelected ? "border-selo-700 bg-selo-700" : "border-selo-700/25",
          )}
        >
          {isSelected && (
            <svg viewBox="0 0 20 20" className="h-3 w-3 text-paper" fill="none" aria-hidden="true">
              <path
                d="M5 10.5l3 3 7-7.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </button>
    </li>
  );
}
