import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-selo-700/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-selo-700 font-mono text-xs font-semibold text-paper">
            ID
          </span>
          <span className="font-display text-lg font-semibold text-selo-700">
            IDP <span className="text-ouro-600">Brasil</span>
          </span>
        </Link>

        <Button
          asChild
          className="bg-ouro-500 text-selo-900 hover:bg-ouro-400"
        >
          <Link to="/pre-analise">Fazer Pré-Análise</Link>
        </Button>
      </div>
    </header>
  );
}
