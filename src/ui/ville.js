/**
 * Ville stylisée : une grille de logements qui s'allument par étapes.
 *
 * Purement illustrative (aucune donnée réelle) : elle montre le mécanisme de
 * l'extrait. Les états, posés sur le conteneur via `data-etat`, sont stylés en
 * CSS :
 *   ville      tous les logements, neutres
 *   passoires  les logements classés F ou G passent en ambre
 *   societes   ceux détenus par une société reçoivent un anneau vert
 *   extrait    le reste s'efface, il ne reste que la liste utile
 *
 * Deux modes :
 *   data-ville="boucle"      les états défilent seuls (en-tête de page)
 *   data-ville="defilement"  l'état suit l'étape du récit visible à l'écran
 *                            (éléments `[data-etape-ville]` du même bloc)
 */

const ETATS = ["ville", "passoires", "societes", "extrait"];
const reduites = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Générateur pseudo-aléatoire à graine : la ville est identique à chaque visite. */
function aleatoire(graine) {
  let s = graine >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dessiner(conteneur) {
  const colonnes = Number(conteneur.dataset.colonnes) || 15;
  const lignes = Number(conteneur.dataset.lignes) || 10;
  const hasard = aleatoire(Number(conteneur.dataset.graine) || 16);
  const PAS = 10;
  const NS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${colonnes * PAS} ${lignes * PAS}`);
  svg.setAttribute("class", "ville__svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  let rang = 0;
  for (let y = 0; y < lignes; y += 1) {
    // Une rue toutes les quatre lignes et toutes les cinq colonnes : sans
    // elles, la grille ressemble à un tableur plutôt qu'à un quartier.
    if (y % 4 === 3) continue;
    for (let x = 0; x < colonnes; x += 1) {
      if (x % 5 === 4) continue;
      if (hasard() < 0.1) continue; // parcelles vides

      const lot = document.createElementNS(NS, "rect");
      lot.setAttribute("x", String(x * PAS + 1));
      lot.setAttribute("y", String(y * PAS + 1));
      lot.setAttribute("width", "8");
      lot.setAttribute("height", "8");
      lot.setAttribute("rx", "1.6");
      lot.setAttribute("class", "ville__lot");

      const passoire = hasard() < 0.2;
      if (passoire) lot.dataset.f = "oui";
      if (passoire && hasard() < 0.4) lot.dataset.s = "oui";
      // Décalage d'animation propre à chaque logement : ils s'allument en
      // grappes plutôt que d'un bloc.
      lot.style.setProperty("--i", String(Math.floor(hasard() * 14)));

      svg.appendChild(lot);
      rang += 1;
    }
  }

  conteneur.appendChild(svg);
  return rang;
}

function boucle(conteneur) {
  if (reduites()) {
    conteneur.dataset.etat = "societes";
    return;
  }
  const sequence = ["ville", "passoires", "societes", "societes"];
  let index = 0;
  let minuteur = 0;

  const avancer = () => {
    index = (index + 1) % sequence.length;
    conteneur.dataset.etat = sequence[index];
  };
  const demarrer = () => {
    if (!minuteur) minuteur = window.setInterval(avancer, 2200);
  };
  const arreter = () => {
    window.clearInterval(minuteur);
    minuteur = 0;
  };

  conteneur.dataset.etat = sequence[0];

  // Aucun calcul tant que la ville n'est pas à l'écran, ni onglet masqué.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => (e.isIntersecting ? demarrer() : arreter())).observe(
      conteneur,
    );
  } else {
    demarrer();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) arreter();
  });
}

function defilement(conteneur) {
  const bloc = conteneur.closest("[data-histoire]") || document;
  const etapes = [...bloc.querySelectorAll("[data-etape-ville]")];
  if (!etapes.length) return;

  const activer = (etape) => {
    etapes.forEach((e) => e.toggleAttribute("data-actif", e === etape));
    const etat = etape.dataset.etapeVille;
    if (ETATS.includes(etat)) conteneur.dataset.etat = etat;
  };

  activer(etapes[0]);

  if (reduites() || !("IntersectionObserver" in window)) {
    // Sans animation : on montre directement le résultat final.
    etapes.forEach((e) => e.setAttribute("data-actif", ""));
    conteneur.dataset.etat = "societes";
    return;
  }

  // L'étape active est celle qui traverse une bande horizontale de l'écran.
  // Sur ordinateur, la bande centrale. Sur téléphone, la ville épinglée
  // occupe le haut de l'écran : la bande descend juste en dessous, là où le
  // visiteur lit réellement.
  const telephone = window.matchMedia("(max-width: 899px)").matches;
  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) activer(entree.target);
      });
    },
    { rootMargin: telephone ? "-58% 0px -32% 0px" : "-45% 0px -45% 0px" },
  );
  etapes.forEach((e) => observateur.observe(e));
}

export function initialiserVille() {
  document.querySelectorAll("[data-ville]").forEach((conteneur) => {
    dessiner(conteneur);
    if (conteneur.dataset.ville === "boucle") boucle(conteneur);
    else defilement(conteneur);
  });
}
