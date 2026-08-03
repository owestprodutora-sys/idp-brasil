import { Lock } from "lucide-react";

export function FinanceiroPlaceholder({ clientesConvertidos }: { clientesConvertidos: number }) {
  const items = [
    { label: "Clientes convertidos", value: String(clientesConvertidos) },
    { label: "Comissão prevista", value: "Em breve" },
    { label: "Pagamentos recebidos", value: "Em breve" },
    { label: "Valores pendentes", value: "Em breve" },
  ];

  return (
    <div className="rounded-2xl border border-dashed border-selo-700/20 bg-white px-5 py-5">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-ink/40" />
        <h2 className="font-display text-base font-semibold text-selo-900">Financeiro</h2>
        <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-medium text-ink/45">
          Em desenvolvimento
        </span>
      </div>
      <p className="mt-1 text-xs text-ink/50">
        Cobrança e pagamentos ainda não foram implementados — esta área está
        preparada para receber esses dados nas próximas etapas.
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs uppercase tracking-wide text-ink/40">{item.label}</dt>
            <dd className="mt-0.5 font-display text-lg font-semibold text-ink/70">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
