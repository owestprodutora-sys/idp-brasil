import { Link } from "react-router-dom";

import { DocumentSeal } from "@/components/DocumentSeal";
import { LegalBadge } from "@/components/LegalBadge";
import { Button } from "@/components/ui/button";
import { trackViewContent } from "@/lib/analytics";

export function Hero() {
  return (
    <section className="pt-[104px] md:pt-[136px]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-16 md:grid-cols-2 md:items-center md:gap-12 md:pb-24">
        <div className="order-1">
          <LegalBadge />

          <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.12] text-selo-900 md:text-5xl">
            Você pode ter direito à isenção do Imposto de Renda na
            aposentadoria.
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/70">
            Faça uma pré-análise gratuita e descubra se o seu caso pode se
            enquadrar na legislação.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 bg-ouro-500 px-7 text-base text-selo-900 hover:bg-ouro-400"
            >
              <Link
                to="/pre-analise"
                onClick={() => trackViewContent("hero_cta_pre_analise")}
              >
                Fazer Pré-Análise Gratuita
              </Link>
            </Button>

            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/60">
              <li className="flex items-center gap-1.5">
                <CheckMark /> Gratuita
              </li>
              <li className="flex items-center gap-1.5">
                <CheckMark /> Menos de 2 minutos
              </li>
              <li className="flex items-center gap-1.5">
                <CheckMark /> Sem compromisso
              </li>
            </ul>
          </div>
        </div>

        <div className="order-2 mx-auto w-full max-w-[360px] md:max-w-none">
          <DocumentSeal />
        </div>
      </div>
    </section>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-selo-600" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.12" />
      <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
