import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { BRAZILIAN_STATES } from "@/lib/brazilian-states";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { PreAnalysisAnswers } from "@/types/pre-analysis";

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers as Partial<PreAnalysisAnswers> | undefined;

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [lgpdAceito, setLgpdAceito] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFormValid =
    nome.trim().length > 0 &&
    whatsapp.trim().length > 0 &&
    cidade.trim().length > 0 &&
    estado.length > 0 &&
    lgpdAceito;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await supabase.from("leads").insert({
      nome: nome.trim(),
      whatsapp: whatsapp.trim(),
      cidade: cidade.trim(),
      estado,
      aposentado: answers?.aposentado ?? null,
      tributavel: answers?.tributavel ?? null,
      doenca: answers?.doenca ?? null,
      qual_doenca: answers?.qualDoenca ?? null,
      laudo: answers?.laudo ?? null,
      lgpd_aceito: lgpdAceito,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(
        "Não foi possível enviar sua pré-análise agora. Tente novamente em instantes.",
      );
      return;
    }

    navigate("/obrigado");
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="font-display text-lg font-semibold text-selo-700">
          IDP <span className="text-ouro-600">Brasil</span>
        </Link>

        <h1 className="mt-6 text-balance font-display text-2xl font-semibold leading-snug text-selo-900 md:text-3xl">
          Falta pouco. Seus dados para a análise da especialista.
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Usamos essas informações só pra sua pré-análise ser avaliada pela
          Adrieli e pra entrarmos em contato com você.
        </p>

        {!isSupabaseConfigured && (
          <p className="mt-4 rounded-lg border border-ouro-500/40 bg-ouro-50 px-4 py-3 text-sm text-selo-900">
            O Supabase ainda não está configurado neste ambiente (arquivo
            `.env`). O formulário funciona, mas o envio vai falhar até isso
            ser preenchido.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <Field label="Nome" htmlFor="nome">
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Seu nome completo"
              className={inputClassName}
            />
          </Field>

          <Field label="WhatsApp" htmlFor="whatsapp">
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              placeholder="(00) 00000-0000"
              className={inputClassName}
            />
          </Field>

          <Field label="Cidade" htmlFor="cidade">
            <input
              id="cidade"
              name="cidade"
              type="text"
              autoComplete="address-level2"
              value={cidade}
              onChange={(event) => setCidade(event.target.value)}
              placeholder="Sua cidade"
              className={inputClassName}
            />
          </Field>

          <Field label="Estado" htmlFor="estado">
            <select
              id="estado"
              name="estado"
              value={estado}
              onChange={(event) => setEstado(event.target.value)}
              className={inputClassName}
            >
              <option value="" disabled>
                Selecione seu estado
              </option>
              {BRAZILIAN_STATES.map((state) => (
                <option key={state.uf} value={state.uf}>
                  {state.name}
                </option>
              ))}
            </select>
          </Field>

          <label className="flex items-start gap-3 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={lgpdAceito}
              onChange={(event) => setLgpdAceito(event.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-selo-700/30 text-selo-700 focus:ring-selo-700"
            />
            <span>
              Autorizo o uso dos meus dados para contato sobre minha
              pré-análise, conforme a LGPD.
            </span>
          </label>

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid || isSubmitting}
            className="h-12 w-full bg-ouro-500 text-base text-selo-900 hover:bg-ouro-400 disabled:opacity-40"
          >
            {isSubmitting ? "Enviando..." : "Enviar Pré-Análise"}
          </Button>
        </form>
      </div>
    </div>
  );
}

const inputClassName =
  "h-12 w-full rounded-xl border-2 border-selo-700/25 bg-white px-4 text-base text-selo-900 placeholder:text-ink/35 focus:border-selo-700 focus:outline-none";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-selo-900">
        {label}
      </label>
      {children}
    </div>
  );
}
