import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/profile";

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadProfile(currentSession: Session | null) {
      if (!currentSession) {
        if (isActive) setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentSession.user.id)
        .maybeSingle();

      if (!isActive) return;

      if (error) {
        // Não derruba o app: sem perfil, a tela do painel mostra um aviso
        // pedindo pra cadastrar o perfil (ver AdminGate / pages/Admin.tsx).
        console.error("[Supabase] Erro ao carregar profile:", error);
        setProfile(null);
      } else {
        setProfile(data as Profile | null);
      }
    }

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!isActive) return;
      setSession(data.session);
      await loadProfile(data.session);
      if (isActive) setIsLoading(false);
    }

    init();

    // supabase-js já persiste a sessão (localStorage) por padrão;
    // este listener só mantém o estado do React sincronizado com ela,
    // inclusive quando ela expira/renova em background, e recarrega o
    // profile sempre que a sessão muda (login/logout).
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      loadProfile(newSession);
    });

    return () => {
      isActive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ session, profile, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de <AuthProvider>");
  }
  return context;
}
