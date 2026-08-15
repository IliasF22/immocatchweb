/**
 * Section « Flux en direct » : conversation pleine largeur, aurore en fond.
 *
 * Chaque message se forme en se condensant : les mots arrivent dispersés et
 * flous, puis se rassemblent à leur place pendant que la bulle se dessine.
 *
 * Par défaut, toute la conversation est lisible et nette : c'est l'état servi
 * sans JavaScript et avec `prefers-reduced-motion`. Le découpage en mots et la
 * condensation ne sont posés que si les animations sont autorisées.
 */

const animationsReduites = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function rng(graine) {
  let e = graine >>> 0;
  return () => {
    e = (e * 1664525 + 1013904223) >>> 0;
    return e / 4294967296;
  };
}

/**
 * Enveloppe chaque mot d'un élément dans un span, sans toucher aux balises
 * existantes ni aux espaces (le texte reste sélectionnable et le retour à la
 * ligne se fait toujours entre les mots).
 */
function decouperEnMots(racine) {
  const marcheur = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT);
  const noeuds = [];
  while (marcheur.nextNode()) noeuds.push(marcheur.currentNode);

  const mots = [];

  noeuds.forEach((noeud) => {
    if (!noeud.textContent.trim()) return;

    const fragment = document.createDocumentFragment();
    // On garde les séparateurs : sans eux, les mots se colleraient.
    noeud.textContent.split(/(\s+)/).forEach((morceau) => {
      if (!morceau) return;
      if (/^\s+$/.test(morceau)) {
        fragment.appendChild(document.createTextNode(morceau));
        return;
      }
      const span = document.createElement("span");
      span.className = "mot";
      span.textContent = morceau;
      fragment.appendChild(span);
      mots.push(span);
    });

    noeud.parentNode.replaceChild(fragment, noeud);
  });

  return mots;
}

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

  // ------------------------ préparation des mots -------------------------
  const alea = rng(20260810);

  lignes.forEach((ligne) => {
    const bulle = ligne.querySelector(".msg");
    if (!bulle) return;

    // Le texte à condenser : le corps du message, l'auteur et l'heure.
    const cibles = bulle.querySelectorAll("p, .msg__auteur, .msg__pied, .msg__duree");
    const mots = [];
    cibles.forEach((cible) => mots.push(...decouperEnMots(cible)));

    mots.forEach((mot, i) => {
      // Chaque mot part d'un point légèrement différent : la condensation se
      // lit comme un rassemblement, pas comme un simple fondu de bloc.
      mot.style.setProperty("--dx", `${(alea() - 0.5) * 26}px`);
      mot.style.setProperty("--dy", `${(alea() - 0.5) * 18}px`);
      mot.style.transitionDelay = `${120 + i * 45}ms`;
    });

    // Le vocal n'a pas de mots : ce sont les barres de l'onde qui se dressent.
    bulle.querySelectorAll(".msg__onde span").forEach((barre, i) => {
      barre.style.transitionDelay = `${220 + i * 32}ms`;
    });
  });

  fil.setAttribute("data-progressif", "oui");

  // ---------------------- révélation des messages -----------------------
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

  // ------------------------------ aurore ---------------------------------
  if (!canvas) return;

  let aurore = null;
  let idFrame = 0;

  /**
   * Progression de la traversée de la section par la fenêtre : 0 quand son
   * haut touche le bas de l'écran, 1 quand son bas touche le haut.
   *
   * On mesure la traversée complète (hauteur de section + hauteur d'écran)
   * plutôt que le seul débordement `hauteur - écran` : sur téléphone, la
   * section dépasse à peine la hauteur de l'écran, et cette seconde formule
   * donnait une course de quelques dizaines de pixels — la teinte basculait
   * d'un coup, sans qu'on voie rien.
   */
  function progresSection() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    return Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
  }

  function appliquer() {
    idFrame = 0;
    // La traversée commence avant que la section soit lisible et finit après :
    // on ne garde que la portion utile, celle où le visiteur parcourt
    // vraiment la conversation.
    const brut = (progresSection() - 0.25) / 0.6;
    aurore?.viserProgres(brut);
  }

  function surDefilement() {
    if (idFrame) return;
    idFrame = requestAnimationFrame(appliquer);
  }

  async function demarrer() {
    try {
      const { initialiserAurore } = await import("../scene/aurora.js");
      aurore = initialiserAurore(canvas, {
        surPret: () => canvas.setAttribute("data-pret", "oui"),
      });
      window.addEventListener("scroll", surDefilement, { passive: true });
      window.addEventListener("resize", surDefilement, { passive: true });
      appliquer();
    } catch (erreur) {
      // Pas de WebGL ou chunk indisponible : la conversation se suffit à
      // elle-même, le canvas reste simplement transparent.
      console.warn("Aurore indisponible.", erreur);
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
