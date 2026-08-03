import { useState } from "react";

import { Section } from "@/components/Section";

export function Specialist() {
  const [imageError, setImageError] = useState(false);

  return (
    <Section id="especialista" className="bg-selo-50/60">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-3xl border border-selo-700/10 bg-white px-6 py-10 text-center shadow-sm sm:px-12">
        {imageError ? (
          <span className="flex h-32 w-32 items-center justify-center rounded-full bg-selo-700 font-display text-3xl font-semibold text-paper ring-4 ring-selo-50">
            AD
          </span>
        ) : (
          <img
            src="/adrieli.jpg"
            alt="Adrieli Drewlo Dias"
            width={128}
            height={128}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="h-32 w-32 rounded-full bg-selo-100 object-cover ring-4 ring-selo-50 shadow-md"
          />
        )}

        <div>
          <h3 className="font-display text-2xl font-semibold text-selo-900">
            Adrieli Drewlo Dias
          </h3>
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-ouro-600">
            Especialista Responsável pela Análise
          </p>
        </div>

        <p className="max-w-md text-sm leading-relaxed text-ink/65">
          Adrieli Drewlo Dias é a especialista responsável pela análise
          inicial das solicitações encaminhadas ao IDP Brasil. Sua atuação é
          voltada ao atendimento dos clientes, avaliação preliminar das
          informações fornecidas e orientação sobre os próximos passos da
          análise.
        </p>
      </div>
    </Section>
  );
}
