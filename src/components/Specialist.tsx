import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";

export function Specialist() {
  return (
    <Section id="especialista" className="bg-selo-50/60">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-selo-700 font-display text-2xl font-semibold text-paper">
          AD
        </span>

        <div>
          <h3 className="font-display text-xl font-semibold text-selo-900">
            Adrieli Drewlo Dias
          </h3>
          <p className="text-sm font-medium uppercase tracking-wide text-ouro-600">
            Especialista Tributária
          </p>
        </div>

        <p className="max-w-md text-sm leading-relaxed text-ink/65">
          Especialista dedicada a ajudar aposentados a entenderem seus
          direitos e conquistarem a isenção do Imposto de Renda.
        </p>

        <Button variant="outline" className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5">
          Conheça mais
        </Button>
      </div>
    </Section>
  );
}
