import { MessageCircle } from "lucide-react";

import { companyInfo } from "@/lib/company-info";
import { trackContact } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const WHATSAPP_MESSAGE =
  "Olá, gostaria de saber mais sobre a pré-análise de isenção de Imposto de Renda.";

interface WhatsAppFloatButtonProps {
  /** Sobe o botão no mobile para não cobrir uma barra fixa inferior (ex.: CTA da Home). */
  raised?: boolean;
}

export function WhatsAppFloatButton({ raised = false }: WhatsAppFloatButtonProps) {
  // Segue o mesmo padrão de src/lib/company-info.ts: sem dado real, sem componente.
  if (!companyInfo.whatsapp) return null;

  const href = buildWhatsAppLink(companyInfo.whatsapp, WHATSAPP_MESSAGE);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a IDP Brasil no WhatsApp"
      onClick={() => trackContact("whatsapp_float_button")}
      className={cn(
        "fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-selo-700 text-paper shadow-lg shadow-selo-900/25 transition-transform hover:scale-105 hover:bg-selo-600 active:scale-95",
        raised ? "bottom-28 md:bottom-6" : "bottom-6",
      )}
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="sr-only">Falar no WhatsApp</span>
    </a>
  );
}
