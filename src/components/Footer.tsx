export function Footer() {
  return (
    <footer className="border-t border-selo-700/10 bg-paper py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <span className="font-display text-base font-semibold text-selo-700">
          IDP <span className="text-ouro-600">Brasil</span>
        </span>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink/60">
          <a href="#" className="hover:text-selo-700">
            Política
          </a>
          <a href="#" className="hover:text-selo-700">
            LGPD
          </a>
          <a href="#" className="hover:text-selo-700">
            Contato
          </a>
        </nav>
      </div>
    </footer>
  );
}
