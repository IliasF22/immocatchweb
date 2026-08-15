/**
 * Section « Flux en direct » : un tracé vectoriel relie les messages et se
 * dessine au défilement. Une particule lumineuse court en tête du tracé ;
 * chaque message se révèle à l'instant précis où elle arrive à sa hauteur.
 *
 * Par défaut, toute la conversation est nette et lisible : c'est l'état servi
 * sans JavaScript et avec `prefers-reduced-motion`. Le floutage n'est posé que
 * si l'animation peut réellement se jouer.
 */

const animationsReduites = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Nombre d'échantillons pris le long du tracé pour le repérage des messages. */
const ECHANTILLONS = 700;

/**
 * Courbe lisse passant par tous les points, en Bézier cubiques.
 *
 * Conversion Catmull-Rom → Bézier : pour chaque segment, les points de
 * contrôle se déduisent des voisins, ce qui garantit une tangente continue
 * d'un segment à l'autre. Une simple suite de `Q` produirait une cassure
 * visible à chaque passage de message.
 */
function courbeLisse(points, tension = 6) {
  if (points.length < 2) return "";

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const c1x = p1.x + (p2.x - p0.x) / tension;
    const c1y = p1.y + (p2.y - p0.y) / tension;
    const c2x = p2.x - (p3.x - p1.x) / tension;
    const c2y = p2.y - (p3.y - p1.y) / tension;

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

export function initialiserFlux() {
  const section = document.querySelector("#preuve");
  const fil = document.querySelector("#fil");
  if (!section || !fil) return;

  // Le bouton de lecture reste utile même sans le reste : il « allume » le
  // tracé de l'onde, sans dépendre du défilement.
  const lecture = fil.querySelector(".msg__lecture");
  lecture?.addEventListener("click", () => {
    const vocal = lecture.closest(".msg__vocal");
    if (!vocal) return;
    vocal.setAttribute(
      "data-lu",
      vocal.getAttribute("data-lu") === "oui" ? "non" : "oui",
    );
  });

  const svg = document.querySelector("#flux-trace");
  const rail = document.querySelector("#flux-rail");
  const progression = document.querySelector("#flux-progression");
  const particule = document.querySelector("#flux-particule");
  const degrade = document.querySelector("#degrade-flux");
  const lignes = [...fil.querySelectorAll("[data-message]")];

  if (animationsReduites() || !svg || !rail || !progression || !lignes.length) {
    return;
  }

  // Les barres du vocal accompagnent l'activation de leur carte.
  lignes.forEach((ligne) => {
    ligne.querySelectorAll(".msg__onde span").forEach((barre, i) => {
      barre.style.transitionDelay = `${180 + i * 30}ms`;
    });
  });

  fil.setAttribute("data-progressif", "oui");

  // --------------------------- calcul du tracé ---------------------------
  let longueur = 0;
  let seuils = []; // longueur d'arc à laquelle chaque message s'active

  function construire() {
    const cadre = section.getBoundingClientRect();
    const largeur = Math.round(cadre.width);
    const hauteur = Math.round(cadre.height);
    if (!largeur || !hauteur) return false;

    svg.setAttribute("viewBox", `0 0 ${largeur} ${hauteur}`);
    // Le dégradé suit la hauteur de la section : vert en haut, ambre en bas.
    degrade?.setAttribute("x1", "0");
    degrade?.setAttribute("y1", "0");
    degrade?.setAttribute("x2", "0");
    degrade?.setAttribute("y2", String(hauteur));

    // Un point d'ancrage par message, du côté libre de la bulle : le tracé
    // serpente entre les messages au lieu de les traverser.
    const ancres = lignes.map((ligne) => {
      const bulle = ligne.querySelector(".msg") || ligne;
      const r = bulle.getBoundingClientRect();
      const aGauche = ligne.classList.contains("fil__ligne--gauche");
      const marge = Math.min(56, largeur * 0.07);
      const x = aGauche
        ? r.right - cadre.left + marge
        : r.left - cadre.left - marge;
      return {
        x: Math.max(14, Math.min(largeur - 14, x)),
        y: r.top - cadre.top + r.height / 2,
      };
    });

    // Amorce et sortie : le tracé ne commence ni ne finit net sur un message.
    const premier = ancres[0];
    const dernier = ancres[ancres.length - 1];
    const points = [
      { x: premier.x, y: Math.max(0, premier.y - 170) },
      ...ancres,
      { x: dernier.x, y: Math.min(hauteur, dernier.y + 170) },
    ];

    const d = courbeLisse(points);
    rail.setAttribute("d", d);
    progression.setAttribute("d", d);

    longueur = progression.getTotalLength();
    progression.style.strokeDasharray = `${longueur}`;
    progression.style.strokeDashoffset = `${longueur}`;

    // Échantillonnage unique du tracé : sert à retrouver la longueur d'arc de
    // chaque message, sans aucun appel coûteux pendant le défilement.
    const echantillons = [];
    for (let i = 0; i <= ECHANTILLONS; i += 1) {
      const l = (longueur * i) / ECHANTILLONS;
      const p = progression.getPointAtLength(l);
      echantillons.push({ l, x: p.x, y: p.y });
    }

    // Pour chaque message, on retient l'échantillon le plus proche de son
    // ancre. Méthode volontairement générique : elle ne suppose rien de la
    // façon dont la courbe a été construite et reste juste si le tracé change
    // de forme, de tension ou de nombre de points.
    seuils = ancres.map((ancre) => {
      let meilleur = 0;
      let distanceMin = Infinity;
      for (const e of echantillons) {
        const dx = e.x - ancre.x;
        const dy = e.y - ancre.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < distanceMin) {
          distanceMin = d2;
          meilleur = e.l;
        }
      }
      return meilleur;
    });

    return true;
  }

  // ------------------------- pilotage au défilement ----------------------
  /**
   * Progression de la traversée de la section par la fenêtre : 0 quand son
   * haut touche le bas de l'écran, 1 quand son bas touche le haut. On mesure
   * la traversée complète (hauteur de section + hauteur d'écran) : sur
   * téléphone, la section dépasse à peine l'écran et le seul débordement
   * donnerait une course de quelques dizaines de pixels.
   */
  function progresSection() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    return Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
  }

  let idFrame = 0;

  function appliquer() {
    idFrame = 0;
    if (!longueur) return;

    // On ne garde que la portion utile de la traversée : celle où le visiteur
    // parcourt vraiment la conversation.
    const brut = (progresSection() - 0.18) / 0.62;
    const avance = Math.min(1, Math.max(0, brut));
    const parcourue = longueur * avance;

    progression.style.strokeDashoffset = `${longueur - parcourue}`;

    // La particule est placée par la géométrie du tracé elle-même : elle ne
    // peut donc pas se désynchroniser du remplissage.
    const p = progression.getPointAtLength(parcourue);
    particule.setAttribute("cx", p.x);
    particule.setAttribute("cy", p.y);
    particule.style.opacity = avance > 0.002 && avance < 0.998 ? "1" : "0";

    // Un message s'active à l'instant où la particule atteint sa hauteur.
    // L'état ne revient jamais en arrière : remonter un peu ne doit pas
    // refaire disparaître un message déjà lu.
    lignes.forEach((ligne, i) => {
      if (parcourue >= seuils[i]) ligne.setAttribute("data-vu", "oui");
    });
  }

  function surDefilement() {
    if (idFrame) return;
    idFrame = requestAnimationFrame(appliquer);
  }

  function reconstruire() {
    if (construire()) appliquer();
  }

  // Les polices arrivent en `font-display: swap` : mesurer avant leur
  // remplacement donnerait des positions de messages fausses, donc un tracé
  // et des seuils décalés.
  function demarrer() {
    reconstruire();
    window.addEventListener("scroll", surDefilement, { passive: true });
    window.addEventListener("resize", reconstruire, { passive: true });
    if ("ResizeObserver" in window) {
      new ResizeObserver(reconstruire).observe(section);
    }
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(demarrer, demarrer);
  } else {
    demarrer();
  }
}
