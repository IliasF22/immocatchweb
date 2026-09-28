/**
 * Chrome de la page : filet sous l'en-tête une fois la page défilée, menu
 * mobile, et barre d'appel à l'action collante sur mobile.
 *
 * La barre apparaît une fois le premier écran dépassé. Deux modes :
 * - par défaut (/automatisations), son contenu suit l'avancement du
 *   visiteur : tant qu'il n'a pas atteint la démo, on l'y envoie ; une fois
 *   la démo passée, on lui propose la prise de rendez-vous ;
 * - `data-mode="extrait"` (accueil, pages d'offre), un seul bouton vers le
 *   formulaire, masqué quand le formulaire est lui-même à l'écran.
 */
export function initialiserEntete() {
  const entete = document.querySelector("#entete");
  const collant = document.querySelector("#cta-collant");
  const demo = document.querySelector("#demo");
  const extrait = document.querySelector("#extrait");

  if (entete) {
    const majFilet = () => {
      entete.dataset.defile = window.scrollY > 8 ? "oui" : "non";
    };
    majFilet();
    window.addEventListener("scroll", majFilet, { passive: true });
    initialiserMenu(entete);
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

    // Mode « extrait » : inutile de proposer le formulaire quand il est déjà
    // sous les yeux du visiteur, et le bouton masquerait ses derniers champs.
    if (collant.dataset.mode === "extrait" && extrait) {
      const rect = extrait.getBoundingClientRect();
      if (rect.top < h && rect.bottom > 0) {
        collant.dataset.visible = "non";
        return;
      }
    }

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

/**
 * Menu mobile : les liens se replient derrière « Menu » sous 1000 px.
 * Fermeture par Échap, par un clic sur un lien, ou au retour en grand écran.
 */
function initialiserMenu(entete) {
  const bouton = entete.querySelector(".entete__menu");
  const liste = entete.querySelector("#navigation");
  if (!bouton || !liste) return;

  function basculer(ouvrir) {
    bouton.setAttribute("aria-expanded", String(ouvrir));
    liste.dataset.ouvert = ouvrir ? "oui" : "non";
  }

  bouton.addEventListener("click", () => {
    basculer(bouton.getAttribute("aria-expanded") !== "true");
  });

  liste.addEventListener("click", (e) => {
    if (e.target.closest("a")) basculer(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bouton.getAttribute("aria-expanded") === "true") {
      basculer(false);
      bouton.focus();
    }
  });

  window.matchMedia("(min-width: 1001px)").addEventListener("change", (e) => {
    if (e.matches) basculer(false);
  });
}
