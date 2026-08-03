import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BRAZILIAN_STATES } from "@/lib/brazilian-states";
import { formatPhoneInput, isValidBrazilianPhone } from "@/lib/phone";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { PreAnalysisAnswers } from "@/types/pre-analysis";

// Mesma chave usada em ThankYou.tsx. Mantenha os dois valores idênticos.
const LEAD_TRACKED_KEY = "idp_lead_tracked";

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers as Partial<PreAnalysisAnswers> | undefined;

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappTouched, setWhatsappTouched] = useState(false);
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [lgpdAceito, setLgpdAceito] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ao entrar na página de cadastro, um novo processo de geração de lead
  // está começando — libera a blindagem de /obrigado para que, se este
  // envio for concluído com sucesso, a nova chegada em /obrigado gere uma
  // nova conversão (e não seja bloqueada por um lead anterior na mesma aba).
  useEffect(() => {
    try {
      sessionStorage.removeItem(LEAD_TRACKED_KEY);
    } catch {
      // sessionStorage indisponível — nada a fazer aqui; não afeta o
      // disparo do generate_lead em si, apenas a blindagem contra refresh.
    }
  }, []);

  const isWhatsappValid = isValidBrazilianPhone(whatsapp);

  const isFormValid =
    nome.trim().length > 0 &&
    isWhatsappValid &&
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
      qual_doenca: answers?.qualDoenca ?? null,
      laudo: answers?.laudo ?? null,
      lgpd_aceito: lgpdAceito,
    });

    setIsSubmitting(false);

    if (error) {
      console.error("[Supabase] Erro ao inserir lead:", error);
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
          Finalize sua pré-análise gratuita
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Informe seus dados para que nossa especialista possa avaliar suas
          respostas e entrar em contato. Sem custo e sem compromisso.
        </p>

        <div className="mt-5 flex flex-col gap-2 rounded-xl border border-selo-700/15 bg-selo-50/60 px-4 py-3">
          <TrustItem
            icon={<Sparkles className="h-4 w-4" />}
            text="100% gratuito, sem compromisso de contratação"
          />
          <TrustItem
            icon={<Lock className="h-4 w-4" />}
            text="Seus dados são protegidos conforme a LGPD"
          />
          <TrustItem
            icon={<ShieldCheck className="h-4 w-4" />}
            text="Análise conduzida com sigilo pela especialista responsável"
          />
        </div>

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
              required
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
              required
              value={whatsapp}
              onChange={(event) => setWhatsapp(formatPhoneInput(event.target.value))}
              onBlur={() => setWhatsappTouched(true)}
              placeholder="(00) 00000-0000"
              maxLength={15}
              aria-invalid={whatsappTouched && !isWhatsappValid}
              className={cn(
                inputClassName,
                whatsappTouched && !isWhatsappValid && "border-destructive focus:border-destructive",
              )}
            />
            {whatsappTouched && whatsapp.length > 0 && !isWhatsappValid && (
              <p className="mt-1.5 text-sm text-destructive" role="alert">
                Confira o número com DDD, ex.: (55) 99999-9999.
              </p>
            )}
          </Field>

          <Field label="Cidade" htmlFor="cidade">
            <input
              id="cidade"
              name="cidade"
              type="text"
              autoComplete="address-level2"
              required
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
              required
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

          <label className="flex items-start gap-3 rounded-xl border border-selo-700/15 bg-selo-50/40 px-4 py-3 text-sm text-ink/70">
            <input
              type="checkbox"
              required
              checked={lgpdAceito}
              onChange={(event) => setLgpdAceito(event.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-selo-700/30 text-selo-700 focus:ring-selo-700"
            />
            <span>
              Autorizo o uso dos meus dados exclusivamente para contato sobre
              minha pré-análise, conforme a Lei Geral de Proteção de Dados
              (LGPD). Seus dados não serão compartilhados com terceiros.
            </span>
          </label>

          {errorMessage && (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid || isSubmitting}
            className="h-12 w-full bg-ouro-500 text-base text-selo-900 hover:bg-ouro-400 disabled:opacity-40"
          >
            {isSubmitting ? "Enviando..." : "Quero Minha Pré-Análise Gratuita"}
          </Button>

          <p className="-mt-1 flex items-center justify-center gap-1.5 text-center text-xs text-ink/60">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            Gratuito, sigiloso e sem compromisso. Você só decide se quer
            seguir depois de falar com a especialista.
          </p>
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

function TrustItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-xs font-medium text-selo-700">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-selo-700/10 text-selo-700">
        {icon}
      </span>
      <span className="text-ink/70">{text}</span>
    </div>
  );
}
