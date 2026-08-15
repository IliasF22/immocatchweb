/**
 * Accordéon de la FAQ.
 *
 * L'ouverture repose sur une transition `grid-template-rows: 0fr → 1fr`,
 * qui anime une hauteur automatique sans mesurer quoi que ce soit en
 * JavaScript. Les attributs ARIA suivent l'état réel du panneau.
 */
export function initialiserFaq() {
  const boutons = document.querySelectorAll(".faq__bouton");

  boutons.forEach((bouton) => {
    const panneau = document.getElementById(
      bouton.getAttribute("aria-controls"),
    );
    if (!panneau) return;

    bouton.addEventListener("click", () => {
      const ouvert = bouton.getAttribute("aria-expanded") === "true";

      // Une seule réponse ouverte à la fois : la liste reste lisible.
      if (!ouvert) {
        boutons.forEach((autre) => {
          if (autre === bouton) return;
          autre.setAttribute("aria-expanded", "false");
          document
            .getElementById(autre.getAttribute("aria-controls"))
            ?.removeAttribute("data-ouvert");
        });
      }

      bouton.setAttribute("aria-expanded", String(!ouvert));
      if (ouvert) panneau.removeAttribute("data-ouvert");
      else panneau.setAttribute("data-ouvert", "oui");
    });
  });
}
