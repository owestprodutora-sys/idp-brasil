import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function AdminHeader({
  title,
  roleLabel,
  onSignOut,
}: {
  title: string;
  roleLabel: string;
  onSignOut: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Link to="/" className="font-display text-lg font-semibold text-selo-700">
          IDP <span className="text-ouro-600">Brasil</span>
        </Link>
        <h1 className="mt-1 font-display text-2xl font-semibold text-selo-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden rounded-full border border-selo-700/15 bg-selo-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-selo-700 sm:inline-block">
          {roleLabel}
        </span>
        <Button
          variant="outline"
          onClick={onSignOut}
          className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
        >
          Sair
        </Button>
      </div>
    </div>
  );
}
