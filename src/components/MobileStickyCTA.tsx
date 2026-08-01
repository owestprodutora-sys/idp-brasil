import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Barra fixa inferior, exclusiva do mobile, que aparece assim que o
 * usuário rola para além do Hero da Home. Objetivo: manter o CTA de
 * conversão sempre acessível durante a navegação pela página.
 */
export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-selo-700/15 bg-paper/95 px-4 pt-3 backdrop-blur transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="mx-auto flex w-full max-w-md flex-col items-stretch gap-2">
        <p className="text-center text-sm font-medium leading-snug text-selo-900">
          Você pode ter direito à isenção do IR
        </p>
        <Button
          asChild
          className="h-11 w-full bg-ouro-500 text-sm text-selo-900 hover:bg-ouro-400"
        >
          <Link to="/pre-analise">Fazer Pré-Análise Gratuita</Link>
        </Button>
      </div>
    </div>
  );
}
