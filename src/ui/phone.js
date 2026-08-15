/**
 * Téléphone 3D piloté par le défilement (section "Preuve en direct").
 *
 * Par défaut, la conversation est entièrement visible et le téléphone garde
 * une inclinaison fixe : c'est l'état affiché sans JavaScript et avec
 * `prefers-reduced-motion`. Cette fonction n'ajoute le mode « scrollytelling »
 * (long conteneur, ancre collante, bulles qui apparaissent une à une) que si
 * les animations sont autorisées et que les API nécessaires existent.
 */

const animationsReduites = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function limiter(valeur, min, max) {
  return Math.min(max, Math.max(min, valeur));
}

function lisser(depart, arrivee, t) {
  return depart + (arrivee - depart) * t;
}

export function initialiserTelephone() {
  const enveloppe = document.querySelector("#preuve-defilement");
  const ancre = enveloppe?.querySelector(".preuve__ancre");
  const telephone = document.querySelector("#telephone");
  const fil = document.querySelector("#telephone-fil");
  if (!enveloppe || !ancre || !telephone || !fil) return;

  // Le bouton lecture reste utile même sans le reste du module : un clic
  // « allume » le tracé de l'onde, sans dépendre du défilement.
  const boutonLecture = fil.querySelector(".bulle__lecture");
  boutonLecture?.addEventListener("click", () => {
    const conteneur = boutonLecture.closest(".bulle__vocal");
    conteneur?.setAttribute("data-lu", conteneur.getAttribute("data-lu") === "oui" ? "non" : "oui");
  });

  if (animationsReduites() || !("IntersectionObserver" in window)) return;

  const messages = [...fil.querySelectorAll("[data-message]")];
  if (!messages.length) return;

  // Décalage du haut de l'ancre collante : sous l'en-tête sticky, avec une
  // marge de confort. Recalculé au redimensionnement (le badge de l'en-tête
  // disparaît sous 900px, ce qui change sa hauteur).
  const entete = document.querySelector("#entete");
  function majDecalage() {
    const h = (entete?.offsetHeight || 64) + 16;
    document.documentElement.style.setProperty("--decalage-entete", `${h}px`);
  }
  majDecalage();
  window.addEventListener("resize", majDecalage, { passive: true });

  enveloppe.style.setProperty("--etapes", messages.length);
  enveloppe.setAttribute("data-scrollytelling", "oui");

  let actif = false;
  let idFrame = 0;

  function appliquer() {
    idFrame = 0;

    const rect = enveloppe.getBoundingClientRect();
    const hauteurUtile = rect.height - window.innerHeight;
    const progres =
      hauteurUtile > 0 ? limiter(-rect.top / hauteurUtile, 0, 1) : 0;

    // La fiche se présente légèrement de biais, puis se redresse à mesure
    // qu'on avance dans la conversation.
    const rotY = lisser(-16, -3, progres);
    const rotX = lisser(5, 0, progres);
    const echelle = lisser(0.96, 1, progres);
    telephone.style.transform = `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale(${echelle.toFixed(3)})`;

    // Révélation en cascade, jamais inversée : si le visiteur remonte un peu,
    // les bulles déjà vues restent affichées plutôt que de clignoter. Le tout
    // premier message est visible dès l'arrivée sur la section (seuil à 0) :
    // un téléphone entièrement vide au repos, avant tout défilement, donnerait
    // l'impression d'un composant cassé.
    messages.forEach((message, i) => {
      const seuil = i / messages.length;
      if (progres >= seuil) message.setAttribute("data-vu", "oui");
    });
  }

  function surDefilement() {
    if (idFrame || !actif) return;
    idFrame = requestAnimationFrame(appliquer);
  }

  const observateur = new IntersectionObserver(
    ([entree]) => {
      actif = entree.isIntersecting;
      if (actif) appliquer();
    },
    { threshold: 0 },
  );
  observateur.observe(enveloppe);

  window.addEventListener("scroll", surDefilement, { passive: true });

  // Premier calcul retardé jusqu'à ce que les polices (chargées en
  // `font-display: swap`) aient fini de remplacer la police de secours.
  // Sans cette attente, la mise en page bascule après coup, la hauteur de
  // la section change, et une mesure prise trop tôt peut marquer à tort des
  // bulles comme « vues » — marquage qui, par conception, ne revient jamais
  // en arrière.
  const premierCalcul = () =>
    requestAnimationFrame(() => requestAnimationFrame(() => {
      majDecalage();
      appliquer();
    }));
  if (document.fonts?.ready) {
    document.fonts.ready.then(premierCalcul, premierCalcul);
  } else {
    premierCalcul();
  }
}
