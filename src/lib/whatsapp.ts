export function buildWhatsAppLink(rawPhone: string, message?: string) {
  const digits = rawPhone.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${withCountryCode}${query}`;
}
