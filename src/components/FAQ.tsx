import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Section } from "@/components/Section";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Quem tem direito?",
    answer:
      "Aposentados ou pensionistas com uma das doenças graves previstas em lei podem ter direito à isenção do Imposto de Renda sobre os proventos.",
  },
  {
    question: "Quanto custa?",
    answer:
      "A pré-análise é 100% gratuita. Você só saberá o custo do processo depois de conversar com a nossa especialista.",
  },
  {
    question: "Quanto tempo demora?",
    answer:
      "O tempo varia caso a caso, conforme a doença, o órgão responsável e a documentação disponível.",
  },
  {
    question: "Preciso entrar na Justiça?",
    answer:
      "Nem sempre. Em muitos casos o pedido é feito administrativamente. Nossa especialista avalia o melhor caminho para o seu caso.",
  },
  {
    question: "Posso recuperar valores?",
    answer:
      "Sim. Além de parar de pagar o imposto, você pode ter direito à restituição de valores pagos indevidamente nos últimos anos.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq">
      <h2 className="font-display text-3xl font-semibold text-selo-900 md:text-4xl">
        Perguntas Frequentes
      </h2>

      <div className="mt-8 divide-y divide-selo-700/10 rounded-2xl border border-selo-700/10 bg-white">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-display text-base font-semibold text-selo-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-selo-600 transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-ink/65">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
