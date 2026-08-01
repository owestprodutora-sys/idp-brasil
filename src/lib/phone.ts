/**
 * Aplica a máscara (00) 00000-0000 (ou (00) 0000-0000 pra fixo) enquanto o
 * usuário digita. Sempre recebe o valor bruto do input e devolve o valor
 * formatado — os dígitos "extras" que não cabem no padrão são descartados.
 */
export function formatPhoneInput(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Um telefone brasileiro válido tem DDD + 8 dígitos (fixo) ou + 9 dígitos (celular). */
export function isValidBrazilianPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}
