import { useState } from "react";

import { Button } from "@/components/ui/button";

const DISEASES = [
  "Câncer",
  "Parkinson",
  "Alzheimer",
  "Cardiopatia Grave",
  "Visão Monocular",
  "Esclerose Múltipla",
  "Outra doença prevista em lei",
];

interface DiseaseSelectProps {
  question: string;
  defaultValue?: string;
  onAnswer: (value: string) => void;
}

export function DiseaseSelect({ question, defaultValue, onAnswer }: DiseaseSelectProps) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <div>
      <h1 className="text-balance font-display text-2xl font-semibold leading-snug text-selo-900 md:text-3xl">
        {question}
      </h1>

      <select
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="mt-8 h-14 w-full rounded-xl border-2 border-selo-700/25 bg-white px-4 text-base text-selo-900 focus:border-selo-700 focus:outline-none"
      >
        <option value="" disabled>
          Selecione uma opção
        </option>
        {DISEASES.map((disease) => (
          <option key={disease} value={disease}>
            {disease}
          </option>
        ))}
      </select>

      <Button
        size="lg"
        disabled={!value}
        onClick={() => onAnswer(value)}
        className="mt-6 h-12 w-full bg-ouro-500 text-base text-selo-900 hover:bg-ouro-400 disabled:opacity-40"
      >
        Continuar
      </Button>
    </div>
  );
}
