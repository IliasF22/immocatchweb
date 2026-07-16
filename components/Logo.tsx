// Logo ImmoCatch — maison institutionnelle + orbite orange (logo de marque).
// Rendu 100% SVG (net sur tout écran, aucun fichier image à charger).
// `houseClassName` pilote la couleur de la maison via currentColor :
//   - "text-white"      → sur fond sombre (slate-900) — valeur par défaut
//   - "text-slate-900"  → sur fond clair (blanc)

export function Logo({
  className = "",
  houseClassName = "text-white",
}: {
  className?: string;
  houseClassName?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 56"
      className={className}
      role="img"
      aria-label="ImmoCatch"
    >
      {/* Orbite orange — moitié arrière (passe derrière la maison) */}
      <g transform="rotate(-18 32 30)">
        <path
          d="M7 30 A25 11 0 0 1 57 30"
          fill="none"
          stroke="#FF6B00"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </g>

      {/* Maison */}
      <g
        className={houseClassName}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Toit */}
        <path d="M13 33 L32 17 L51 33" />
        {/* Cheminée */}
        <path d="M44 26 L44 19 L48 19 L48 30" />
        {/* Murs + sol */}
        <path d="M20 31 L20 45 L44 45 L44 31" />
      </g>

      {/* Orbite orange — moitié avant (passe devant la maison) */}
      <g transform="rotate(-18 32 30)">
        <path
          d="M57 30 A25 11 0 0 1 7 30"
          fill="none"
          stroke="#FF6B00"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
