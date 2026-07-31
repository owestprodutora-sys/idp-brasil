import { Section } from "@/components/Section";

const conditions = [
  "Câncer",
  "Parkinson",
  "Alzheimer",
  "Cardiopatia Grave",
  "Visão Monocular",
  "Esclerose Múltipla",
];

export function Eligibility() {
  return (
    <Section id="quem-pode-ter-direito" className="bg-selo-50/60">
      <h2 className="font-display text-3xl font-semibold text-selo-900 md:text-4xl">
        Quem pode ter direito?
      </h2>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {conditions.map((condition) => (
          <div
            key={condition}
            className="flex items-center gap-3 rounded-xl border border-selo-700/10 bg-white px-5 py-4"
          >
            <CheckMark />
            <span className="font-medium text-selo-900">{condition}</span>
          </div>
        ))}

        <div className="flex items-center gap-3 rounded-xl border border-dashed border-ouro-500/50 bg-ouro-50/60 px-5 py-4 sm:col-span-2 lg:col-span-3">
          <span className="font-mono text-lg text-ouro-600">+</span>
          <span className="font-medium text-selo-900">
            Outras doenças previstas em lei.
          </span>
        </div>
      </div>
    </Section>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-selo-600" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.12" />
      <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
