import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Rocket className="h-10 w-10 text-primary" />
      <h1 className="text-2xl font-semibold">Projeto rodando 🎉</h1>
      <p className="text-muted-foreground">
        React + Vite + TypeScript + Tailwind + shadcn/ui + React Router.
      </p>
      <Button asChild>
        <Link to="/sobre">Ir para /sobre</Link>
      </Button>
    </div>
  );
}
