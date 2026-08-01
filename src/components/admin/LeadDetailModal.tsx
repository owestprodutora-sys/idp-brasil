import { MessageCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { documentLabel, statusDetailLabel, yesNoLabel } from "@/lib/answer-labels";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Lead } from "@/types/lead";

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
          <h2 className="font-display text-xl font-semibold text-selo-900">
            {lead.nome}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/50 hover:bg-selo-50 hover:text-selo-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <Info label="Telefone" value={lead.whatsapp} />
          <Info label="Cidade" value={`${lead.cidade} / ${lead.estado}`} />
        </dl>

        <div className="mt-6 space-y-4 border-t border-selo-700/10 pt-6 text-sm">
          <Info label="Aposentado" value={yesNoLabel(lead.aposentado)} />
          <Info
            label="Há desconto de Imposto de Renda"
            value={yesNoLabel(lead.tributavel)}
          />
          <Info label="Doença informada" value={`🩺 ${lead.qual_doenca ?? "—"}`} />
          <Info label="Documentação médica" value={documentLabel(lead.laudo)} />
          <Info label="Status" value={statusDetailLabel(lead.status)} />
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
