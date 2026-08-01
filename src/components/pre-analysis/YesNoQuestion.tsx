type Answer = "sim" | "nao" | "nao_sei";

interface YesNoQuestionProps {
  question: string;
  helperText?: string;
  showNaoSei?: boolean;
  onAnswer: (value: Answer) => void;
}

export function YesNoQuestion({
  question,
  helperText,
  showNaoSei = false,
  onAnswer,
}: YesNoQuestionProps) {
  return (
    <div>
      <h1 className="text-balance font-display text-2xl font-semibold leading-snug text-selo-900 md:text-3xl">
        {question}
      </h1>

      {helperText && (
        <p className="mt-2 text-sm leading-relaxed text-ink/55">{helperText}</p>
      )}

      {showNaoSei ? (
        <div className="mt-8 flex flex-col gap-3">
          <OptionButton label="Sim" onClick={() => onAnswer("sim")} emphasis />
          <OptionButton label="Não" onClick={() => onAnswer("nao")} />
          <OptionButton label="Não sei" onClick={() => onAnswer("nao_sei")} muted />
        </div>
      ) : (
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
      )}
    </div>
  );
}

function OptionButton({
  label,
  onClick,
  emphasis = false,
  muted = false,
}: {
  label: string;
  onClick: () => void;
  emphasis?: boolean;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        emphasis
          ? "h-14 rounded-xl border-2 border-selo-700 bg-selo-700 text-base font-semibold text-paper transition-colors hover:bg-selo-600"
          : muted
            ? "h-14 rounded-xl border-2 border-transparent bg-transparent text-base font-medium text-ink/50 transition-colors hover:bg-selo-50 hover:text-selo-700"
            : "h-14 rounded-xl border-2 border-selo-700/25 bg-white text-base font-semibold text-selo-900 transition-colors hover:border-selo-700/50 hover:bg-selo-50"
      }
    >
      {label}
    </button>
  );
}
