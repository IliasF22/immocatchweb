/**
 * Chrome de la page : filet sous l'en-tête une fois la page défilée, et
 * barre d'appel à l'action collante sur mobile, qui n'apparaît qu'une fois
 * le hero dépassé (avant, les boutons du hero sont déjà à l'écran).
 */
export function initialiserEntete() {
  const entete = document.querySelector("#entete");
  const collant = document.querySelector("#cta-collant");
  const hero = document.querySelector(".hero");

  if (entete) {
    const majFilet = () => {
      entete.dataset.defile = window.scrollY > 8 ? "oui" : "non";
    };
    majFilet();
    window.addEventListener("scroll", majFilet, { passive: true });
  }

  if (collant && hero && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      ([e]) => {
        collant.dataset.visible = e.isIntersecting ? "non" : "oui";
      },
      { threshold: 0 },
    );
    obs.observe(hero);
  } else if (collant) {
    collant.dataset.visible = "oui";
  }
}
