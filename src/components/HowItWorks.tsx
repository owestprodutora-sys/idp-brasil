import { Section } from "@/components/Section";

const steps = [
  {
    number: "1",
    title: "Pré-Análise",
    description:
      "Responda algumas perguntas para verificarmos seu possível enquadramento.",
  },
  {
    number: "2",
    title: "Análise da Especialista",
    description:
      "As informações serão avaliadas para orientar os próximos passos.",
  },
  {
    number: "3",
    title: "Processo",
    description:
      "Caso exista possibilidade de direito, você receberá orientação sobre o procedimento.",
  },
];

export function HowItWorks() {
  return (
    <Section id="como-funciona">
      <h2 className="font-display text-3xl font-semibold text-selo-900 md:text-4xl">
        Como funciona
      </h2>

      <ol className="mt-10 grid gap-6 md:grid-cols-3 md:gap-4">
        {steps.map((step, index) => (
          <li key={step.number} className="relative flex gap-4 md:flex-col md:gap-3">
            <div className="flex flex-col items-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-selo-700 font-mono text-sm font-semibold text-paper">
                {step.number}
              </span>
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mt-1 h-full w-px flex-1 bg-selo-700/20 md:mt-2 md:h-px md:w-full md:flex-none md:absolute md:left-[calc(50%+20px)] md:top-5 md:right-[calc(-50%+20px)]"
                />
              )}
            </div>
            <div className="pb-6 md:pb-0 md:text-center">
              <h3 className="font-display text-lg font-semibold text-selo-900">
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/65">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
