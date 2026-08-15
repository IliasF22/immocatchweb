/**
 * Plausible uniquement : pas de cookie, pas de donnée personnelle, aucun
 * autre traceur. Les trois événements suivis sont `cta_click`,
 * `scroll_to_pricing` et `demo_view`.
 */

function envoyer(nom, props) {
  // Plausible peut ne pas être chargé (bloqueur, hors ligne) : on ne casse rien.
  if (typeof window.plausible !== "function") return;
  window.plausible(nom, props ? { props } : undefined);
}

export function initialiserAnalytics() {
  // --- cta_click : tous les appels à l'action portent un data-cta ---
  document.querySelectorAll("[data-cta]").forEach((lien) => {
    lien.addEventListener("click", () => {
      envoyer("cta_click", { position: lien.dataset.cta });
    });
  });

  // --- scroll_to_pricing : l'offre entre dans l'écran ---
  const offre = document.querySelector("#offre");
  if (offre && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        envoyer("scroll_to_pricing");
      },
      { threshold: 0.35 },
    );
    obs.observe(offre);
  }

  // --- demo_view : la vidéo est réellement lancée ---
  const video = document.querySelector("#demo-video");
  if (video) {
    video.addEventListener("play", () => envoyer("demo_view"), { once: true });
  }
}
