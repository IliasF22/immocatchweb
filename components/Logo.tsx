// Logo ImmoCatch — symbole abstrait de RAPPROCHEMENT / mise en relation.
// Deux nœuds reliés par une liaison : un acheteur mis en correspondance avec un bien.
// Carré arrondi orange (#FF6B00), tracé blanc — même gabarit que l'ancienne icône.
// Autonome (aucun fichier image à charger), lisible sur fond sombre comme clair.
//
// NB naming : le wordmark "Immo" / "Catch" est conservé. "Catch" évoquait la
// capture de leads (ancien positionnement). Avec le repositionnement back-office
// (structuration + rapprochement), une piste serait "ImmoMatch" (match = mise en
// correspondance acheteur/bien) — non imposé, à décider côté marque.

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="ImmoCatch"
    >
      <rect x="1" y="1" width="62" height="62" rx="15" fill="#FF6B00" />
      {/* Liaison entre les deux nœuds */}
      <line
        x1="24"
        y1="24"
        x2="40"
        y2="40"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Nœud A (contour) */}
      <circle cx="22" cy="22" r="7.5" fill="#FF6B00" stroke="#ffffff" strokeWidth="4" />
      {/* Nœud B (plein) */}
      <circle cx="42" cy="42" r="7.5" fill="#ffffff" />
    </svg>
  );
}
