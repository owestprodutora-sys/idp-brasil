import { Link } from "react-router-dom";

import { companyInfo } from "@/lib/company-info";

export function Footer() {
  const hasEmpresaInfo = Boolean(companyInfo.cnpj || companyInfo.endereco);
  const hasPhoneInfo = Boolean(companyInfo.telefone || companyInfo.whatsapp);

  return (
    <footer className="border-t border-selo-700/10 bg-paper py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-base font-semibold text-selo-700">
            IDP <span className="text-ouro-600">Brasil</span>
          </span>
          <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-ink/60">
            {companyInfo.tagline}
          </p>
        </div>

        {hasEmpresaInfo && (
          <div>
            <h3 className="text-sm font-semibold text-selo-900">Empresa</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink/60">
              {companyInfo.cnpj && <li>CNPJ {companyInfo.cnpj}</li>}
              {companyInfo.endereco && (
                <li>
                  {companyInfo.endereco}
                  {(companyInfo.cidade || companyInfo.estado) && (
                    <>
                      <br />
                      {[companyInfo.cidade, companyInfo.estado].filter(Boolean).join(" · ")}
                    </>
                  )}
                </li>
              )}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-selo-900">Contato</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li>
              <a href={`mailto:${companyInfo.email}`} className="hover:text-selo-700">
                {companyInfo.email}
              </a>
            </li>
            {companyInfo.telefone && <li>Tel. {companyInfo.telefone}</li>}
            {companyInfo.whatsapp && <li>WhatsApp {companyInfo.whatsapp}</li>}
            {!hasPhoneInfo && (
              <li className="text-ink/40">Atendimento via formulário do site</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-selo-900">Institucional</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li>
              <Link to="/privacidade" className="hover:text-selo-700">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link to="/privacidade#lgpd" className="hover:text-selo-700">
                LGPD
              </Link>
            </li>
            <li>
              <a href={`mailto:${companyInfo.email}`} className="hover:text-selo-700">
                Contato
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
