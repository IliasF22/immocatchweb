/**
 * Timeline : synchronise la scène 3D avec le reste de la page.
 *
 *  - le mini-stepper du hero suit l'état réel de la scène (onde → transition
 *    → fiche), ce qui explique au visiteur ce qu'il est en train de regarder ;
 *  - cliquer sur une étape pilote la scène ;
 *  - quitter le hero met l'animation en pause côté scène (géré par
 *    l'IntersectionObserver interne), et y revenir relance l'alternance.
 */

const LIBELLES = ["Onde vocale", "Structuration", "Fiche prête"];

export function initialiserTimeline({ scene }) {
  const stepper = document.querySelector("#stepper");
  const etiquette = document.querySelector("#scene-etat");
  const items = stepper ? [...stepper.querySelectorAll(".stepper__item")] : [];

  function refleter(etat) {
    items.forEach((item) => {
      item.dataset.actif = Number(item.dataset.etape) === etat ? "oui" : "non";
    });
    if (etiquette) etiquette.textContent = LIBELLES[etat] ?? LIBELLES[0];
  }

  // Clic sur une étape : on force l'état correspondant de la scène.
  items.forEach((item) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      const etape = Number(item.dataset.etape);
      scene?.viser(etape >= 2 ? 1 : 0);
      refleter(etape);
    });
  });

  // Revenir sur le hero relance la lecture automatique.
  const hero = document.querySelector(".hero");
  if (hero && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) scene?.reprendreAuto();
      },
      { threshold: 0.55 },
    );
    obs.observe(hero);
  }

  return { refleter };
}
