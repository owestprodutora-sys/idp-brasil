import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Sobre</h1>
      <p className="text-muted-foreground">Rota de exemplo criada com React Router.</p>
      <Button variant="outline" asChild>
        <Link to="/">Voltar</Link>
      </Button>
    </div>
  );
}
