/**
 * Progression au défilement.
 *
 * Tout élément `[data-progression]` reçoit la variable CSS `--p`, de 0 à 1,
 * selon son avancée dans l'écran. Ses descendants `[data-seuil="0.4"]`
 * reçoivent `data-atteint` quand la progression dépasse leur seuil.
 *
 * Sans JavaScript ou avec animations réduites, le CSS garde `--p: 1` et tout
 * est affiché d'emblée : rien n'est jamais masqué définitivement.
 */

const reduites = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initialiserProgression() {
  const elements = [...document.querySelectorAll("[data-progression]")];
  if (!elements.length) return;

  const tousAtteints = (el) =>
    el.querySelectorAll("[data-seuil]").forEach((s) => s.setAttribute("data-atteint", ""));

  if (reduites() || !("IntersectionObserver" in window)) {
    elements.forEach(tousAtteints);
    return;
  }

  const actifs = new Set();
  let planifie = false;

  function mesurer() {
    planifie = false;
    const h = window.innerHeight;
    actifs.forEach((el) => {
      const r = el.getBoundingClientRect();
      // 0 quand le haut de l'élément atteint 85 % de l'écran, 1 quand son bas
      // atteint 55 % : la ligne se remplit pendant la lecture, pas après.
      const p = Math.min(1, Math.max(0, (h * 0.85 - r.top) / (r.height + h * 0.3)));
      el.style.setProperty("--p", p.toFixed(3));
      el.querySelectorAll("[data-seuil]").forEach((s) => {
        s.toggleAttribute("data-atteint", p >= Number(s.dataset.seuil));
      });
    });
  }

  const planifier = () => {
    if (planifie) return;
    planifie = true;
    requestAnimationFrame(mesurer);
  };

  // On ne calcule que pour les éléments proches de l'écran.
  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((e) => (e.isIntersecting ? actifs.add(e.target) : actifs.delete(e.target)));
      planifier();
    },
    { rootMargin: "20% 0px 20% 0px" },
  );

  elements.forEach((el) => {
    el.style.setProperty("--p", "0");
    observateur.observe(el);
  });

  window.addEventListener("scroll", planifier, { passive: true });
  window.addEventListener("resize", planifier, { passive: true });
}
