import { Headset, Laptop, ShieldCheck, Wallet } from "lucide-react";
import type { ComponentType } from "react";

import { Section } from "@/components/Section";

interface BenefitItem {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const benefits: BenefitItem[] = [
  {
    icon: ShieldCheck,
    title: "Isenção do IR",
    description:
      "Possibilidade de deixar de pagar Imposto de Renda sobre aposentadoria quando houver enquadramento legal.",
  },
  {
    icon: Wallet,
    title: "Restituição",
    description:
      "Em alguns casos, pode existir possibilidade de recuperar valores pagos anteriormente.",
  },
  {
    icon: Headset,
    title: "Atendimento Digital",
    description: "Todo o processo pode ser acompanhado de forma digital.",
  },
  {
    icon: Laptop,
    title: "Especialista",
    description:
      "Análise realizada por especialista responsável pelo atendimento.",
  },
];

export function Benefits() {
  return (
    <Section id="beneficios">
      <h2 className="font-display text-3xl font-semibold text-selo-900 md:text-4xl">
        Você pode ter direito a:
      </h2>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-selo-700/10 bg-white p-6 shadow-sm"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-selo-50 text-selo-700">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-selo-900">
              {title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/65">
              {description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
