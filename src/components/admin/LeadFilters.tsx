import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/lib/crm-config";

export type DateFilter = "todos" | "hoje" | "7dias" | "30dias";

export interface LeadFiltersValue {
  status: string;
  prioridade: string;
  data: DateFilter;
  // Ligado pelos cards clicáveis do dashboard (não tem controle próprio
  // no menu de filtros — ver DashboardCards).
  semContatoRecente: boolean;
}

export function LeadFilters({
  value,
  onChange,
}: {
  value: LeadFiltersValue;
  onChange: (value: LeadFiltersValue) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={value.status}
        onChange={(e) => onChange({ ...value, status: e.target.value })}
        className="h-9 rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
      >
        <option value="todos">Todos os status</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.emoji} {option.label}
          </option>
        ))}
      </select>

      <select
        value={value.prioridade}
        onChange={(e) => onChange({ ...value, prioridade: e.target.value })}
        className="h-9 rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
      >
        <option value="todas">Todas as prioridades</option>
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.emoji ? `${option.emoji} ${option.label}` : option.label}
          </option>
        ))}
      </select>

      <select
        value={value.data}
        onChange={(e) => onChange({ ...value, data: e.target.value as DateFilter })}
        className="h-9 rounded-lg border border-selo-700/20 bg-white px-3 text-sm text-selo-900 focus:border-selo-700 focus:outline-none"
      >
        <option value="todos">Qualquer data</option>
        <option value="hoje">Registrados hoje</option>
        <option value="7dias">Últimos 7 dias</option>
        <option value="30dias">Últimos 30 dias</option>
      </select>
    </div>
  );
}
