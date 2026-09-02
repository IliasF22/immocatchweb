/**
 * Chapitres de la vidéo de démonstration.
 *
 * Un clic place la lecture au repère correspondant, et le chapitre en cours
 * se met en évidence au fil de la vidéo.
 *
 * Sans JavaScript, la liste reste lisible : les repères et les intitulés sont
 * écrits en clair dans le HTML, seul le saut au clic est perdu.
 */
export function initialiserChapitres() {
  const video = document.querySelector("#demo-video");
  const liste = document.querySelector("#chapitres");
  if (!video || !liste) return;

  const boutons = [...liste.querySelectorAll(".chapitre")];
  if (!boutons.length) return;

  const reperes = boutons.map((b) => Number(b.dataset.seconde) || 0);

  function marquer(index) {
    boutons.forEach((bouton, i) => {
      if (i === index) bouton.setAttribute("aria-current", "true");
      else bouton.removeAttribute("aria-current");
    });
  }

  boutons.forEach((bouton, i) => {
    bouton.addEventListener("click", () => {
      // `fastSeek` évite d'attendre l'image exacte quand le navigateur le
      // propose ; sinon on repositionne directement.
      if (typeof video.fastSeek === "function") video.fastSeek(reperes[i]);
      else video.currentTime = reperes[i];

      marquer(i);
      // La lecture peut être refusée (économie de données, réglage système) :
      // le saut reste effectué, on ignore simplement le refus.
      video.play().catch(() => {});
    });
  });

  // Le chapitre courant suit la lecture. `timeupdate` se déclenche environ
  // quatre fois par seconde, largement assez pour une liste de repères.
  video.addEventListener("timeupdate", () => {
    const t = video.currentTime;
    let courant = 0;
    for (let i = 0; i < reperes.length; i += 1) {
      if (t >= reperes[i]) courant = i;
    }
    marquer(courant);
  });
}
