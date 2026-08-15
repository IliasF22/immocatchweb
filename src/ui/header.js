/**
 * Chrome de la page : filet sous l'en-tête une fois la page défilée, et barre
 * d'appel à l'action collante sur mobile.
 *
 * La barre apparaît une fois le premier écran dépassé, et son contenu suit
 * l'avancement du visiteur : tant qu'il n'a pas atteint la démo, on l'y
 * envoie ; une fois la démo passée, il a vu le produit et on lui propose la
 * prise de rendez-vous.
 */
export function initialiserEntete() {
  const entete = document.querySelector("#entete");
  const collant = document.querySelector("#cta-collant");
  const demo = document.querySelector("#demo");

  if (entete) {
    const majFilet = () => {
      entete.dataset.defile = window.scrollY > 8 ? "oui" : "non";
    };
    majFilet();
    window.addEventListener("scroll", majFilet, { passive: true });
  }

  if (!collant) return;

  if (!("IntersectionObserver" in window)) {
    // Sans observateur, on montre la barre et on garde l'étape « démo » :
    // c'est le premier pas attendu du visiteur.
    collant.dataset.visible = "oui";
    return;
  }

  const racine = document.documentElement;

  /**
   * Sur mobile, la barre d'adresse du navigateur recouvre le bas de la fenêtre
   * de mise en page. Un élément `position: fixed; bottom: 0` se retrouve alors
   * partiellement ou totalement masqué dessous — la barre « disparaît en bas
   * de l'écran ». On la remonte de l'écart entre la fenêtre de mise en page et
   * la fenêtre réellement visible.
   *
   * On en profite pour publier la hauteur réelle de la barre : la réserve en
   * bas de page était figée à 4,5 rem, soit moins que la barre elle-même, qui
   * recouvrait donc la fin du pied de page.
   */
  function majGeometrie() {
    const vv = window.visualViewport;
    const decalage = vv
      ? Math.max(0, window.innerHeight - (vv.height + vv.offsetTop))
      : 0;
    collant.style.setProperty("--decalage-bas", `${Math.round(decalage)}px`);
    racine.style.setProperty("--hauteur-cta", `${collant.offsetHeight}px`);
  }

  // ------------------------- apparition de la barre ----------------------
  // Règle liée à la position de défilement, et non à la visibilité du hero :
  // depuis que la section de démonstration passe avant lui, le hero n'est pas
  // à l'écran en haut de page et la barre s'affichait aussitôt.
  //
  // Deux seuils plutôt qu'un : `window.innerHeight` change quand la barre
  // d'adresse se replie, et un seuil unique faisait clignoter le bouton à
  // chaque aller-retour autour de cette limite.
  function majVisibilite() {
    const y = window.scrollY;
    const h = window.innerHeight;
    if (collant.dataset.visible === "oui") {
      if (y < h * 0.45) collant.dataset.visible = "non";
    } else if (y > h * 0.75) {
      collant.dataset.visible = "oui";
    }
  }

  // ---------------------------- bascule démo -----------------------------
  function majEtape() {
    if (!demo) return;
    const rect = demo.getBoundingClientRect();
    // Le lecteur est considéré comme « vu » dès que la section démo est
    // remontée au-dessus du milieu de l'écran : à ce stade le visiteur l'a
    // forcément eue devant les yeux.
    collant.dataset.etape =
      rect.bottom < window.innerHeight * 0.5 ? "contact" : "demo";
  }

  let planifie = false;
  function majTout() {
    if (planifie) return;
    planifie = true;
    requestAnimationFrame(() => {
      planifie = false;
      majGeometrie();
      majVisibilite();
      majEtape();
    });
  }

  collant.dataset.visible = "non";
  majGeometrie();
  majVisibilite();
  majEtape();

  window.addEventListener("scroll", majTout, { passive: true });
  window.addEventListener("resize", majTout, { passive: true });
  window.visualViewport?.addEventListener("resize", majTout, { passive: true });
  window.visualViewport?.addEventListener("scroll", majTout, { passive: true });
}
