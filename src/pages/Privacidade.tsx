import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { companyInfo } from "@/lib/company-info";

export default function Privacidade() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[136px]">
        <div className="mx-auto w-full max-w-3xl px-6 pb-20">
          <h1 className="font-display text-3xl font-semibold text-selo-900 md:text-4xl">
            Política de Privacidade
          </h1>

          <p className="mt-4 rounded-xl border border-dashed border-ouro-500/50 bg-ouro-50/60 px-5 py-4 text-sm leading-relaxed text-ink/70">
            Este documento tem caráter institucional e informativo. Os textos
            abaixo descrevem, em linhas gerais, como o {companyInfo.nomeFantasia}{" "}
            trata os dados fornecidos por seus visitantes e clientes, e estão
            sujeitos a atualização após revisão jurídica específica.
          </p>

          <div className="mt-10 space-y-8">
            <Section title="1. Quem somos">
              <p>
                O {companyInfo.nomeFantasia} é responsável pelo tratamento dos
                dados coletados neste site, incluindo as informações
                fornecidas na pré-análise gratuita e no cadastro de contato.
              </p>
            </Section>

            <Section title="2. Quais dados coletamos">
              <p>
                Coletamos as informações que você nos fornece voluntariamente
                ao preencher a pré-análise e o formulário de contato, como
                nome, WhatsApp, cidade, estado e respostas relacionadas à sua
                situação previdenciária e de saúde.
              </p>
            </Section>

            <Section title="3. Como usamos essas informações">
              <p>
                Os dados são usados exclusivamente para realizar a análise
                preliminar do seu caso e para que nossa equipe possa entrar em
                contato com você a respeito da sua solicitação.
              </p>
            </Section>

            <Section title="4. Compartilhamento de dados">
              <p>
                Não vendemos nem compartilhamos seus dados com terceiros para
                fins de marketing. O compartilhamento só ocorre quando
                necessário para a condução do seu caso, sempre com o seu
                conhecimento.
              </p>
            </Section>

            <Section id="lgpd" title="5. Seus direitos (LGPD)">
              <p>
                Nos termos da Lei Geral de Proteção de Dados (Lei nº
                13.709/2018), você pode solicitar a qualquer momento a
                confirmação, o acesso, a correção ou a exclusão dos seus
                dados pessoais, além de revogar o consentimento dado.
              </p>
            </Section>

            <Section title="6. Segurança">
              <p>
                Adotamos medidas técnicas e organizacionais razoáveis para
                proteger seus dados contra acesso não autorizado, perda ou
                alteração indevida.
              </p>
            </Section>

            <Section title="7. Contato">
              <p>
                Dúvidas sobre esta política podem ser enviadas para{" "}
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="font-medium text-selo-700 underline underline-offset-2"
                >
                  {companyInfo.email}
                </a>
                .
              </p>
            </Section>
          </div>

          <Link
            to="/"
            className="mt-12 inline-block text-sm font-medium text-selo-700 underline underline-offset-2"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-display text-lg font-semibold text-selo-900">
        {title}
      </h2>
      <div className="mt-2 text-sm leading-relaxed text-ink/70">
        {children}
      </div>
    </section>
  );
}
