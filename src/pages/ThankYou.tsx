import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { companyInfo } from "@/lib/company-info";

export default function ThankYou() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-paper px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-selo-700 text-paper">
        <CheckIcon />
      </span>

      <div className="max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-selo-900 md:text-3xl">
          Recebemos sua solicitação.
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink/65">
          Nossa especialista analisará suas respostas e entrará em contato.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/50">
          Prazo médio de retorno: até {companyInfo.prazoRetornoUteis}.
        </p>
      </div>

      <Button asChild variant="outline" className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5">
        <Link to="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
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
