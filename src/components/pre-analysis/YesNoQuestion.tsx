interface YesNoQuestionProps {
  question: string;
  onAnswer: (value: "sim" | "nao") => void;
}

export function YesNoQuestion({ question, onAnswer }: YesNoQuestionProps) {
  return (
    <div>
      <h1 className="text-balance font-display text-2xl font-semibold leading-snug text-selo-900 md:text-3xl">
        {question}
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onAnswer("sim")}
          className="h-16 rounded-xl border-2 border-selo-700 bg-selo-700 text-lg font-semibold text-paper transition-colors hover:bg-selo-600 active:bg-selo-600"
        >
          Sim
        </button>
        <button
          type="button"
          onClick={() => onAnswer("nao")}
          className="h-16 rounded-xl border-2 border-selo-700/25 bg-white text-lg font-semibold text-selo-900 transition-colors hover:border-selo-700/50 hover:bg-selo-50"
        >
          Não
        </button>
      </div>
    </div>
  );
}
