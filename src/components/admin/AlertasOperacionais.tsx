import { isAguardandoDocumentoAtrasado, isSemContatoRecente } from "@/lib/crm-config";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types/lead";

// TASK-007B (item 4) — Bloco "Atenção necessária". São só indicadores
// visuais lidos a partir dos leads já carregados; nenhuma automação
// externa (e-mail, WhatsApp, etc.) é disparada por aqui.
export function AlertasOperacionais({ leads }: { leads: Lead[] }) {
  const novosAguardandoContato = leads.filter((lead) => lead.status === "NOVO_LEAD");
  const aguardandoDocumentoAtrasado = leads.filter((lead) =>
    isAguardandoDocumentoAtrasado(lead.status, lead.ultimo_contato, lead.created_at),
  );
  const semAtualizacaoRecente = leads.filter((lead) =>
    isSemContatoRecente(lead.status, lead.ultimo_contato),
  );

  const alertas = [
    {
      emoji: "🔴",
      texto: "leads novos aguardando contato",
      quantidade: novosAguardandoContato.length,
    },
    {
      emoji: "🟣",
      texto: "clientes aguardando documento há muitos dias",
      quantidade: aguardandoDocumentoAtrasado.length,
    },
    {
      emoji: "🟡",
      texto: "leads sem atualização recente",
      quantidade: semAtualizacaoRecente.length,
    },
  ].filter((alerta) => alerta.quantidade > 0);

  return (
    <div className="rounded-2xl border border-selo-700/10 bg-white px-5 py-5">
      <h2 className="font-display text-base font-semibold text-selo-900">
        Atenção necessária
      </h2>

      {alertas.length === 0 ? (
        <p className="mt-2 text-sm text-ink/50">
          Nenhum ponto de atenção no momento — operação em dia.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {alertas.map((alerta) => (
            <li
              key={alerta.texto}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                "border-ouro-500/30 bg-ouro-50 text-selo-900",
              )}
            >
              <span aria-hidden="true">{alerta.emoji}</span>
              <span>
                <strong className="font-semibold">{alerta.quantidade}</strong>{" "}
                {alerta.texto}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
