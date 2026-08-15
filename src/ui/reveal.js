/**
 * Apparition au défilement et compteurs animés.
 *
 * Deux principes tenus partout sur ce site :
 *  - le contenu est lisible sans JavaScript (le HTML porte déjà la valeur
 *    finale, et la classe `no-js` neutralise le masquage) ;
 *  - rien ne bouge si le visiteur a demandé des animations réduites.
 */

const animationsReduites = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initialiserApparitions() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  if (animationsReduites() || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.setAttribute("data-vu", "oui"));
    return;
  }

  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        const el = entree.target;
        el.style.transitionDelay = `${el.dataset.delai || 0}ms`;
        el.setAttribute("data-vu", "oui");
        observateur.unobserve(el);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -70px 0px" },
  );

  elements.forEach((el) => observateur.observe(el));
}

function formater(valeur, prefixe, suffixe) {
  return `${prefixe}${valeur.toLocaleString("fr-FR")}${suffixe}`;
}

export function initialiserCompteurs() {
  const compteurs = document.querySelectorAll("[data-compteur]");
  if (!compteurs.length) return;

  // Sans animation possible, on laisse la valeur déjà écrite dans le HTML :
  // afficher « 0 € » serait pire que pas d'effet du tout.
  if (animationsReduites() || !("IntersectionObserver" in window)) return;

  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        const el = entree.target;
        observateur.unobserve(el);

        const cible = Number(el.dataset.compteur);
        const prefixe = el.dataset.prefixe || "";
        // Le HTML utilise des espaces insécables : on les conserve.
        const suffixe = (el.dataset.suffixe || "").replace(/&nbsp;/g, " ");
        const duree = 1900;
        const depart = performance.now();

        el.textContent = formater(0, prefixe, suffixe);

        const pas = (maintenant) => {
          const t = Math.min((maintenant - depart) / duree, 1);
          const adouci = 1 - Math.pow(1 - t, 3);
          el.textContent = formater(Math.round(cible * adouci), prefixe, suffixe);
          if (t < 1) requestAnimationFrame(pas);
        };

        requestAnimationFrame(pas);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -80px 0px" },
  );

  compteurs.forEach((el) => observateur.observe(el));
}
