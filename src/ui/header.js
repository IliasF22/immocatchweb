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

  // ------------------------- apparition de la barre ----------------------
  // Règle liée à la position de défilement, et non plus à la visibilité du
  // hero : depuis que la section de démonstration passe avant lui, le hero
  // n'est pas à l'écran en haut de page, et la barre s'affichait aussitôt.
  function majVisibilite() {
    collant.dataset.visible =
      window.scrollY > window.innerHeight * 0.75 ? "oui" : "non";
  }

  majVisibilite();
  window.addEventListener("scroll", majVisibilite, { passive: true });
  window.addEventListener("resize", majVisibilite, { passive: true });

  // ---------------------------- bascule démo -----------------------------
  if (!demo) return;

  function majEtape() {
    const rect = demo.getBoundingClientRect();
    // Le lecteur est considéré comme « vu » dès que la section démo est
    // remontée au-dessus du milieu de l'écran : à ce stade le visiteur l'a
    // forcément eue devant les yeux.
    const depassee = rect.bottom < window.innerHeight * 0.5;
    collant.dataset.etape = depassee ? "contact" : "demo";
  }

  majEtape();
  window.addEventListener("scroll", majEtape, { passive: true });
  window.addEventListener("resize", majEtape, { passive: true });
}
