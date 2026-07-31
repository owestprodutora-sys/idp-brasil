import { MessageCircle, X } from "lucide-react";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Lead } from "@/types/lead";

const YES_NO_LABELS: Record<string, string> = {
  sim: "Sim",
  nao: "Não",
};

function yesNo(value: string | null) {
  if (!value) return "—";
  return YES_NO_LABELS[value] ?? value;
}

export function LeadDetailModal({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  const whatsappLink = buildWhatsAppLink(
    lead.whatsapp,
    `Olá, ${lead.nome}! Aqui é a equipe da IDP Brasil, sobre a sua pré-análise de isenção do Imposto de Renda.`,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-selo-900/40 p-0 sm:items-center sm:p-6">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-selo-900">
              {lead.nome}
            </h2>
            <div className="mt-1.5">
              <StatusBadge status={lead.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/50 hover:bg-selo-50 hover:text-selo-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <Info label="Telefone" value={lead.whatsapp} />
          <Info label="Cidade" value={`${lead.cidade} / ${lead.estado}`} />
        </dl>

        <div className="mt-6 border-t border-selo-700/10 pt-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-selo-700">
            Respostas da Pré-Análise
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <Info label="Aposentado(a)" value={yesNo(lead.aposentado)} />
            <Info label="Aposentadoria tributável" value={yesNo(lead.tributavel)} />
            <Info label="Possui doença prevista em lei" value={yesNo(lead.doenca)} />
            <Info label="Qual doença" value={lead.qual_doenca ?? "—"} />
            <Info label="Possui laudo médico" value={yesNo(lead.laudo)} />
          </dl>
        </div>

        <Button
          asChild
          size="lg"
          className="mt-8 h-12 w-full bg-selo-700 text-base text-paper hover:bg-selo-600"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            Abrir WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink/45">{label}</dt>
      <dd className="mt-0.5 font-medium text-selo-900">{value}</dd>
    </div>
  );
}
