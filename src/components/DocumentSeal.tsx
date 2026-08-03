/**
 * Ilustração da Hero: um "Parecer de Pré-Análise" do IDP Brasil.
 *
 * Substitui o selo genérico anterior (círculo tracejado + texto em arco,
 * que estourava o próprio arco) por um documento de marca própria, com
 * conteúdo tipográfico real e linguagem neutra de processo em andamento —
 * nunca de resultado ("elegível", "aprovado" etc. propositalmente evitados).
 *
 * Usa exclusivamente tokens já existentes em tailwind.config.js
 * (paper, ink, selo-*, ouro-*) e as mesmas três famílias tipográficas do
 * resto do site (Fraunces / IBM Plex Sans / IBM Plex Mono).
 */
export function DocumentSeal() {
  return (
    <svg
      viewBox="0 0 440 560"
      className="h-full w-full"
      role="img"
      aria-label="Parecer de Pré-Análise do IDP Brasil, com selo da marca"
    >
      {/* folha de apoio atrás do card principal — sugere um objeto físico
          empilhado, não um retângulo único flutuando no vazio */}
      <g
        transform="rotate(-5 234 296)"
        style={{ filter: "drop-shadow(0 10px 24px rgba(9,40,36,0.08))" }}
      >
        <rect x="54" y="46" width="360" height="500" rx="16" fill="#F5F6F2" stroke="#0E3B36" strokeOpacity="0.08" strokeWidth="1.5" />
      </g>

      {/* card principal do documento */}
      <g
        transform="rotate(-2 220 280)"
        style={{
          filter:
            "drop-shadow(0 20px 45px rgba(9,40,36,0.16)) drop-shadow(0 6px 14px rgba(9,40,36,0.10))",
        }}
      >
        <rect x="40" y="30" width="360" height="500" rx="16" fill="#FFFFFF" stroke="#0E3B36" strokeOpacity="0.12" strokeWidth="1.5" />

        {/* dobra sutil no canto inferior direito — detalhe de "papel real" */}
        <path d="M 400 530 L 400 504 L 374 530 Z" fill="#F5F6F2" stroke="#0E3B36" strokeOpacity="0.10" strokeWidth="1" />

        {/* wordmark */}
        <circle cx="76" cy="60" r="3" fill="#B98B3E" />
        <text x="86" y="64" fill="#0E3B36" fontSize="11" fontWeight="600" letterSpacing="2" fontFamily="IBM Plex Mono, monospace">
          IDP BRASIL
        </text>

        {/* título */}
        <text x="72" y="120" fill="#092824" fontSize="30" fontWeight="600" fontFamily="Fraunces, serif">
          Parecer de
        </text>
        <text x="72" y="156" fill="#092824" fontSize="30" fontWeight="600" fontFamily="Fraunces, serif">
          Pré-Análise
        </text>

        {/* citação legal — mesmo padrão visual do LegalBadge existente */}
        <circle cx="76" cy="177" r="3" fill="#B98B3E" />
        <text x="86" y="181" fill="#0E3B36" fontSize="11" fontWeight="600" letterSpacing="1.4" fontFamily="IBM Plex Mono, monospace">
          LEI Nº 7.713/88 · ART. 6º XIV
        </text>

        <line x1="72" y1="210" x2="368" y2="210" stroke="#0E3B36" strokeOpacity="0.12" strokeWidth="1.5" />

        {/* campo: especialista responsável */}
        <text x="72" y="246" fill="#0E3B36" fillOpacity="0.5" fontSize="10" fontWeight="600" letterSpacing="1.5" fontFamily="IBM Plex Mono, monospace">
          ESPECIALISTA RESPONSÁVEL
        </text>
        <text x="72" y="270" fill="#092824" fontSize="16" fontWeight="600" fontFamily="IBM Plex Sans, sans-serif">
          Adrieli Drewlo Dias
        </text>

        {/* campo: situação */}
        <text x="72" y="316" fill="#0E3B36" fillOpacity="0.5" fontSize="10" fontWeight="600" letterSpacing="1.5" fontFamily="IBM Plex Mono, monospace">
          SITUAÇÃO
        </text>
        <text x="72" y="340" fill="#092824" fontSize="16" fontWeight="600" fontFamily="IBM Plex Sans, sans-serif">
          Em análise
        </text>

        {/* campo: status — linguagem neutra, de processo em andamento */}
        <text x="72" y="386" fill="#0E3B36" fillOpacity="0.5" fontSize="10" fontWeight="600" letterSpacing="1.5" fontFamily="IBM Plex Mono, monospace">
          STATUS
        </text>
        <rect x="72" y="396" width="204" height="34" rx="17" fill="#0E3B36" />
        <circle cx="90" cy="413" r="4" fill="#B98B3E" />
        <text x="102" y="418" fill="#F5F6F2" fontSize="13" fontWeight="600" fontFamily="IBM Plex Sans, sans-serif">
          Solicitação recebida
        </text>

        <line x1="72" y1="470" x2="368" y2="470" stroke="#0E3B36" strokeOpacity="0.10" strokeWidth="1" />
        <text x="72" y="496" fill="#0E3B36" fillOpacity="0.4" fontSize="10" letterSpacing="1" fontFamily="IBM Plex Mono, monospace">
          idpbrasil.com.br
        </text>
      </g>

      {/* selo da marca — sem textPath, sem arco, sem tracejado. Ícone de
          check reaproveitado do mesmo desenho usado no CheckMark da Hero. */}
      <g
        transform="translate(388,66) rotate(8)"
        style={{ filter: "drop-shadow(0 10px 18px rgba(150,112,46,0.35))" }}
      >
        <rect x="-34" y="-34" width="68" height="68" rx="20" fill="#B98B3E" stroke="#96702E" strokeOpacity="0.4" strokeWidth="1" />
        <path
          d="M -14 0 L -4 11 L 17 -13"
          fill="none"
          stroke="#F5F6F2"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
