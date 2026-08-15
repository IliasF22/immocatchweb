/**
 * Section « Flux en direct » : conversation pleine largeur + ruban 3D.
 *
 * Par défaut, toute la conversation est visible : c'est l'état servi sans
 * JavaScript et avec `prefers-reduced-motion`. Ce module n'ajoute la
 * révélation progressive que si les animations sont autorisées, puis charge
 * le ruban 3D en import dynamique — jamais sur le chemin critique.
 */

const animationsReduites = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initialiserFlux() {
  const section = document.querySelector("#preuve");
  const fil = document.querySelector("#fil");
  const canvas = document.querySelector("#flux-canvas");
  if (!section || !fil) return;

  // Le bouton de lecture reste utile même sans le reste : il « allume » le
  // tracé de l'onde, sans dépendre du défilement ni de la 3D.
  const lecture = fil.querySelector(".msg__lecture");
  lecture?.addEventListener("click", () => {
    const vocal = lecture.closest(".msg__vocal");
    if (!vocal) return;
    vocal.setAttribute(
      "data-lu",
      vocal.getAttribute("data-lu") === "oui" ? "non" : "oui",
    );
  });

  if (animationsReduites() || !("IntersectionObserver" in window)) return;

  // ---------------------- révélation des messages -----------------------
  const lignes = [...fil.querySelectorAll("[data-message]")];
  if (lignes.length) {
    fil.setAttribute("data-progressif", "oui");

    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          if (!entree.isIntersecting) return;
          entree.target.setAttribute("data-vu", "oui");
          observateur.unobserve(entree.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -18% 0px" },
    );

    // Le tout premier message est acquis d'avance : arriver sur une section
    // vide donnerait l'impression d'un composant cassé.
    lignes[0].setAttribute("data-vu", "oui");
    lignes.slice(1).forEach((ligne) => observateur.observe(ligne));
  }

  // ----------------------------- ruban 3D -------------------------------
  if (!canvas) return;

  let ruban = null;
  let idFrame = 0;

  /**
   * Progression de la traversée de la section par la fenêtre : 0 quand son
   * haut touche le bas de l'écran, 1 quand son bas touche le haut.
   *
   * On mesure la traversée complète (hauteur de section + hauteur d'écran)
   * plutôt que le seul débordement `hauteur - écran` : sur téléphone, la
   * section dépasse à peine la hauteur de l'écran, et cette seconde formule
   * donnait une course de quelques dizaines de pixels — le ruban se traçait
   * d'un coup, sans qu'on voie rien.
   */
  function progresSection() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const course = rect.height + vh;
    return Math.min(1, Math.max(0, (vh - rect.top) / course));
  }

  function appliquer() {
    idFrame = 0;
    // La traversée commence avant que la section soit lisible et finit après :
    // on ne garde que la portion utile (25 % → 85 %) pour que le tracé
    // corresponde au moment où le visiteur parcourt vraiment la conversation.
    const brut = (progresSection() - 0.25) / 0.6;
    ruban?.viserProgres(brut * 1.1 + 0.05);
  }

  function surDefilement() {
    if (idFrame) return;
    idFrame = requestAnimationFrame(appliquer);
  }

  async function demarrer() {
    try {
      const { initialiserRuban } = await import("../scene/ribbon.js");
      ruban = initialiserRuban(canvas, {
        surPret: () => canvas.setAttribute("data-pret", "oui"),
      });
      window.addEventListener("scroll", surDefilement, { passive: true });
      window.addEventListener("resize", surDefilement, { passive: true });
      appliquer();
    } catch (erreur) {
      // Pas de WebGL ou chunk indisponible : la conversation se suffit à
      // elle-même, le canvas reste simplement transparent.
      console.warn("Ruban 3D indisponible.", erreur);
    }
  }

  // Chargé seulement quand la section approche de l'écran.
  const approche = new IntersectionObserver(
    ([entree]) => {
      if (!entree.isIntersecting) return;
      approche.disconnect();
      demarrer();
    },
    { rootMargin: "200px" },
  );
  approche.observe(section);
}
