import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, MessageCircle, ShieldCheck } from "lucide-react";

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

        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-selo-700/20 bg-selo-50 px-4 py-1.5 text-sm font-medium text-selo-700">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Retorno em até {companyInfo.prazoRetornoUteis}
        </span>

        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-selo-700/15 bg-selo-50/50 px-4 py-4 text-left">
          <NextStep
            icon={<ClipboardCheck className="h-4 w-4" />}
            text="Sua pré-análise é revisada com sigilo pela especialista responsável."
          />
          <NextStep
            icon={<MessageCircle className="h-4 w-4" />}
            text={`Você recebe um retorno pelo WhatsApp em até ${companyInfo.prazoRetornoUteis}.`}
          />
          <NextStep
            icon={<ShieldCheck className="h-4 w-4" />}
            text="Nenhum compromisso é assumido antes de você falar com a especialista."
          />
        </div>
      </div>

      <Button asChild variant="outline" className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5">
        <Link to="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}

function NextStep({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-ink/70">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-selo-700/10 text-selo-700">
        {icon}
      </span>
      <span>{text}</span>
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
