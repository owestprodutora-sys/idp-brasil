import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectTo =
    (location.state as { from?: Location })?.from?.pathname ?? "/admin";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await signIn(email.trim(), password);

    setIsSubmitting(false);

    if (error) {
      setErrorMessage("E-mail ou senha incorretos.");
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-display text-lg font-semibold text-selo-700">
          IDP <span className="text-ouro-600">Brasil</span>
        </Link>

        <h1 className="mt-6 font-display text-2xl font-semibold text-selo-900">
          Acesso ao Painel
        </h1>
        <p className="mt-1.5 text-sm text-ink/60">
          Entre com seu e-mail e senha para acessar os leads.
        </p>

        {!isSupabaseConfigured && (
          <p className="mt-4 rounded-lg border border-ouro-500/40 bg-ouro-50 px-4 py-3 text-sm text-selo-900">
            O Supabase ainda não está configurado neste ambiente (arquivo
            `.env`). O login não vai funcionar até isso ser preenchido.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-selo-900">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border-2 border-selo-700/25 bg-white px-4 text-base text-selo-900 focus:border-selo-700 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-selo-900">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-xl border-2 border-selo-700/25 bg-white px-4 text-base text-selo-900 focus:border-selo-700 focus:outline-none"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="mt-2 h-12 w-full bg-selo-700 text-base text-paper hover:bg-selo-600 disabled:opacity-40"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
