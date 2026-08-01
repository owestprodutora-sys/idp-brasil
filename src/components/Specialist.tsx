import { useState } from "react";

import { Section } from "@/components/Section";

export function Specialist() {
  const [imageError, setImageError] = useState(false);

  return (
    <Section id="especialista" className="bg-selo-50/60">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        {imageError ? (
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-selo-700 font-display text-2xl font-semibold text-paper">
            AD
          </span>
        ) : (
          <img
            src="/adrieli.jpg"
            alt="Adrieli Drewlo Dias"
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="h-24 w-24 rounded-full bg-selo-100 object-cover ring-2 ring-selo-700/15"
          />
        )}

        <div>
          <h3 className="font-display text-xl font-semibold text-selo-900">
            Adrieli Drewlo Dias
          </h3>
          <p className="text-sm font-medium uppercase tracking-wide text-ouro-600">
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
