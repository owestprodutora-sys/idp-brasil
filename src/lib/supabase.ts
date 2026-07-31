import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Não lançamos erro aqui: isso é importado por várias páginas e um throw
  // no carregamento do módulo derrubaria o app inteiro (tela branca), não
  // só a funcionalidade que depende do Supabase.
  console.warn(
    "[Supabase] VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY não configuradas. Copie .env.example para .env e preencha os valores. Funcionalidades que dependem do Supabase (Cadastro, Admin) vão falhar até isso ser feito.",
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
);
