import { Section } from "@/components/Section";

// Condições mais reconhecidas pelo público em geral — recebem destaque
// visual em card para leitura rápida.
const featuredConditions = [
  "Câncer",
  "Parkinson",
  "Alzheimer e Outras Demências",
  "Cardiopatia Grave",
  "Cegueira ou Visão Monocular",
  "Esclerose Múltipla",
];

// Demais condições previstas em lei — listadas de forma compacta para não
// sobrecarregar a seção com muitos cards repetidos.
const otherConditions = [
  "Doença Grave nos Rins",
  "Doença Grave no Fígado",
  "Hanseníase",
  "Tuberculose Ativa",
  "AIDS",
  "Paralisia Irreversível",
  "Acidente em Serviço ou Moléstia Profissional",
  "Contaminação por Radiação",
  "Espondiloartrose Anquilosante",
  "Doença de Paget em Estágio Avançado",
];

export function Eligibility() {
  return (
    <Section id="quem-pode-ter-direito" className="bg-selo-50/60">
      <h2 className="font-display text-3xl font-semibold text-selo-900 md:text-4xl">
        Quem pode ter direito?
      </h2>
      <p className="mt-3 max-w-xl text-ink/60">
        Aposentados e pensionistas diagnosticados com uma das doenças graves
        previstas em lei podem ter direito à isenção.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredConditions.map((condition) => (
          <div
            key={condition}
            className="flex items-center gap-3 rounded-xl border border-selo-700/10 bg-white px-5 py-4"
          >
            <CheckMark />
            <span className="font-medium text-selo-900">{condition}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-selo-700/10 bg-white/60 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-selo-700/70">
          Também previstas em lei
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {otherConditions.map((condition) => (
            <span
              key={condition}
              className="rounded-full border border-selo-700/15 bg-selo-50 px-3.5 py-1.5 text-sm text-selo-900"
            >
              {condition}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink/60">
        Não encontrou sua condição? Cada caso é analisado individualmente
        conforme a legislação vigente.
      </p>
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
