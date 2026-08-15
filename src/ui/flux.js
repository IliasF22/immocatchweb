/**
 * Section « Flux en direct » : conversation pleine largeur + glyphes 3D.
 *
 * Par défaut, toute la conversation est visible : c'est l'état servi sans
 * JavaScript et avec `prefers-reduced-motion`. Ce module n'ajoute la
 * révélation progressive que si les animations sont autorisées, puis charge
 * les glyphes en import dynamique — jamais sur le chemin critique.
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

  const lignes = [...fil.querySelectorAll("[data-message]")];
  if (!lignes.length) return;

  // ---------------------- révélation des messages -----------------------
  fil.setAttribute("data-progressif", "oui");

  let glyphes = null;
  const assembles = new Set();

  function reveler(ligne) {
    ligne.setAttribute("data-vu", "oui");
    const index = lignes.indexOf(ligne);
    if (index === -1) return;
    assembles.add(index);
    glyphes?.assembler(index, true);
  }

  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        reveler(entree.target);
        observateur.unobserve(entree.target);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -18% 0px" },
  );

  // Le tout premier message est acquis d'avance : arriver sur une section
  // vide donnerait l'impression d'un composant cassé.
  reveler(lignes[0]);
  lignes.slice(1).forEach((ligne) => observateur.observe(ligne));

  // ----------------------------- glyphes 3D ------------------------------
  if (!canvas) return;

  let idFrame = 0;

  /**
   * Place chaque glyphe en face de son message.
   *
   * Les positions viennent du DOM plutôt que d'un calcul indépendant : les
   * cubes restent ainsi collés à leur bulle quoi qu'il arrive à la mise en
   * page (retour à la ligne, taille de police, largeur d'écran).
   */
  function placer() {
    idFrame = 0;
    if (!glyphes) return;

    const cadre = canvas.getBoundingClientRect();
    if (!cadre.height) return;

    lignes.forEach((ligne, i) => {
      const bulle = ligne.firstElementChild || ligne;
      const r = bulle.getBoundingClientRect();
      const centreY = r.top + r.height / 2;

      // Le glyphe se place du côté opposé à la bulle : c'est ce qui produit
      // l'alternance gauche / droite.
      //
      // Sur écran étroit, les bulles occupent presque toute la largeur et il
      // ne reste aucune marge : poussé au bord, le glyphe se retrouvait coupé.
      // On le ramène donc vers le centre, où il passe derrière la bulle — dont
      // le fond translucide et le flou l'intègrent comme une couche de fond.
      const aDroite = ligne.classList.contains("fil__ligne--gauche");
      const marge = cadre.width < 700 ? 0.34 : 0.72;
      const xNdc = aDroite ? marge : -marge;
      const yNdc = 1 - ((centreY - cadre.top) / cadre.height) * 2;

      // Inutile de dessiner un glyphe très au-delà du cadre.
      glyphes.placer(i, xNdc, yNdc, Math.abs(yNdc) < 1.6);
    });
  }

  function surDefilement() {
    if (idFrame) return;
    idFrame = requestAnimationFrame(placer);
  }

  async function demarrer() {
    try {
      const { initialiserGlyphes } = await import("../scene/glyphField.js");
      glyphes = initialiserGlyphes(canvas, {
        surPret: () => canvas.setAttribute("data-pret", "oui"),
      });

      // Les messages déjà révélés avant l'arrivée du module rattrapent leur
      // assemblage, sinon leur glyphe resterait invisible.
      assembles.forEach((i) => glyphes.assembler(i, true));

      window.addEventListener("scroll", surDefilement, { passive: true });
      window.addEventListener("resize", surDefilement, { passive: true });
      placer();
    } catch (erreur) {
      // Pas de WebGL ou chunk indisponible : la conversation se suffit à
      // elle-même, le canvas reste simplement transparent.
      console.warn("Glyphes 3D indisponibles.", erreur);
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
