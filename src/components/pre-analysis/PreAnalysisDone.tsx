import { Button } from "@/components/ui/button";

interface PreAnalysisDoneProps {
  onContinue: () => void;
}

export function PreAnalysisDone({ onContinue }: PreAnalysisDoneProps) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-selo-50 text-selo-700">
        <CheckIcon />
      </span>

      <h1 className="mt-5 text-balance font-display text-2xl font-semibold leading-snug text-selo-900 md:text-3xl">
        Ótimo.
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink/65">
        Agora precisamos apenas dos seus dados para que nossa especialista
        possa analisar seu caso.
      </p>

      <Button
        size="lg"
        onClick={onContinue}
        className="mt-8 h-12 w-full bg-ouro-500 text-base text-selo-900 hover:bg-ouro-400"
      >
        Continuar
      </Button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M6 12.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
