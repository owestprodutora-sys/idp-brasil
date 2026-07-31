export function DocumentSeal() {
  return (
    <svg
      viewBox="0 0 480 480"
      className="h-full w-full"
      role="img"
      aria-label="Documento oficial com selo de isenção do Imposto de Renda"
    >
      <rect x="70" y="40" width="300" height="400" rx="10" fill="#FFFFFF" stroke="#0E3B36" strokeOpacity="0.15" strokeWidth="2" />
      <rect x="70" y="40" width="300" height="400" rx="10" fill="none" stroke="#0E3B36" strokeOpacity="0.08" strokeWidth="14" />

      {/* linhas de texto simulando um documento */}
      <rect x="102" y="82" width="140" height="12" rx="6" fill="#0E3B36" opacity="0.85" />
      <rect x="102" y="108" width="200" height="8" rx="4" fill="#0E3B36" opacity="0.18" />
      <rect x="102" y="126" width="180" height="8" rx="4" fill="#0E3B36" opacity="0.18" />
      <rect x="102" y="144" width="196" height="8" rx="4" fill="#0E3B36" opacity="0.18" />

      <rect x="102" y="184" width="120" height="8" rx="4" fill="#0E3B36" opacity="0.14" />
      <rect x="102" y="202" width="204" height="8" rx="4" fill="#0E3B36" opacity="0.14" />
      <rect x="102" y="220" width="150" height="8" rx="4" fill="#0E3B36" opacity="0.14" />

      <line x1="102" y1="260" x2="338" y2="260" stroke="#0E3B36" strokeOpacity="0.12" strokeWidth="1.5" />

      <rect x="102" y="288" width="110" height="8" rx="4" fill="#0E3B36" opacity="0.14" />
      <rect x="102" y="306" width="196" height="8" rx="4" fill="#0E3B36" opacity="0.14" />
      <rect x="102" y="324" width="170" height="8" rx="4" fill="#0E3B36" opacity="0.14" />

      {/* selo circular carimbado sobre o documento */}
      <g transform="translate(300,300) rotate(-12)">
        <circle r="86" fill="#F5F6F2" stroke="#B98B3E" strokeWidth="3" />
        <circle r="72" fill="none" stroke="#B98B3E" strokeWidth="1.5" strokeDasharray="3 6" />
        <path
          id="selo-arc-top"
          d="M -52 -18 A 55 55 0 0 1 52 -18"
          fill="none"
        />
        <path
          id="selo-arc-bottom"
          d="M -46 24 A 50 50 0 0 0 46 24"
          fill="none"
        />
        <text fill="#0E3B36" fontSize="12.5" fontWeight="600" letterSpacing="2.5" fontFamily="IBM Plex Mono, monospace">
          <textPath href="#selo-arc-top" startOffset="50%" textAnchor="middle">
            ISENÇÃO CONCEDIDA
          </textPath>
        </text>
        <g transform="translate(0,2)">
          <circle r="22" fill="#0E3B36" />
          <path
            d="M -10 0 L -3 8 L 12 -9"
            fill="none"
            stroke="#F5F6F2"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <text fill="#0E3B36" fontSize="11" fontWeight="600" letterSpacing="2" fontFamily="IBM Plex Mono, monospace">
          <textPath href="#selo-arc-bottom" startOffset="50%" textAnchor="middle">
            IMPOSTO DE RENDA
          </textPath>
        </text>
      </g>
    </svg>
  );
}
