import { Link } from "react-router-dom";

import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <Section id="cta-final" className="bg-selo-900" containerClassName="text-center">
      <h2 className="font-display text-3xl font-semibold text-paper md:text-4xl">
        Descubra agora se você pode ter direito à isenção.
      </h2>

      <div className="mt-8 flex justify-center">
        <Button
          asChild
          size="lg"
          className="h-12 bg-ouro-500 px-8 text-base text-selo-900 hover:bg-ouro-400"
        >
          <Link to="/pre-analise">Fazer Pré-Análise Gratuita</Link>
        </Button>
      </div>
    </Section>
  );
}
